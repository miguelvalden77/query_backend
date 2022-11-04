const {Schema, model} = require("mongoose")

const postSchema = new Schema(
    {
        title:{
            type: String,
            required: true
        },
        photo: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        comments: [{
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }],
        likes:{
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

const Post = model("Post", postSchema)

module.exports = Post
