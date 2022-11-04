const {Schema, model} = require("mongoose")

const commentSchema = new Schema(
{
    description:{
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    }
},
{
    timestamps: true
})

const Comment = model("Comment", commentSchema)

module.exports = Comment
