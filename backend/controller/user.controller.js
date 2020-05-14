const User = require('../models/user.model')

exports.addUser = async (req, res) => {
    const newUser = new User(req.body)
    newUser.save(async (err, user) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            console.log(user)
            res.status(201).json(user)
        }
    })
}

exports.getUser = async (req, res) => {
    User.findById(req.params.id, async (err, user) => {
        if (err) {
            res.send(err)
        } else {
            if (user == null) res.status(404).send({description: "user not found"})
            else res.status(201).json(user)
        }
    })
}

exports.getAllUser = async (req, res) => {
    User.find(async (err, users) => {
        if (err) {
            res.send(err)
        } else {
            res.status(201).json(users)
        }
    })
}
