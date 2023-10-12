const Post = require("../Model/ProductSchema");
const { upload } = require("../MiddelWare/Multer");
const Category = require("../Model/CategorySchema");
const Brand = require("../Model/BrandSchema");
const fs = require("fs"); // Import the fs module for file system operations

const { sendResponse } = require("../helper/helper");
const path = require("path");

// Generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
  const randomDecimal = Math.random();
  const randomNumber = Math.floor(randomDecimal * (max - min + 1)) + min;
  return randomNumber;
}

// Subadmin add post route
const AddProduct = async (req, res) => {
  try {
    // const imageFileNames = req.files.map((file) => file.filename);
    const {
      name,
      category,
      brand,
      price,
      discountedPrice,
      menuProductNumber,
      ProductLink,
      totalUnits,
      longDescription,
      shortDescription,
    } = req.body;

    const singleProductUnit = getRandomNumber(1, 12);
    console.log(req, "req.files");

    const categoryIds = category.map((product) => product);
    // console.log(categoryIds,"categoryIds")
    const foundcategorys = await Category.find({ _id: categoryIds });
    // console.log(foundcategorys,"foundcategorys")
    // Use the $in operator to find documents with these IDs
    // const foundcategorys= Category.find({ _id: { $in: categoryIds } })
    //     .then((foundCategories) => {
    //       console.log(foundCategories, "foundCategories");
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });

    const brandIds = brand.map((product) => product);
    // console.log(brandIds,"brandIds")
    const foundbrands = await Brand.find({ _id: brandIds });
    console.log(
      foundcategorys.map((e, i) => e.name),
      "foundcategorys"
    );
    const cat = foundcategorys.map((e, i) => e.name);
    const bran = foundbrands.map((e, i) => e.name);
    console.log(foundbrands, "foundbrands");

    const imageFileNames = req.files.map((file) => file.filename);

    const post = new Post({
      name,
      category: cat,
      brand: bran,
      price,
      ProductLink,
      discountedPrice,
      menuProductNumber,
      images: imageFileNames,
      unitsolds: singleProductUnit,
      totalUnits,
      longDescription,
      shortDescription,
    });

    // await post.save();

    console.log(post, "post");

    await post.save();

    // console.log(title);
    console.log(post, "post");

    res
      .status(201)
      .json({ status: true, message: "Post added successfully ", data: post });
    // });
  } catch (error) {
    console.log(req.files, "req.user");
    res
      .status(500)
      .json({ message: "Failed to add post", error: error.message });
  }
};

const Findbylink = async (req, res) => {
  try {
    const searchKey = req.params.Findbylink; // URL se search key hasil karen
    console.log(searchKey, "searchKey");

    const result = await Post.findOne({ ProductLink: searchKey });

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
const removeHyphen = (text) => {
  return text.replace(/-/g, " ");
};
const FindbyId = async (req, res) => {
  try {
    const encodedName = req.params.name; // Get the encoded name parameter from the URL
    const name = removeHyphen(req.params.name); // Decode the URL-encoded name
    console.log(name, "name");

    const result = await Post.findOne({ name: name }); // Use findOne with the decoded name
    if (!result) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const baseUrl = "http://backend.terakarachi.com/uploads/"; // Replace with your actual base URL
    const imagesWithBaseUrl = result.images.map((image) => baseUrl + image);

    // Update the result with the new image URLs
    result.images = imagesWithBaseUrl;

    res
      .status(200)
      .json({ data: result, message: "Product found", status: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to find product", error: error.message });
  }
};

// Admin approve post route
const ApprovePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    console.log(req.body.action);
    const action = req.body.action;
    console.log(req.params.postId, " req.params.postId");

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (action === 1) {
      post.isApproved = true;
      res.json({ message: "Post approved successfully" });
    } else if (action === 0) {
      post.isApproved = false;
      res.json({ message: "Post rejected successfully" });
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await post.save();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to approve post", error: error.message });
  }
};

const GetAllApprovedPostAdmin = async (req, res) => {
  try {
    const action = req.body.action;
    if (action === 1) {
      const posts = await Post.find({ isApproved: true }).populate("author");
      res.json({ posts });
    } else if (action === 0) {
      const posts = await Post.find({ isApproved: false }).populate("author");
      res.json({ posts });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve approved or reject posts",
      error: error.message,
    });
  }
};
const GetAllProducts = async (req, res) => {
  try {
    const action = req.body.action;

    const posts = await Post.find();

    const baseUrl = "http://backend.terakarachi.com/uploads/"; // Replace with your actual base URL
    const postsWithBaseUrl = posts.map((data) => {
      data.images = data.images.map((image) => baseUrl + image);
      return data;
    });

    res.json({ posts: postsWithBaseUrl });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve approved or reject posts",
      error: error.message,
    });
  }
};

const GetAllApprovedPost = async (req, res) => {
  try {
    const posts = await Post.find({ isApproved: true }).populate("author");
    res.json({ posts });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve approved or reject posts",
      error: error.message,
    });
  }
};

const DeleteProduct = async (req, res) => {
  let productId = req.params.productId;
  let result = await Post.findById(productId);

  if (!result) {
    res.send(sendResponse(false, null, "Data Not Found")).status(404);
  } else {
    let deleResult = await Post.findByIdAndDelete(productId);
    if (!deleResult) {
      res.send(sendResponse(false, null, "Data Not Deleted")).status(400);
    } else {
      res.send(sendResponse(true, deleResult, "Data Deleted")).status(200);
    }
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { category, brand } = req.body;
    const result = await Post.findById(productId);

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

    // Find category and brand names based on their IDs
    const foundCategorys = await Category.find({ _id: { $in: category } });
    const foundBrands = await Brand.find({ _id: { $in: brand } });

    // Extract names from the found categories and brands
    const cat = foundCategorys.map((e) => e.name);
    const bran = foundBrands.map((e) => e.name);

    req.body.category = cat;
    req.body.brand = bran;

    const update = await Post.findByIdAndUpdate(productId, req.body, {
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
  AddProduct,
  DeleteProduct,
  ApprovePost,
  GetAllApprovedPost,
  GetAllApprovedPostAdmin,
  GetAllProducts,
  Findbylink,
  FindbyId,
  updateProduct,
};
