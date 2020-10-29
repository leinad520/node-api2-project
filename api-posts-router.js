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
    comment.post_id = id;

    if (!comment.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }

    db.findById(id)
    .then(post => {
        if (post.length === 0) {
            res.status(404).send({ message: "The post with the specified ID does not exist." })
        }
        else {
            db.insertComment(comment)
            .then(commentIdObj => {
                res.status(201).send(comment)
            })
            .catch(err => res.status(500).send({error: err}))
        }
    })
    .catch(err => {
        res.status(500).send({error: "The posts information could not be retrieved."})
    })
});


// GET /api/posts
router.get('/', (req, res) => {
    db.find()
    .then(postsArr => {
        res.status(200).send({postsArr})
    })
    .catch(err => {
        res.status(500).send({error: "The posts information could not be retrieved"})
    })
})

// GET /api/posts/:id
router.get('/:id', (req, res) => {
    const {id} = req.params;

    db.findById(id)
    .then(post => {
        if (post.length === 0) {
            res.status(404).send({ message: "The post with the specified ID does not exist." })
        } else {
            res.status(200).send(post);
        }
    })
    .catch(err => {
        res.status(500).send({error: "The posts information could not be retrieved"})
    })
})

// GET /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
    const {id} = req.params;

    db.findPostComments(id)
    .then(commentsArr => {
        if (commentsArr.length === 0) {
            res.status(404).send({ message: "The post with the specified ID does not exist." })
        } else {
            res.status(200).send(commentsArr);
        }
    })
    .catch(err => {
        res.status(500).send({error: "The posts information could not be retrieved"})
    })
})

// DELETE /api/posts/:id	
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    
    db.findById(id)
    .then(post => {
        if (post.length === 0) {
            res.status(404).send({message: "The post with the specified ID does not exist." })
        } else {
            db.remove(id)
            .then(numDeleted => {
                res.status(202).send(post)
            })
        }
    })
    .catch(err => res.status(500).send({message: "The post could not be removed"}))
})

// PUT /api/posts/:id
router.put('/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    if (!changes.title || !changes.contents) {
        res.status(400).send({ errorMessage: "Please provide title and contents for the post." })
    };

    db.update(id, changes)
    .then(updateCount => {
        if (updateCount === 0) {
            res.status(404).send({ message: "The post with the specified ID does not exist." })
        }
        res.status(200).send(changes)
    })
    .catch(err => res.status(500).send({ error: "The post information could not be modified." }))
})

module.exports = router;