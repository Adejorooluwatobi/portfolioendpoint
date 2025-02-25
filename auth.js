let todos = []

exports.login = (req, res) => {
  const todo = req.body
  todos.push(todo)
  res.send(todo)
}

exports.register = (req, res) => {
  const todo = req.body
  todos.push(todo)
  res.send(todo)
}
