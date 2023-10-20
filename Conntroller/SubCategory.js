const Category = require("../Model/CategorySchema");
const SubcategorySchema = require("../Model/SubCategorySchema");
const { sendResponse } = require("../helper/helper");

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
        categories: existedcategory.map((category) => category),
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
const GetCategories = async (req, res) => {
  try {
    const categories = await SubcategorySchema.find();

    res.json({ categories });
  } catch (error) {
    // console.log(req.files, "req.user");
    res.status(500).json({ message: "Failed to Brand", error: error.message });
  }
};

module.exports = {
  AddsubCategory,
  GetCategories,
};
