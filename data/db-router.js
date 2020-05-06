const express = require("express");

const db = require("./db.js");

const router = express.Router();

router.post('/', (req, res) => {
    const newPost = req.body;
    if (!newPost.title || !newPost.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }

    else {
        db.insert(newPost)
            .then(() => {
                res.status(201).json(newPost)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    message: "Error Posting the data",
                });
            });
    }
});

router.post('/:id/comments', (req, res) => {
    const newComment = req.body;
    const id = req.params.id;
    newComment.post_id = id;

    if (!newComment.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
    else {
        db.findById(id)
            .then(comment => {
                const [commentObj] = comment;
                if (commentObj) {
                    db.insertComment(newComment)
                        .then(() => {
                            res.status(201).json(newComment);
                        })
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({ error: "There was an error while saving the comment to the database" })
                        })
                }
                else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
    }
});

router.get('/', (req, res) => {
    db.find()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The posts information could not be retrieved.",
            });
        });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(comment => {
            const [commentObj] = comment
            if (commentObj) {
                res.status(200).json(commentObj);
            }
            else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
});

router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(comment => {
            const [commentObj] = comment
            if (commentObj) {
                db.findPostComments(id)
                    .then(data => {
                        res.status(200).json(data)
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ error: "The comments information could not be retrieved." })
                    })
            }
            else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(comment => {
            const [commentObj] = comment;
            if (commentObj){
                db.remove(id)
                    .then(() => {
                        res.status(200).json(commentObj)
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ error: "The post could not be removed." })
                    })
            }
            else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post could not be removed." })
        })
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const newComment = req.body;
    if (!newComment.title || !newComment.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    db.findById(id)
        .then(comment => {
            const [commentObj] = comment
            if (commentObj) {
                db.update(id, newComment)
                    .then(() => {
                        res.status(200).json(newComment)
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ error: "The post information could not be modified." })
                    })
            }
            else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
});

module.exports = router;
