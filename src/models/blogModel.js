const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogModel = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    authorId: { type: ObjectId, ref: "author", required: true },
    tags: [String],
    category: { type: String, required: true },
    subcategory: [String],
    isPublished: { type: Boolean, default: false },
    publishedAt: String, 
    isDeleted: { type: Boolean, default: false },
    deletedAt: String, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogModel);
