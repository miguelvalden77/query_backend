const router = require("express").Router()
const Message = require("../models/Message.model")
const User = require("../models/User.model")


router.post("/create", async (req, res, next)=>{

    const {userId, message, receiverId} = req.body

    const author = await User.findById(userId)
    const receiver = await User.findById(receiverId)

    if(!author || !receiver || !message) return

    const newMessage = await Message.create({message, author: userId, receiver: receiverId})

    author.update({$addToSet:{messages: newMessage._id}})
    receiver.update({$addToSet:{messages: newMessage._id}})

    res.json(newMessage)

})


module.exports = router