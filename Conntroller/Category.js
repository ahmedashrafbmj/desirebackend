const Category = require("../Model/CategorySchema");
const { sendResponse } = require("../helper/helper");
const path = require("path");
const fs = require("fs");

// Subadmin add post route
const AddCategory = async (req, res) => {
  try {
    const imageFileNames = req.files.map((file) => file.filename);
    const { name, link } = req.body;
    const post = new Category({
      name,
      link,
      images: imageFileNames,
    });

    await post.save();
    res
      .status(201)
      .json({ status: true, message: "Category added successfully" });
    // });
  } catch (error) {
    // console.log(req.files, "req.user");
    res
      .status(500)
      .json({ message: "Failed to Category", error: error.message });
  }
};
const GetCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.json({ categories });
  } catch (error) {
    // console.log(req.files, "req.user");
    res.status(500).json({ message: "Failed to Brand", error: error.message });
  }
};

const Findbylinkcat = async (req, res) => {
  try {
    const searchKey = req.params.Findbylink; // URL se search key hasil karen
    console.log(searchKey, "searchKey");

    const result = await Category.findOne({ link: searchKey });

    if (!result) {
      res
        .status(404)
        .json({ message: "ProductLink ke saath koi product nahi mila." });
      return;
    }

    res.status(200).json({ result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to approve post", error: error.message });
  }
};

const updateCategories = async (req, res) => {
  try {
    const CategoriesId = req.params.CategoriesId;

    const result = await Category.findById(CategoriesId);

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

    const update = await Category.findByIdAndUpdate(CategoriesId, req.body, {
      new: true,
    });

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

module.exports = {
  AddCategory,
  GetCategories,
  Findbylinkcat,
  updateCategories,
};
