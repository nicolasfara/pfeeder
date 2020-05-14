const Notification = require('../models/notifcation.model')

exports.addNotification = async (req, res) => {
    const notification = new Notification(req.body)
    notification.save(async (err, notification) => {
        if (err) {
            res.send(err)
        } else {
            res.status(201).json(notification)
        }
    })
}

exports.getUserNotification = async (req, res) => {
    await Notification.where('userId').equals(req.params.id)
        .exec(async (err, not) => {
            if (err) {
                res.send(err)
            } else {
                res.status(201).json(not)
            }
        })
}
