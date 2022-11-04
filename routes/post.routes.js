const router = require("express").Router()
const Comment = require("../models/Comment.model")
const User = require("../models/User.model")
const Post = require("../models/Post.model")


router.post("/create", async (req, res, next)=>{

    const {title, photo, author} = req.body

    if(!title || !photo || !author){
        res.status(400).json({errorMessage: "Deben rellenarse todos los campos"})
        return
    }

    try{

        const createdPost = await Post.create({author, title, photo})
        await User.findByIdAndUpdate(author, {$addToSet: {posts: createdPost._id}})

        res.json({succesMessage: "Post creado"})

    }
    catch(err){
        console.log(err)
    }

})

router.post("/delete/:id", async (req, res, next)=>{

    const {id} = req.params

    try{

        const deletedPost = await Post.findByIdAndDelete(id).populate("author")
        await User.findByIdAndUpdate(deletedPost.author._id, {$pull: {posts: deletedPost._id}})

        res.json({succesMessage: "Post borrado"})

    }
    catch(err){
        console.log(err)
    }

})

router.post("/likes/:id/:info", async (req, res, next)=>{

    const {id, info} = req.params

    try{

        if(info == "plus"){
            await Post.findByIdAndUpdate(id, {$inc: {likes: 1}})
            res.json({succesMessage: "Like subido"})
            return
        }

        if(info == "less"){
            await Post.findByIdAndUpdate(id, {$inc: {likes: -1}})
            res.json({succesMessage: "Like disminuido"})
            return
        }

        res.status(400).json({errorMessage: "Parámetros desconocidos"})

    }
    catch(err){
        console.log(err)
    }

})


module.exports = router