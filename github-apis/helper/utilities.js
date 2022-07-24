import cheerio from "cheerio"

// @ extracts url from request query
export const extractUrl = (reqQuery) => {
   let url = ''
   for (let [ key , val] of Object.entries (reqQuery)) url += key.trim() === 'url' ? val : `&${key}=${val}`
   url = url.at (url.length - 1) === '/' ? url.substring (0 , url.length - 1) : url
   const isIndexPage = url.split ('/').length - 1 === 3 && !url.includes ('?') 
   url += isIndexPage ? '?tab=repositories' : ''
   return url
}

//@ gets static file
async function getStaticFile (url , html , res) {
   try {
     const $ = cheerio.load (html)
     let fileLink = `https://github.com${$('#raw-url').attr('href')}`
     res.send (Array(fileLink))
   } catch (err) {
     res.send (null)
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
     getContent (url , html , res)
   }
 }
 
 // @user Profile
 async function getProfile ( url , html , res) {
   try {
     const $ = cheerio.load (html)
     const userName = url.split('/')[3]
     let profileAvatar = $('.js-profile-editable-replace')
     .find ('img').attr ('src')
     
     const resp = {
       userName : userName.slice (0 , userName.indexOf('?')).replaceAll ('-'  , ' ') ,
       avatar : profileAvatar ,
       bio : $('div[class="p-note user-profile-bio mb-3 js-user-profile-bio f4"]').attr('data-bio-text') ,
       followers : $('span[class="text-bold color-fg-default"]').first().text() ,
       following : $('span[class="text-bold color-fg-default"]').last().text() ,
       totalRepositories : $(`a[data-tab-item="repositories"]`).find('span').first().text(),
       stars : $(`a[data-tab-item="stars"]`).find('span').first().text(),
       repos : []
     }

     $('#user-repositories-list')
     .find ('li')
     .each (function () {
       resp.repos.push ({
        repoName : $(this).find('a').first().text().trim() ,
        desc : $(this).find('p').text().trim()  ,
        programmingLanguage : $(this).find ('span[itemprop="programmingLanguage"]').text() ,
        url : `https://github.com${$(this).find('a').attr('href')}` ,
        lastUpdated : $(this).find ('relative-time').text() ,
        stars : (()=>{
          const isStarLabel = $(this).find ('a').find ('svg[aria-label="star"]').attr ('aria-label')
          if (isStarLabel)
             return $(this).find ('div[class="f6 color-fg-muted mt-2"]').find('a').first().text ().trim()
          return '0'
        })()
       })
     })
     
     if (resp.repos.length === 0) throw new Error ('pass it')
     
     res.send (resp)
   } catch (err) {
       getFiles(url , html , res)
   }
}

export async function gitHubFetcher (url , html , res) {
   await getProfile (url , html , res)
}
