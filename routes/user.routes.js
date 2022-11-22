const router = require("express").Router()
const User = require("../models/User.model")

router.post("/userDescription/:userId", async (req, res, next)=>{

    const {userDescription} = req.body
    const {userId} = req.params

    console.log(userDescription)

    if(!userDescription){
        res.status(400).json({errorMessage: "Debe haber contenido"})
    }

    try{
        await User.findByIdAndUpdate(userId, {personalDescription: userDescription})

        res.json({succesMessage: "Información personal cambiada"})
    }
    catch(err){
        console.log(err)
    }

})

router.get("/personalDescription/:userId", async (req, res, next)=>{

    const {userId} = req.params

    try{
        const foundUser = await User.findById(userId).select("personalDescription")

        res.json(foundUser.personalDescription)
    }
    catch(err){
        console.log(err)
    }

})

module.exports = router