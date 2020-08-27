const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const passport = require("passport");
const validatePostInput = require("../../validation/post");


router.get(
    "/",
    passport.authenticate("jwt", {session:false}),
    (req, res) => {
        Post.find({ author: req.user.user_name})
            .then(posts => {
                return res.status(200).json(posts);
            })
            .catch(err => {
                return res.status(400).json({user: "Error fetching posts of logged in user"})
            });
    }
);

router.get("post/:id", (req, res)=> {
    Post.findById(req.params.id)
        .then(post => res.status(200).json(post))
        .catch(err => res.status(400).json({id: "Error fetching post by id"}));
});

router.get('author/:author', (req, res) => {
    Post.find({author: req.params.author})
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(400).json({author: "Error fetching posts of specific author", err}));
});

router.post("/create",
        passport.authenticate("jwt", {session: false}),
        (req, res) => {
            const author = req.user.user_name;
            const post = req.body;
            const { errors, isValid} = validatePostInput(req.body);
            if(!isValid){
                return res.status(400).json(errors);
            }
            post.author = req.user.user_name;
            const newPost = new Post(post);
            newPost.save()
                    .then(doc => res.json(doc))
                    .catch((err) => res.status(400).json({create: "Error creating new post", err}));

});


