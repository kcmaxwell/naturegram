const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const {nanoid} = require('nanoid');

const Session = new Schema({
    refreshToken: {
        type: String,
        default: "",
    },
})

const UserSchema = new Schema({
    username: {type: String, required: true },
    fullName: { type: String, required: true },
    profilePicUrl: { type: String },
    posts: [{ type: String, ref: 'Post' }],
    savedPosts: [{ type: String, ref: 'Post' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    refreshToken: {
        type: [Session],
    },
});

// remove refreshToken from the response
UserSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.refreshToken;
        return ret;
    },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const passportLocalMongoose = require("passport-local-mongoose");

// const Session = new Schema({
//   refreshToken: {
//     type: String,
//     default: "",
//   },
// });

// const User = new Schema({
//   fullName: {
//     type: String,
//     default: "",
//   },
//   authStrategy: {
//     type: String,
//     default: "local",
//   },
//   points: {
//     type: Number,
//     default: 50,
//   },
//   refreshToken: {
//     type: [Session],
//   },
// });

// //Remove refreshToken from the response
// User.set("toJSON", {
//   transform: function (doc, ret, options) {
//     delete ret.refreshToken;
//     return ret;
//   },
// });

// User.plugin(passportLocalMongoose);
// module.exports = mongoose.model("User", User);
