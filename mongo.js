const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
let newName = ""
let newNumber = ""




const url =
  `mongodb+srv://tsalminen:${password}@cluster0-psvpa.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const entrySchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Entry = mongoose.model('Entry', entrySchema)

if ( process.argv.length>3 ) {
    try {
        newName = process.argv[3]
        newNumber = process.argv[4]

        const entry = new Entry({
            name: newName,
            number: newNumber,
        })
        
        entry.save().then(response => {
            console.log(`added ${entry.name} number ${entry.number} to phonebook`);
            mongoose.connection.close();
        })
    } catch (e) {
        console.log('ei nimeä tai numeroa')
    }

    
} else {
    Entry.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(entry => {
          console.log(entry.name, entry.number)
        })
        mongoose.connection.close()
      })
}

