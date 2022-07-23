import express from 'express'
import { gitHubFetcher } from '../routes/githubfetcher.js'

const app = express ()
const PORT = process.env.PORT || 8000

app.use ('/' , gitHubFetcher)

app.listen (PORT , ()=> {console.log ('working')})

