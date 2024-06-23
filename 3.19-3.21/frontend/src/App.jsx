import { useState, useEffect } from 'react'
import personService from './services/person'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  const deletePerson = (id, name) => {
    if (!confirm(`Delete ${name} ?`)) return
    const changedPersons = persons.filter(n => n.id !== id)
    personService.remove(id)
      .then(() => {
        setPersons(changedPersons)
      })
  }

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const displayNotification = (message, type) => {
    setNotificationType(type)
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { 
      name: newName,
      number: newNumber,
    }

    const matchedPerson = persons.find(person => person.name === newName)

    if (matchedPerson === undefined) { //new person
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        displayNotification(`Added ${newName}`, 'notification')
      })
      .catch(error => {
        console.log(error.response.data.error)
        displayNotification(`Error: ${error.response.data.error}`, 'error')
      })
      
      return
    }

    if (!confirm(`${newName} is already added to phonebook, replace old number with new one?`)) return
    
    //replace old name with new
    const id = matchedPerson.id
    personService
      .update(id, personObject)
      .then(returnedPerson => {
        setPersons(persons.map(p => p.id !== id ? p : returnedPerson))
        displayNotification(`Changed ${newName}`, 'notification')
      })
      .catch(error => {
        displayNotification(
          `Information on ${newName} has already been removed from server`,
          'error'
        )
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App