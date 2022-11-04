const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)

const commentRoutes = require("./comment.routes")
router.use("/comment", commentRoutes)

const postRoutes = require("./post.routes")
router.use("/post", postRoutes)

module.exports = router;
