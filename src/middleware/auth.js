const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");




const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400).send({ status: false, msg: "Token not Found" });
    }
    let decodeToken = await jwt.verify(token, "uranium");
    if (!decodeToken) {
      return res.status(401).send({ status: false, msg: "Token is not valid" })
    }
    if (decodeToken) {
      var authorIdToken = decodeToken.authorId;

    }

    req.authorIdToken = authorIdToken
    next()
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message })
  }
}

const authorization = async function (req, res, next) {

  try {

    let token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400).send({ status: false, msg: "Token not Found" });
    }

    let decodedToken = jwt.verify(token, "uranium");
    if (!decodedToken) {
      return res.status(400).send({ status: false, msg: "Token is not valid" })
    }

    let blogId = req.params.blogId
    if (!blogId) {
      return res.status(400).send({ status: false, msg: "Please entered Blog-Id" })
    }

    console.log(blogId)
    let blogIdDB = await blogModel.findById(blogId)
    console.log(blogIdDB)
    if (!blogIdDB) {
      return res.status(404).send({ status: false, msg: "Blog-Id is not found" })
    }
    let authorId = blogIdDB.authorId.toString();

    let tokenAuthorId = decodedToken.authorId

    if (authorId != tokenAuthorId) {

      return res.status(403).send({ status: false, msg: 'Author logged token is not matched' })
    } else {

      next();
    }
  } catch (err) {
    res.status(500).send({ msg: err })
  }
}

module.exports = { authentication, authorization }
