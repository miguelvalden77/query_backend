const router = require("express").Router()
const Comment = require("../models/Comment.model")
const User = require("../models/User.model")
const Post = require("../models/Post.model")
const { findOne } = require("../models/User.model")
const isAuth = require("../middlewares/isAuth")

router.post("/create", isAuth, async (req, res, next)=>{

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
        next(err)
    }

})

router.post("/update/:id", isAuth, async (req, res, next)=>{

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
        next(err)
    }

})

router.post("/delete/:id", isAuth, async (req, res, next)=>{

    const {id} = req.params

    try{

        const comment = await Comment.findByIdAndDelete(id)
        await User.findOneAndUpdate({comments: comment._id}, {$pull: {comments: comment._id}})
        await Post.findOneAndUpdate({comments: comment._id}, {$pull: {comments: comment._id}})

        res.json({succesMessage: "Comentario borrado"})

    }
    catch(err){
        next(err)
    }

})

module.exports = router