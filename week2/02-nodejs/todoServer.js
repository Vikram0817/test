/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const fs = require('fs');
const FILE_PATH = "./todos.json";

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/todos", (req, res) => {
  fs.readFile(FILE_PATH, "utf-8", (err, data) => {
    if(err){
      return res.status(500).json({ error: 'Couldn\'t read todo data' });
    }
    res.send(JSON.parse(data));
  })
})

app.get("/todos/:id", (req, res) => {
  let id = req.params.id;
  fs.readFile(FILE_PATH, "utf-8", (err, data) => {
    if(err){
      return res.status(500).json({ error: 'Couldn\'t read todo data' });
    }
    
    let todoList = JSON.parse(data);
    
    let todo = todoList.find(val => val.id && val.id.toString() === id);
    if(!todo){
      return res.status(404).send("Not Found");
    }

    res.send(todo);
  })
})

app.post("/todos", (req, res) => {
  let todo = req.body;

  fs.readFile(FILE_PATH, "utf-8", (err, data) => {
    if(err){
      return res.status(500).json({ error: 'Couldn\'t read todo data' });
    };

    let todoList = JSON.parse(data);
    todoList.push(todo);

    fs.writeFile(FILE_PATH, JSON.stringify(todoList), err => {
      if(err){
        return res.status(500).json({ error: 'Couldn\'t read todo data' });
      };

      res.status(201).json({ id: todo.id })
    })
  })
})

app.put("/todos/:id", (req, res) => {
  let id = req.params.id; // get id 
  let updatedTodo = req.body; // get updated todo

  fs.readFile(FILE_PATH, "utf-8", (err, data) => { // read file
    if(err){
      return res.status(500).json({ error: 'Couldn\'t read todo data' });
    }
    
    let todoList = JSON.parse(data); // make array of file's data
    
    let idx = todoList.findIndex(val => val.id && val.id.toString() === id); // find idx of todo to update
    if(idx == -1){
      return res.status(404).send("Not Found");
    }

    todoList[idx] = updatedTodo; // updating todo

    fs.writeFile(FILE_PATH, JSON.stringify(todoList), err => {
      if(err){
        return res.status(500).json({ error: 'Couldn\'t read todo data' });
      };

      res.status(201).send(updatedTodo)
    })    
  })
})


app.delete("/todos/:id", (req, res) => {
  let id = req.params.id;
  
  fs.readFile(FILE_PATH, "utf-8", (err, data) => { // read file
    if(err){
      return res.status(500).json({ error: 'Couldn\'t read todo data' });
    }
    
    let todoList = JSON.parse(data); // make array of file's data
    
    let updatedList = todoList.filter(val => val.id != id);
    if(todoList.length == updatedList.length){
    }

    fs.writeFile(FILE_PATH, JSON.stringify(updatedList), err => {
      if(err){
        return res.status(500).json({ error: 'Couldn\'t read todo data' });
      };

      res.status(201).json({msg: "deleted"})
    })    
  })
})

app.use((req, res) => res.status(404).json("Not Found"));

app.listen(port, () => {
  console.log(`Listing fro port: ${port}`)
})
module.exports = app;