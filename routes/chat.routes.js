const router = require("express").Router()
const Message = require("../models/Message.model")
const User = require("../models/User.model")

// Tipo ObjectId
const ObjectId = require("mongoose").Types.ObjectId;

router.post("/create", async (req, res, next) => {

    const { userId, message, receiverId } = req.body

    const author = await User.findById(userId)
    const receiver = await User.findById(receiverId)

    if (!author || !receiver || !message) return

    const newMessage = await Message.create({ message, author: userId, receiver: receiverId })

    author.update({ $addToSet: { messages: newMessage._id } })
    receiver.update({ $addToSet: { messages: newMessage._id } })


    res.json(newMessage)

})

router.get("/getMessages/:userId/:receiverId", async (req, res) => {

    const { userId, receiverId } = req.params

    if (!userId || !receiverId) return

    const author = await User.findById(userId)
    const receiver = await User.findById(receiverId)

    const messages = await Message.find({ $or: [{ author: ObjectId(author._id), receiver: ObjectId(receiver._id) }, { author: ObjectId(receiver._id), receiver: ObjectId(author._id) }] })

    res.json(messages)

})

router.get("/lastMessage/:userId/:receiverId", async (req, res, next) => {

    const { receiverId, userId } = req.params

    const lastMessage = await Message.find({ $or: [{ author: ObjectId(userId), receiver: ObjectId(receiverId) }, { author: ObjectId(receiverId), receiver: ObjectId(userId) }] }).sort({ _id: -1 }).limit(1)

    res.json(lastMessage)

})


module.exports = router