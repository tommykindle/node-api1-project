// implement your API here
const express = require("express");
const server = express();
const Db = require("./data/db.js");
const port = 8000;
//middleware
server.use(express.json());

server.listen(port, () =>
    console.log(`server is listening on port ${port}`)
);


// get all users

server.get("/api/users", (req, res) => {
    Db.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({ err })
        })
})


//create a user

server.post("/api/users", (req, res) => {
    const { name, bio } = req.body
    if (!name || !bio) {
        return res.status(400).json({ message: "Please provide name and bio for the user" })
    }
    Db.insert({ name, bio })
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            res.status(500).json({ err })
        })

})

// get user by id

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id
    Db.findById(id)
        .then(users => {
            if (users) {
                res.status(200).json(users)
            } else {
                res.status(404).json({ message: "The user with the specified id does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ err })
        })
})

// edit user by id

server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const { name, bio } = req.body;
    if (!name || !bio) {
        return res.status(400).json({ message: "Please provide a name and bio for the user" })
    }
    Db.update(id, { name, bio })
        .then(updatedUser => {
            if (updatedUser) {
                Db.findById(id)
                    .then(user => {
                        res.status(201).json(user)
                    })
            } else {
                res.status(404).json({ message: "The user with the specified id does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

//delete user by id

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    Db.remove(id)
        .then(deleted => {
            if (deleted) {
                res.status(204).end()
            } else {
                res.status(404).json({ message: "The user with the specified id does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "There was an error deleting the user from the database" })
        })
})