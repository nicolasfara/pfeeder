const Feed = require('../models/feed.model')

exports.addFeed = async (req, res) => {
    const newFeed = new Feed(req.body)
    newFeed.save(async (err, feed) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            console.log(feed)
            res.status(201).json(feed)
        }
    })
}

exports.getFodderFeed = async (req, res) => {
    await Feed.where('fodderId').equals(req.params.id)
        .exec(async (err, feed) => {
            if (err) {
                res.send(err)
            } else {
                res.status(201).json(feed)
            }
        })
}

exports.getPeetFeed = async (req, res) => {
  await Feed.where('petId').equals(req.params.id)
      .exec(async (err, feed) => {
          if (err) {
              res.send(err)
          } else {
              res.status(201).json(feed)
          }
      })
}
exports.getAllFeed = async (req, res) => {
    Feed.find(async (err, feeds) => {
        if (err) {
            res.send(err)
        } else {
            res.status(201).json(feeds)
        }
    })
}
