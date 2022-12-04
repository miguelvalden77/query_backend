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
        res.json({errorMessage: "no post"})
    }

})

router.post("/delete/:id", async (req, res, next)=>{

    const {id} = req.params

    try{

        const deletedPost = await Post.findByIdAndDelete(id).populate("author")
        await User.findByIdAndUpdate(deletedPost.author._id, {$pull: {posts: deletedPost._id}})

        deletedPost.comments.forEach(async (comment)=>{

            await Comment.findByIdAndDelete(comment)
            await User.findOneAndUpdate({comments: comment}, {$pull: {comments: comment}})
            
        })     

        res.json({succesMessage: "Post borrado"})

    }
    catch(err){
        console.log(err)
    }

})

router.post("/likes/:id/:username", async (req, res, next)=>{

    const {id, username} = req.params

    try{

        const usuario = await User.findOne({$and: [{username: username}, {postsLike: id}]})

        if(usuario != null){
            await Post.findByIdAndUpdate(id, {$inc: {likes: -1}})
            await User.findOneAndUpdate({username: username}, {$pull: {postsLike: id}})
            res.json({succesMessage: "Like disminuido"})
            return
        }

        await Post.findByIdAndUpdate(id, {$inc: {likes: 1}})
        await User.findOneAndUpdate({username: username}, {$addToSet: {postsLike: id}})
        res.json({succesMessage: "Like subido"})
        return
            
        }
        catch(err){
            console.log(err)
            res.status(400).json({errorMessage: "Parámetros desconocidos"})
    }

})

router.get("/all-posts", async (req, res, next)=>{

    try{
        const response = await Post.find().populate("author")
        res.json(response)
    }
    catch(err){
        console.log(err)
    }

})

router.get("/:id", async (req, res, next)=>{

    const {id} = req.params

    try{
        const post = await Post.findById(id).populate("author")
        const comments = await Comment.find({post: id}).populate("author")
        
        res.json({post, comments})

    }
    catch(err){
        console.log(err)
    }

})

router.get("/user/:id", async (req, res, next)=>{

    const {id} = req.params

    try{

        const userPosts = await User.findById(id).select("posts").populate("posts")

        res.json(userPosts)

    }
    catch(err){
        console.log(err)
    }

})

module.exports = router