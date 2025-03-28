require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { request } = require('http')
const cors = require('cors')
const PhonebookDB = require("./models/phonebooks")

const app = express()

app.options('*', cors()) 

morgan.token('body', request => JSON.stringify(request.body))
app.use(morgan(':method :url :body'))

app.use(cors())
app.use(express.static('dist'))


app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
  }));
  

let phonebook = [
    { 
      "id": "1",
      "name": "Artos Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    {   
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  PhonebookDB.find({}).then(phonebook => {
    response.json(phonebook)
  })
})

app.get('/info', async (request, response) => {
    response.send(`
        <h1>Phonebook has info for ${await PhonebookDB.countDocuments({})} people</h1>
        <p>${new Date()}</p>
    `);
  })


app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(person => person.id === id)
    response.json(person)

})


app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    response.status(204).end()
    phonebook = phonebook.filter(person => person.id !== id)
})

app.post('/api/persons', (request, response) => {

    const body = request.body
    console.log("hello")

    const person = new PhonebookDB({
        name: body.name,
        phone: body.phone,
    })

    person.save().then(savedperson => {
      response.json(savedperson)
    })

})

const PORT = 5001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)