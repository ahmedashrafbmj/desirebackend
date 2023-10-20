const Brand = require("../Model/BrandSchema");
const Category = require("../Model/CategorySchema");
const { sendResponse } = require("../helper/helper");
const path = require("path");
const fs = require("fs"); // Import the fs module for file system operations

// Subadmin add post route
const AddBrand = async (req, res) => {
  try {
    const { name, link, categories } = req.body;
    console.log(
      req.files.map((file) => file.filename),
      "images"
    );
    const existedcategories = await Category.find({
      $or: [{ _id: { $in: categories } }, { categories: [] }],
    });

    if (existedcategories.length > 0) {
      const post = new Brand({
        name,
        link,
        categories: existedcategories.map((category) => category),
        images: req.files.map((file) => file.filename),
      });

      await post.save();
      res
        .status(201)
        .json({ status: true, message: "Brand added successfully" });
    } else {
      res.status(401).send(sendResponse(false, null, "Category Not Found"));
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to Brand", error: error.message });
  }
};
const GetBrand = async (req, res) => {
  try {
    const brands = await Brand.find();

    res.json({ brands });
  } catch (error) {
    // console.log(req.files, "req.user");
    res.status(500).json({ message: "Failed to Brand", error: error.message });
  }
};

const Findbylinkbrand = async (req, res) => {
  try {
    const searchKey = req.params.Findbylink; // URL se search key hasil karen
    console.log(searchKey, "searchKey");

    const result = await Brand.findOne({ link: searchKey });

    if (!result) {
      res.status(404).json({
        status: true,
        message: "ProductLink ke saath koi product nahi mila.",
      });
      return;
    }

    res.status(200).json({ result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to approve post", error: error.message });
  }
};
const updateBrand = async (req, res) => {
  try {
    const brandId = req.params.brandId;
    const { categories } = req.body;
    const result = await Brand.findById(brandId);

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

    const update = await Brand.findByIdAndUpdate(brandId, req.body, {
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
const deleteBrand = async (req, res) => {
  let brandId = req.params.brandId;
  let result = await Brand.findById(brandId);

  if (!result) {
    res.send(sendResponse(false, null, "Data Not Found")).status(404);
  } else {
    let deleResult = await Brand.findByIdAndDelete(brandId);
    if (!deleResult) {
      res.send(sendResponse(false, null, "Data Not Deleted")).status(400);
    } else {
      res.send(sendResponse(true, deleResult, "Data Deleted")).status(200);
    }
  }
};

module.exports = {
  AddBrand,
  GetBrand,
  Findbylinkbrand,
  updateBrand,
  deleteBrand,
};
