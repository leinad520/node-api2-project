// server
const express = require('express');
const router = express.Router();

// database
const db = require('./data/db.js');

// middleware 
router.use(express.json())

// POST /api/posts
router.post('/', (req, res) => {
    const post = req.body;

    if (!post.title || !post.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }

    db.insert(post)
    .then(postId => {
        res.status(201).send(post);
    })
    .catch(err => res.status(500).send({ error: "There was an error while saving the post to the database" }))
})

// POST /api/posts/:id/comments
router.post('/:id/comments', (req, res) => {
    const {id} = req.params;
    const comment = req.body;

    if (!db.findById(id)) {
        res.status(404).json({message: "The post with the specified ID does not exist."})
    }
    if (!comment.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }

    db.insertComment(comment)
    .then(commentId => {
        res.status(201).send(comment)
    })
    .catch(err => {
        res.status(500).send({ error: "The posts information could not be retrieved." })
    })

})


module.exports = router;