const express = require('express');
const router = express.Router();
const {createBlog,getBlogs,updatedBlogs,deleteBlog,deleteBlogByQuery} = require("../controller/blogController")
const {loginAuthor,createAuthor}=require("../controller/authorController")
const {authentication, authorization}  = require("../middleware/auth")



router.post("/authors", createAuthor)
router.post("/login", loginAuthor)

router.post("/blogs",authentication,createBlog)
router.get("/blogs",authentication, getBlogs)
router.put("/blogs/:blogId",authentication,authorization ,updatedBlogs)
router.delete("/blogs/:blogId",authentication,authorization ,deleteBlog)
router.delete("/blogs",authentication, deleteBlogByQuery)




module.exports = router;