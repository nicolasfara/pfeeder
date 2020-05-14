const Fodder = require('../models/fodder.model')

exports.addFodder = async (req, res) => {
    const newFodder = new Fodder(req.body)
    newFodder.save(async (err, fodder) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            console.log(fodder)
            res.status(201).json(fodder)
        }
    })
}

exports.getFodder = async (req, res) => {
    Fodder.findById(req.params.id, async (err, fodder) => {
        if (err) {
            res.send(err)
        } else {
            if (fodder == null) res.status(404).send({description: "fodder not found"})
            else res.status(201).json(fodder)
        }
    })
}

exports.getAllFodder = async (req, res) => {
    Fodder.find(async (err, fodders) => {
        if (err) {
            res.send(err)
        } else {
            res.status(201).json(fodders)
        }
    })
}
