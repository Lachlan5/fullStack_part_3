const mongoose = require('mongoose')
if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

let entryMode = false
if (process.argv.length > 3) entryMode = true

const password = process.argv[2]

const url = `mongodb+srv://lachlan:${password}@cluster0.qmgzc8w.mongodb.net/phoneBookApp`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

const Person = mongoose.model('Person', personSchema)

if (entryMode) {
    const name = process.argv[3]
    const number = process.argv[4]
    
    const person = new Person({
        name,
        number
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}