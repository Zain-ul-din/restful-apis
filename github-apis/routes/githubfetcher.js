import { Router } from "express"
import axios from "axios"
import cheerio from "cheerio"

export const gitHubFetcher = Router ()

async function getStaticFile (url , html , res) {
  try {
    const $ = cheerio.load (html)
    let fileLink = `https://github.com${$('#raw-url').attr('href')}`
    res.send (Array(fileLink))
  } catch (err) {
    console.log (err)
    res.send ('not found')
  }
}

//@ gets single file
async function getContent (url , html , res) {
  try {
   let code = []
   let isNotACodeFile = true
   const $ = cheerio.load (html)
   
   $('.js-blob-code-container')
   .find ('tr')
   .each (function () {
       isNotACodeFile = false
       code.push ($(this).text().trim())
   })
   
   if (isNotACodeFile) throw new Error ('pass it')
   res.send (code)
  } catch (err) {
    console.log (err)
    getStaticFile (url , html , res)
  }
}

//@ gets Repos files
async function getFiles ( url , html , res ) {
  try {
    // todos : Get URL
   
   const $ = cheerio.load (html)

   // js-details-container
   let repoFilesHTML =  undefined
   
   $('.js-details-container').each ( 
       function (idx , _) { if (idx === 2) repoFilesHTML = $(this).html() }
   )
   
   const $$ = cheerio.load (repoFilesHTML)
   
   let reposFile = []

   $$('a').each (function () {
       if ($$(this).attr('class') === 'Link--secondary') return
       reposFile.push ({
           name : $$(this).text() ,
           url : `https://github.com${$$(this).attr ('href')}`
       })
   })
   
   res.send (reposFile)
  } catch (err) {
    console.log (err)
    getContent (url , html , res)
  }
}

// @user Profile
async function getProfile ( url , html , res) {
  try {
    const $ = cheerio.load (html)
    const userName = url.split('/')[3]
    const resp = {
      userName : userName.slice (0 , userName.indexOf('?')).replaceAll ('-'  , ' ') ,
      repos : []
    }
    
    $('#user-repositories-list')
    .find ('li')
    .each (function () {
      resp.repos.push ({
       repoName : $(this).find('a').first().text().trim() ,
       desc : $(this).find('p').text().trim()  ,
       url : `https://github.com${$(this).find('a').attr('href')}`
      })
    })

    if (resp.repos.length === 0) throw new Error ('pass it')
    
    res.send (resp)
  } catch (err) {
      console.log (err)
      getFiles(url , html , res)
  }
}

/*
  Test : 
    getProfile is working ..
    getFiles is working...
    getSingleFile is working..
    getStaticFile is working...
*/
async function get (req , res) {
  try {
    
    let url  =  ((query) => {
      let _url = ''
      for (let [ key , val] of Object.entries (query)) _url += key.trim() === 'url' ? val : `&${key}=${val}`
      return _url
    })(req.query)
    
    const isIndexPage = url.split ('/').length - 1 === 3 && !url.includes ('?') 
    url += isIndexPage ? '?tab=repositories' : ''
    console.log ( 'URL going to fetch : ', url)
    const pageContent = await axios.get (url)
    var html = pageContent.data
    return await getProfile (url , html , res)
  } catch  (err) {
    console.log (err)
    res.send ("Invalid Request")
  }
}

// user-repositories-list
gitHubFetcher
.get ('/get/' , get)

