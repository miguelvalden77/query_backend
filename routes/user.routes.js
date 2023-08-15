const router = require("express").Router()
const isAuth = require("../middlewares/isAuth")
const User = require("../models/User.model")

router.post("/userDescription/:userId", isAuth, async (req, res, next) => {

    const { userDescription } = req.body
    const { userId } = req.params

    if (!userDescription) {
        res.status(400).json({ errorMessage: "Debe haber contenido" })
    }

    try {
        await User.findByIdAndUpdate(userId, { personalDescription: userDescription })

        res.json({ succesMessage: "Información personal cambiada" })
    }
    catch (err) {
        res.json(err)
        next(err)
    }

})

router.get("/personalDescription/:userId", isAuth, async (req, res, next) => {

    const { userId } = req.params

    try {
        const foundUser = await User.findById(userId).select("personalDescription")

        res.json(foundUser.personalDescription)
    }
    catch (err) {
        res.json(err)
        next(err)
    }

})

router.post("/:id/profilePhoto", async (req, res, next) => {

    const { id } = req.params
    const { url } = req.body

    try {

        if (url) {
            await User.findByIdAndUpdate(id, { profilePhoto: url })
            res.json({ succesMessage: "Foto cambiada" })
            return
        }

    }
    catch (err) {
        res.json(err)
        next(err)
    }

})

router.get("/:username/all", async (req, res, next) => {

    const { username } = req.params

    try {

        const response = await User.find({ username: { $regex: username } })
        res.json(response)

    }
    catch (err) {
        res.json(err)
        next(err)
    }

})

router.get("/:id", async (req, res, next) => {

    const { id } = req.params

    try {

        const user = await User.findById(id).populate("posts")
        res.json(user)

    }
    catch (err) {
        next(err)
    }

})


router.get("/friends/:username", isAuth, async (req, res, next) => {

    const { username } = req.params

    try {
        const friendsArray = await User.findOne({ username }).select("friends")
        res.json(friendsArray.friends)
    }
    catch (err) {
        next(err)
    }

})

router.get("/friends/all/:username", isAuth, async (req, res, next) => {

    const { username } = req.params

    try {
        const friendsArray = await User.findOne({ username }).select("friends").populate("friends")
        res.json(friendsArray)
    }
    catch (err) {
        next(err)
    }

})

router.get("/friendVerify/:userId/:username", isAuth, async (req, res, next) => {

    const { username, userId } = req.params

    try {

        const usuario = await User.findOne({ $and: [{ username: username }, { friends: userId }] })

        if (usuario == null) {
            const user = await User.findOneAndUpdate({ username: username }, { $addToSet: { friends: userId } })
            await User.findByIdAndUpdate(userId, { $addToSet: { followers: user._id } })
            res.json({ succesMessage: "Amigo añadido" })
            return
        }

        await User.findOneAndUpdate({ username }, { $pull: { friends: userId } })
        await User.findByIdAndUpdate(userId, { $pull: { followers: usuario._id } })
        res.json({ succesMessage: "Amigo eliminado" })

    }
    catch (err) {
        next(err)
    }

})

module.exports = router