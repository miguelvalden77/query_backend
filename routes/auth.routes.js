const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User.model")
const isAuth = require("../middlewares/isAuth")

router.post("/signup", async (req, res, next)=>{

    const {username, email, password} = req.body
    const usernameOk = username.toLowerCase()

    if(!username || !email || !password){
        res.status(400).json({errorMessage: "Completa todos los campos"})
        return
    }

    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/

    if(passwordRegex.test(password) == false){
        res.status(400).json({errorMessage: "La contraseña debe contener al menos 1 mayúscula, 1 minúscula y 1 número"})
        return
    }

    try{

        const foundUser = await User.findOne({$or:[{username: usernameOk}, {password}]})

        if(foundUser){
            res.status(400).json({errorMessage: "Credenciales ya registradas"})
            return
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        await User.create({username: usernameOk, email, password: hashedPassword})
        res.json({succesMessage: "Usuario creado"})

    }
    catch(err){
        console.log(err)
    }
})

router.post("/login", async (req, res, next)=>{

    const {username, password} = req.body
    const usernameOk = username.toLowerCase()

    if(!username || !password){
        res.status(400).json({errorMessage: "Debes rellanar todos los campos"})
        return
    }
     
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/

    if(passwordRegex.test(password) == false){
        res.status(400).json({errorMessage: "La contraseña debe contener al menos 1 mayúscula, 1 minúscula y 1 número"})
        return
    }

    try{

        const foundUser = await User.findOne({username: usernameOk})

        if(foundUser == null){
            res.status(400).json({errorMessage: "Usuario no encontrado"})
            return
        }

        const isPasswordValid = bcrypt.compare(password, foundUser.password)

        if(!isPasswordValid){
            res.status(400).json({errorMessage: "Contraseña incorrecta"})
        }

        const payload = {
            id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email,
            password: foundUser.password,
            posts: foundUser.posts,
            comments: foundUser.comments,
            role: foundUser.role
        }

        const authToken = jwt.sign(payload, process.env.SECRET_KEY, {algorithm: "HS256", expiresIn: "12h"})

        res.json({authToken: authToken})

    }
    catch(err){
        console.log(err)
    }

})

router.get("/verify", isAuth, async (req, res, next)=>{
    try{
        res.json(req.payload)
    }
    catch(err){
        console.log(err)
    }
})



module.exports = router