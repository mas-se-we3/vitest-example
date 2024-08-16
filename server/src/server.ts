import bodyParser from 'body-parser'
import express from 'express'
import {
  addTodo,
  getCompletedTodos,
  getPendingTodos,
  removeTodoItem,
  updateTodoItem,
} from './data-access'

const app = express()
const port = 3003

app.use(bodyParser.json())

app.get('/api/todos/pending', (req, res) => {
  res.send(getPendingTodos())
})

app.get('/api/todos/completed', (req, res) => {
  res.send(getCompletedTodos())
})

app.post('/api/todos', (req, res) => {
  res.send(addTodo(req.body))
})

app.delete('/api/todos/:id', (req, res) => {
  removeTodoItem(req.params.id)
  res.sendStatus(204)
})

app.put('/api/todos', (req, res) => {
  res.send(updateTodoItem(req.body))
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
