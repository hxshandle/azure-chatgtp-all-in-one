const keys = require('./key.json')

const axios = require('axios')
const authClient = require('axios-oauth-client')
const fs = require('fs')
const path = require('path')

let token = null
let svcUrl = null
let lastTokenTime = null

async function getToken() {
  const svcKey = keys
  svcUrl = svcKey.url
  const clientId = svcKey.uaa.clientid
  const clientSecret = svcKey.uaa.clientsecret
  const uaaUrl = svcKey.uaa.url

  // Check if token is expired
  if (token !== null) {
    if (Date.now() < lastTokenTime + 3600 * 1000) {
      return token
    }
  }
  console.log('Getting new token')
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
  })

  let getClientCredentials = authClient.clientCredentials(
    axios.create(),
    `${uaaUrl}/oauth/token`,
    clientId,
    clientSecret
  )
  const auth = await getClientCredentials()

  // const data = await resp.json()
  token = auth.access_token
  lastTokenTime = Date.now()
  console.log('lastTokenTime', lastTokenTime)
  return token
}

exports.queryGpt4 = async (messages) => {
  const token = await getToken()
  const data = {
    deployment_id: 'gpt-4',
    messages,
    max_tokens: 4000,
    temperature: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    top_p: 0.95,
    stop: 'null',
  }
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
  const response = await axios.post(`${svcUrl}/api/v1/completions`, data, {headers})

  return response.data
}
