const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const app = express()
const { queryGpt4 } = require('./utils')
const c = require('./key.json')

dotenv.config()

// Enable cross-origin resource sharing
app.use(cors())
app.use(express.json())
// Serve static files from the public directory
app.use(express.static('public', { index: 'index.html' }))

// create a post route named /v1/chat/completions
app.post('/v1/chat/completions', async (req, res) => {
  // return a JSON response with the following structure
  // console.log(req.body)
  const { messages } = req.body
  const ret = await queryGpt4(messages)
  res.send(ret)
  // res.send('hello');
})

// create a get route to return the keys from the keys.json file
app.get('/v1/keys', (req, res) => {
  console.log(keys)
  res.json(keys)
})

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
