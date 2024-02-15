import express from 'express'
import bcrypt from 'bcrypt'

const app = express()
const port = 3001

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const database = {
  users: [
    {
      id: '123',
      name: 'Jenny',
      email: 'jenny@onlyfans.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'jenny@onlyfans.com',
    },
  ],
}

app.get('/', (req, res) => {
  console.log({
    message: 'FACE SERVER RUNNING',
    users: database.users,
  })
  res.json({
    message: 'FACE SERVER RUNNING',
    users: database.users,
  })
})

app.post('/signin', (req, res) => {
  // Load hash from your password DB.
  bcrypt
    .compare(
      'apples',
      '$2b$05$/KtRBUW6RkuCWRTBRFR9WeYyarQbz3wu7Ku5kODyhyAUUCH6pRWr.'
    )
    .then(function (result) {
      console.log(result)
      result == true
    })

  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json('success')
  } else {
    res.status(400).json('error logging in')
  }
})

app.post('/register', (req, res) => {
  const { email, password, name } = req.body
  const saltRounds = Math.floor(Math.random() * (10 - 5 + 1)) + 5 // random number between 5 & 10

  bcrypt.hash(password, saltRounds).then(function (hash) {
    // Store hash in your password DB.
    console.log(hash)
  })

  database.users.push({
    id: '125',
    email,
    password,
    name,
    entries: 0,
    joined: new Date(),
  })

  const newUser = database.users[database.users.length - 1]
  console.log('Registered new user:')
  console.log(newUser)
  res.status(200).json(newUser)
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  const user = database.users.find(user => user.id === id)
  const not_found = 'not found'
  let found = false

  if (user) {
    found = true
    res.json(user)
  }

  if (!found) {
    res.status(400).json(not_found)
  }

  const log = found ? user : not_found
  console.log('Fetching user:', log)
})

app.get('/profile:userId', (req, res) => {})

app.put('/image', (req, res) => {
  const { id } = req.body
  const user = database.users.find(user => user.id === id)
  const not_found = 'not found'
  let found = false

  if (user) {
    found = true
    user.entries++
    return res.json(
      `User ${user.name} image entries updated to: ${user.entries}`
    )
  }

  if (!found) {
    res.status(400).json(not_found)
  }
})

// bcrypt.hash(myPlaintextPassword, saltRounds).then(function (hash) {
//   // Store hash in your password DB.
// })

// // Load hash from your password DB.
// bcrypt.compare(myPlaintextPassword, hash).then(function (result) {
//   // result == true
// })

/*
  /                --> res = server running
  /signin          --> POST success/fail
  /register        --> POST = user
  /profile/:userId --> GET = user
  /image           --> PUT --> user/count
*/

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
