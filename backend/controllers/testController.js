const Post = require('../models/post');
const User = require('../models/user');
const mongoose = require('mongoose');
const fs = require('fs')
// const users = require('../database/seed/users.json');
// const posts = require('../database/seed/posts.json');
const path = require('path')

exports.seedDB = async function(req, res, next) {
    await seedUsers();
    await seedPosts();
    res.sendStatus(200);
}

const seedUsers = async function (req, res, next) {
    await User.collection.deleteMany({});

    let rawdata = fs.readFileSync(path.join(__dirname, '..', 'database', 'seed', 'users.json'));
    let users = JSON.parse(rawdata);

    // remove all instances of $oid under _id
    for (let user of users) {
        user._id = mongoose.Types.ObjectId(user._id['$oid']);
    }

    await User.collection.insertMany(users);
}

const seedPosts = async function (req, res, next) {
    await Post.collection.deleteMany({});

    let rawdata = fs.readFileSync(path.join(__dirname, '..', 'database', 'seed', 'posts.json'));
    let posts = JSON.parse(rawdata);

    // remove all instances of $oid under _id
    for (let post of posts) {
        post._id = mongoose.Types.ObjectId(post._id['$oid']);
    }

    await Post.collection.insertMany(posts);
}