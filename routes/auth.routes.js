const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User.model")
const isAuth = require("../middlewares/isAuth")

router.post("/signup", async (req, res, next) => {

    const { username, email, password } = req.body
    const usernameOk = username.toLowerCase()

    if (!username || !email || !password) {
        res.status(400).json({ errorMessage: "Completa todos los campos" })
        return
    }

    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/

    if (passwordRegex.test(password) == false) {
        res.status(400).json({ errorMessage: "La contraseña debe contener al menos 1 mayúscula, 1 minúscula y 1 número" })
        return
    }

    try {

        const foundUser = await User.findOne({ $or: [{ username: usernameOk }, { password }] })

        if (foundUser) {
            res.status(400).json({ errorMessage: "Credenciales ya registradas" })
            return
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        await User.create({ username: usernameOk, email, password: hashedPassword })
        res.json({ succesMessage: "Usuario creado" })

    }
    catch (err) {
        console.log(err)
    }
})

router.post("/login", async (req, res, next) => {

    const { username, password } = req.body
    const usernameOk = username.toLowerCase()

    if (!username || !password) {
        res.status(400).json({ errorMessage: "Debes rellanar todos los campos" })
        return
    }

    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/

    if (passwordRegex.test(password) == false) {
        res.status(400).json({ errorMessage: "La contraseña debe contener al menos 1 mayúscula, 1 minúscula y 1 número" })
        return
    }

    try {

        const foundUser = await User.findOne({ username: usernameOk })

        if (foundUser == null) {
            res.status(400).json({ errorMessage: "Usuario no encontrado" })
            return
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password)

        if (!isPasswordValid) {
            res.status(400).json({ errorMessage: "Contraseña incorrecta" })
        }

        const payload = {
            id: foundUser._id,
            username: foundUser.username,
            followers: foundUser.followers,
            posts: foundUser.posts,
            comments: foundUser.comments,
            friends: foundUser.friends,
            role: foundUser.role,
            postsLike: foundUser.postsLike,
            personalDescription: foundUser.personalDescription,
            profilePhoto: foundUser.profilePhoto
        }

        const authToken = jwt.sign(payload, process.env.SECRET_KEY, { algorithm: "HS256", expiresIn: "12h" })

        res.json({ authToken: authToken })

    }
    catch (err) {
        next(err)
    }

})

router.get("/verify", isAuth, async (req, res, next) => {
    try {
        res.json(req.payload)
    }
    catch (err) {
        next(err)
    }
})

router.get("/likesArr/:id", async (req, res, next) => {

    const { id } = req.params

    try {
        const likes = await User.findById(id).select("postsLike")
        res.json(likes)
    }
    catch (err) {
        next(err)
    }

})


module.exports = router