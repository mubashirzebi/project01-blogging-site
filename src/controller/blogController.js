const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const mongoose = require("mongoose")
const moment = require("moment")



//=========================Create Blog(POST /blogs)===================================================//


const createBlog = async function (req, res) {
  try {
    let data = req.body;
    if (!mongoose.Types.ObjectId.isValid(data.authorId)) {
      return res.status(400).send({ status: false, msg: "Invalid Author-Id" });
    }
    let authorId = await authorModel.findById(data.authorId);
    if (!authorId) {
      return res.status(404).send({ status: false, msg: " Author-Id is not found " });
    }
    if (data.isPublished == true) {
      data.publishedAt = moment().format("DD-MM-YYYY, hh:mm a")

    }
    let blog = await blogModel.create(data);
    return res.status(201).send({ status: true, data: blog });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};


//=========================Get Blog(GET /blogs)=====================================//


const getBlogs = async function (req, res) {
  try {

    let queryData = req.query

    if (queryData.isDeleted == "true") {
      return res.status(400).send({ status: false, msg: 'Blog is deleted' })
    }
    if (queryData.isPublished == "false") {
      return res.status(400).send({ status: false, msg: 'Blog is not Published' })
    }

    let obj = {}                           

    if (queryData.authorId != undefined) {
      obj.authorId = queryData.authorId
    }
    if (queryData.category != undefined) {
      obj.category = queryData.category
    }
    if (queryData.tags != undefined) {
      obj.tags = queryData.tags
    }
    if (queryData.subcategory != undefined) {
      obj.subcategory = queryData.subcategory
    }

    obj.isDeleted = false;
    obj.isPublished = true;

    const blogData = await blogModel.find(obj)
    if (blogData.length == 0) {
      return res.status(404).send({ status: false, msg: 'No Document Found' })
    }
    return res.status(200).send({ status: true, Data: blogData })
  }
  catch (err) {
    return res.status(500).send({ status: false, error: err.message })
  }

}


//=========================Update Blog(PUT /blogs/:blogId)=====================================//

const updatedBlogs = async function (req, res) {
  try {
    let blog = req.body

    let blogId = req.params.blogId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).send({ status: false, msg: "Invalid Blog-Id" })
    }
    let blogData = await blogModel.findById(blogId)
    if (blogData.isDeleted == true) {
      return res.status(404).send({ status: false, msg: "Data not found" })
    }
    console.log(blog.subcategory)
    blogData.publishedAt = moment().format("DD-MM-YYYY, hh:mm a")

    let updatedBlog = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      { $addToSet: { tags: blog.tags, subcategory: blog.subcategory }, $set: { title: blog.title, body: blog.body, isPublished: blog.isPublished } },
      { new: true }

    )
    return res.status(200).send({ status: true, updatedData: updatedBlog })

  }
  catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
}

//=========================Delete Blog(DELETE /blogs/:blogId)=====================================//


const deleteBlog = async function (req, res) {
  try {
    let blogIdToBeDeleted = req.params.blogId
    if (!blogIdToBeDeleted) {
      return res.status(400).send({ status: false, msg: "Blog Id is not entered" })
    }
    let validBlogId = await blogModel.findOne({ _id: blogIdToBeDeleted });
    if (!validBlogId) {
      return res.status(400).send({ status: false, msg: "Blog Id is invalid" })
    }
    let isDeletedStatus = await blogModel.findOne({ _id: blogIdToBeDeleted, isDeleted: false });
    if (!isDeletedStatus) {
      return res.status(404).send({ status: false, msg: "Blog is ALready deleted" })
    }
    let deletedDate = moment().format("DD-MM-YYYY, hh:mm a")


    let data = await blogModel.findByIdAndUpdate({ _id: blogIdToBeDeleted }, { isDeleted: true, deletedAt: deletedDate }, { new: true })

    return res.status(200).send({ status: true, msg: data })
  }
  catch (error) {
    return res.status(400).send({ status: false, msg: error.message })
  }
}

//=========================Delete Blog by Query(DELETE /blogs?queryParams)=====================================//


const deleteBlogByQuery = async function (req, res) {
  try {
    let queryData = req.query
    let tokenAuthorId = req.authorIdToken
    let queryAuthorId = queryData.authorId
    
    if (!(queryData.category || queryData.authorId || queryData.tags || queryData.subcategory || queryData.isPublished)) {
      return res.status(400).send({ status: false, msg: "Invalid Request...." })
    }
    if (queryAuthorId) {
      if (tokenAuthorId != queryAuthorId) {
        return res.status(400).send({ status: false, msg: "Token is not match with authorId" })
      }
    }
    let obj = {}                             

    obj.authorId = tokenAuthorId
    
    if (queryData.category != undefined) {
      obj.category = queryData.category
    }
    if (queryData.tags != undefined) {
      obj.tags = queryData.tags
    }
    if (queryData.subcategory != undefined) {
      obj.subcategory = queryData.subcategory
    }
    if (queryData.isPublished != undefined) {
      obj.isPublished = queryData.isPublished
    }
    
    let deletedDate = moment().format("DD-MM-YYYY, hh:mm a")
    let updateDeleteStatus = await blogModel.updateMany(obj, { isDeleted: true, deletedAt: deletedDate }, { new: true })
    
    if (updateDeleteStatus.matchedCount == 0) {
      return res.status(404).send({ status: false, msg: "No Match Found" })
    }                                                                             
    return res.status(200).send({ status: true, data: updateDeleteStatus });

  } catch (error) {
    return res.status(400).send({ status: false, msg: error.message });
  }
}



module.exports = { createBlog, getBlogs, updatedBlogs, deleteBlog, deleteBlogByQuery };
