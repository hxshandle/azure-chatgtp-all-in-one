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

const checkAuthorization = (req, res, next) => {
  // 检查 Authorization 值
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  // 在这里执行任何其他身份验证逻辑，例如验证令牌的有效性
  const token = req.headers.authorization.split(' ')[1];

  // 检查令牌是否与环境变量中的 sectAccessKey 相匹配
  if (token !== process.env.sectAccessKey) {
    return res.status(403).json({ error: 'Invalid authorization token' });
  }

  // 继续处理下一个中间件或路由处理程序
  next();
};

// Serve static files from the public directory
app.use(express.static('public', { index: 'index.html' }))
// 应用中间件到指定路由
app.use('/v1/chat/completions', checkAuthorization);

// create a post route named /v1/chat/completions
app.post('/v1/chat/completions', async (req, res) => {
  // return a JSON response with the following structure
  // console.log(req.body)
  // here add a auth check
  

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
