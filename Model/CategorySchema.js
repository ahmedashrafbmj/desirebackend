const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "name is Required"],
    },
    link: {
      type: String,
      required: [true, "link is Required"],
    },

  images: [
    {
      type: String,
      required: [true, "images are Required"],
    },
  ],
});

const Category = mongoose.model('Category', categorySchema, 'Category');

module.exports = Category;
