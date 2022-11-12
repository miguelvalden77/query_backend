const router = require("express").Router()
const Comment = require("../models/Comment.model")
const User = require("../models/User.model")
const Post = require("../models/Post.model")

router.post("/create", async (req, res, next)=>{

    const {author, description, post} = req.body

    if(!author || !description || !post){
        res.status(400).json({errorMessage: "Deben rellenarse todos los campos"})
        return
    }

    try{

        const comment = await Comment.create({author, description, post})
        await User.findByIdAndUpdate(author, {$addToSet:{comments: comment.id}})
        await Post.findByIdAndUpdate(post, {$addToSet:{comments: comment.id}})

        res.json({succesMessage: "Comment created"})

    }
    catch(err){
        console.log(err)
    }

})

router.post("/update/:id", async (req, res, next)=>{

    const {id} = req.params
    const {description} = req.body

    if(!description){
        res.status(400).json({errorMessage: "El comentario debe tener contenido"})
        return
    }

    try{

        await Comment.findByIdAndUpdate(id, {description})

        res.json({succesMessage: "Comentario actualizado"})

    }
    catch(err){
        console.log(err)
    }

})

router.post("/delete/:id", async (req, res, next)=>{

    const {id} = req.params

    try{

        await Comment.findByIdAndDelete(id)

        res.json({succesMessage: "Comentario borrado"})

    }
    catch(err){
        console.log(err)
    }

})

module.exports = router