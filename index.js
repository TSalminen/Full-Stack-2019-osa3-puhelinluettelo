require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
//const mongoose = require('mongoose')
const Entry = require('./models/entry')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())

//const morganTinyString = ':method :url :status :res[content-length] - :response-time ms'
//const morganOma = ':method :url :status :res[content-length] - :response-time ms'
app.use(morgan('tiny'))



// let persons = [
//     { 
//       name: 'Arto Hellas', 
//       number: '040-123456',
//       id: 1
//     },
//     { 
//       name: 'Ada Lovelace', 
//       number: '39-44-5323523',
//       id: 2
//     },
//     { 
//       name: 'Dan Abramov', 
//       number: '12-43-234345',
//       id: 3
//     },
//     { 
//       name: 'Mary Poppendieck', 
//       number: '39-23-6423122',
//       id: 4
//     }
//   ]



app.get('/', (req, res) => {
  morgan(':method :url :status :res[content-length] - :response-time ms')
  morgan('tiny')
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response, next) => {
  Entry.find({})
  .then(entries => {
    const numberOfPersons = entries.length
    const date = new Date()
    const infoString = `
      <div>Phonebook has info for ${numberOfPersons} people</div>
      <div>${date}</div>
      `
    response.send(infoString)
  })
  .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Entry.find({})
  .then(entries => {
    response.json(entries.map(entry => entry.toJSON()))
  })
  .catch(error => next(error))
  // vanha toiminnallisuus
  // response.json(persons)
});

app.get('/api/persons/:id', (request, response, next) => {
  Entry.findById(request.params.id)
    .then(entry => {
      if (entry) {
        response.json(entry.toJSON())
      } else {
        response.status(404).end()
      }    
    })
    .catch(error => next(error))

  // *** Vanhaa toiminnallisuutta ***
  // const id = Number(request.params.id)
  // const person = persons.find(note => note.id === id)

  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end()
  // }
  
})

app.delete('/api/persons/:id', (request, response, next) => {
  Entry.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// *** Vanhaa toiminnallisuutta ***
// app.delete('/api/persons/:id', (request, response) => {
//   const id = request.params.id
//   persons = persons.filter(person => person.id !== id)

//   response.status(204).end()
// })

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  } else if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const entry = new Entry({
    name: body.name,
    number: body.number,
  })

  entry.save().then(savedEntry => {
    response.json(savedEntry.toJSON())
  })
  .catch(error => next(error))
  
  // *** Vanhaa toiminnallisuutta ***
  // const id = Math.floor(Math.random() * Math.floor(100000))
  // body.id = id

  // persons = persons.concat(body)

  // response.json(body)
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})