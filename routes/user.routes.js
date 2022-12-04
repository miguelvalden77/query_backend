const router = require("express").Router()
const User = require("../models/User.model")

router.post("/userDescription/:userId", async (req, res, next)=>{

    const {userDescription} = req.body
    const {userId} = req.params

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

router.post("/:id/profilePhoto", async (req, res, next)=>{

    const {id} = req.params
    const {url} = req.body

    try{

        if(url){
            await User.findByIdAndUpdate(id, {profilePhoto: url})
            res.json({succesMessage: "Foto cambiada"})
            return
        }

    }
    catch(err){
        console.log(err)
    }

})

router.get("/:username/all", async (req, res, next)=>{

    const {username} = req.params

    try{

        const response = await User.find({username: {$regex: username}})
        res.json(response)

    }
    catch(err){
        console.log(err)
    }

})

router.get("/:id", async (req, res, next)=>{

    const {id} = req.params

    try{

        const user = await User.findById(id).populate("posts")
        res.json(user)

    }
    catch(err){
        console.log(err)
    }

})

router.post("/add/:userId", async (req, res, next)=>{

    const {userId} = req.params
    const {id} = req.body

    try{
        
        // const friend = User.findById(userId)

        await User.findByIdAndUpdate(id, {$addToSet: {friends: userId}})
        res.json({succesMessage: "Amigo añadido"})

    }
    catch(err){
        console.log(err)
    }
})

router.post("/substract/:userId", async (req, res, next)=>{

    const {userId} = req.params
    const {id} = req.body

    try{
        
        // const friend = User.findById(userId)

        await User.findByIdAndUpdate(id, {$pull: {friends: userId}})
        res.json({succesMessage: "Amigo eliminado"})

    }
    catch(err){
        console.log(err)
    }
})

router.get("/friends/:username", async (req, res, next)=>{

    const {username} = req.params

    try{
        const friendsArray = await User.findOne({username}).select("friends")
        res.json(friendsArray.friends)
    }
    catch(err){
        console.log(err)
    }

})

router.get("/friendVerify/:userId/:username", async (req, res, next)=>{

    const {username, userId} = req.params

    try{

        const usuario = await User.findOne({$and: [{username: username}, {friends: userId}]})
        console.log(usuario)

        if(usuario == null){
            await User.findOneAndUpdate({username: username}, {$addToSet: {friends: userId}})
            res.json({succesMessage: "Amigo añadido"})
            return
        }

        await User.findOneAndUpdate({username}, {$pull: {friends: userId}})
        res.json({succesMessage: "Amigo eliminado"})

    }
    catch(err){
        console.log(err)
    }

})

module.exports = router