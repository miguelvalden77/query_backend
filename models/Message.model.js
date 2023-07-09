const {Schema, model} = require("mongoose")

const messageSchema = new Schema(
{
    message:{
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
})

const Message = model("Message", messageSchema)

module.exports = Message