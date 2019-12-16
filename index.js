const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

//const morganTinyString = ':method :url :status :res[content-length] - :response-time ms'
//const morganOma = ':method :url :status :res[content-length] - :response-time ms'
app.use(morgan('tiny'))


let persons = [
    { 
      name: 'Arto Hellas', 
      number: '040-123456',
      id: 1
    },
    { 
      name: 'Ada Lovelace', 
      number: '39-44-5323523',
      id: 2
    },
    { 
      name: 'Dan Abramov', 
      number: '12-43-234345',
      id: 3
    },
    { 
      name: 'Mary Poppendieck', 
      number: '39-23-6423122',
      id: 4
    }
  ]


const testi = () => {
  const numberOfPersons = persons.length
  const date = new Date()
  return ( `
  <div>Phonebook has info for ${numberOfPersons} people</div>
  <div>${date}</div>
  `
  )
}

app.get('/', (req, res) => {
  morgan(':method :url :status :res[content-length] - :response-time ms')
  morgan('tiny')
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(note => note.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
  
})

app.get('/info', (req, res) => {
  res.send(testi())
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  } else if (persons.find(p => p.name === person.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const id = Math.floor(Math.random() * Math.floor(100000))
  person.id = id

  persons = persons.concat(person)

  response.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})