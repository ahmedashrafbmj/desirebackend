const Category = require("../Model/CategorySchema");
const SubcategorySchema = require("../Model/SubCategorySchema");
const { sendResponse } = require("../helper/helper");
const path = require("path");
const fs = require("fs");

// Subadmin add post route
const AddsubCategory = async (req, res) => {
  try {
    const { name, categories } = req.body;
    const existedcategory = await Category.find({
      $or: [{ _id: { $in: categories } }, { categories: [] }],
    });
    if (existedcategory.length > 0) {
      const post = new SubcategorySchema({
        name,
        categories: existedcategory.map((category) => category.name),
        images: req.files.map((file) => file.filename),
      });

      await post.save();
      res
        .status(201)
        .json({ message: " SubCategory added successfully", data: post });
      // });
    } else {
      res.status(401).send(sendResponse(false, null, "Category Not Found"));
    }
  } catch (error) {
    // console.log(req.files, "req.user");
    res
      .status(500)
      .json({ message: "Failed to Category", error: error.message });
  }
};
const GetsubCategories = async (req, res) => {
  try {
    const categories = await SubcategorySchema.find();

    res.json({ categories });
  } catch (error) {
    // console.log(req.files, "req.user");
    res.status(500).json({ message: "Failed to Brand", error: error.message });
  }
};
const updatesubCategories = async (req, res) => {
  try {
    const subCategoriesId = req.params.subCategoriesId;
    const { categories } = req.body;
    const result = await SubcategorySchema.findById(subCategoriesId);

    if (!result) {
      return res.status(404).send(sendResponse(false, null, "Data Not Found"));
    }

    // Handle image updates if there are uploaded files
    if (req.files && req.files.length > 0) {
      const imageFilenames = req.files.map((file) => file.filename);
      req.body.images = imageFilenames;

      if (result.images && result.images.length > 0) {
        // Delete the old images
        result.images.forEach((oldImage) => {
          const imagePath = path.join("uploads/", oldImage);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(`Error deleting old image: ${err}`);
            }
          });
        });
      }
    }

    // Find category  names based on their IDs
    const foundCategorys = await Category.find({ _id: { $in: categories } });

    // Extract names from the found categories and brands
    const cat = foundCategorys.map((e) => e.name);

    req.body.categories = cat;

    const update = await SubcategorySchema.findByIdAndUpdate(
      subCategoriesId,
      req.body,
      {
        new: true,
      }
    );

    if (!update) {
      return res.status(404).send(sendResponse(false, null, "Data Not Found"));
    } else {
      return res.status(200).send(sendResponse(true, update, "Data Update"));
    }
  } catch (e) {
    console.log(e);
    return res.status(400).send(sendResponse(false, null, "Internal Error"));
  }
};
const deletesubCategories = async (req, res) => {
  let subCategoriesId = req.params.subCategoriesId;
  let result = await SubcategorySchema.findById(subCategoriesId);

  if (!result) {
    res.send(sendResponse(false, null, "Data Not Found")).status(404);
  } else {
    let deleResult = await SubcategorySchema.findByIdAndDelete(subCategoriesId);
    if (!deleResult) {
      res.send(sendResponse(false, null, "Data Not Deleted")).status(400);
    } else {
      res.send(sendResponse(true, deleResult, "Data Deleted")).status(200);
    }
  }
};

module.exports = {
  AddsubCategory,
  GetsubCategories,
  updatesubCategories,
  deletesubCategories,
};
