const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");





//=========================Create Author(Post /authors)===================================================//

const createAuthor = async function (req, res) {
    try {
        let data = req.body;
        let author = await authorModel.create(data);
        return res.status(201).send({ msg: author, status: true });
    } catch (error) {
        return res.status(500).send({ msg: error.message, status: false });
    }
};



//=========================Login Author(POST /login)===================================================//

const loginAuthor = async function (req, res) {
    try {
        let email = req.body.email;
        let password = req.body.password;

        let author = await authorModel.findOne({ email: email, password: password });
        if (!author)
            return res.status(400).send({
                status: false,
                msg: "username or the password is not corerct",
            });
      
        let token = jwt.sign(
            {
                authorId: author._id.toString(),
           },
            "uranium"
        );
       
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, data: token });
    }
    catch (e) {
        res.status(500).send({ msg: "Error", error: e.message });
    }

};


module.exports= {loginAuthor,createAuthor}
