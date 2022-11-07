const router = require("express").Router()
const uploader = require("../middlewares/multer")


router.post("/", uploader.single("image"), (req, res, next)=>{

    if(req.file === undefined){
        res.status(400).json({errorMessage: "No se pudo subir la imagen"})
        return
    }

    res.json({imgUrl: req.file.path})

})

module.exports = router