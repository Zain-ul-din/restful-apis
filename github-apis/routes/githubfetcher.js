import { Router } from "express"
import axios from "axios"

import {
  extractUrl ,
  gitHubFetcher as cheerio
} from '../helper/utilities.js'

export const gitHubFetcher = Router ()

async function get (req , res) {
  try {
    let url  =  extractUrl (req.query)
    console.log ( 'URL going to fetch : ', url)
    const pageContent = await axios.get (url)
    var html = pageContent.data 
    cheerio (url , html , res)
  } catch  (err) { 
    res.send (null)
   }
}

// user-repositories-list
gitHubFetcher
.get ('/' , (req , res) => res.send ('url/get?url=<github url : any>/'))
.get ('/fetch/' , get)

