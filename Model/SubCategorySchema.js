const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
  categories: [
    {
      type: String,
      required: [true, "categories are Required"],
    },
  ],
    name: {
      type: String,
      required: [true, "name is Required"],
    },
  
  images: [
    {
      type: String,
      required: [true, "images are Required"],
    },
  ],
});

const subCategory = mongoose.model('subCategory', SubcategorySchema, 'subCategory');

module.exports = subCategory;
