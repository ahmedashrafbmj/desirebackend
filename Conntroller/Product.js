const Post = require("../Model/ProductSchema")
const { upload } = require("../MiddelWare/Multer");
const Category = require("../Model/CategorySchema");
const Brand = require("../Model/BrandSchema");

// Generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
  const randomDecimal = Math.random();
  const randomNumber = Math.floor(randomDecimal * (max - min + 1)) + min;
  return randomNumber;
}


// Subadmin add post route
const AddProduct = async (req, res) => {
  try {
    const imageFileNames = req.files.map((file) => file.filename);
    const { name, category, brand, price, discountedPrice, menuProductNumber,ProductLink, totalUnits, longDescription, shortDescription } = req.body;
    
    const singleProductUnit = getRandomNumber(1, 12);
    
    const categoryIds = category.map((product) => product);
    console.log(categoryIds,"categoryIds")
    const foundcategorys = await Category.find({ _id:  categoryIds  });
    console.log(foundcategorys,"foundcategorys")
    // Use the $in operator to find documents with these IDs
  // const foundcategorys= Category.find({ _id: { $in: categoryIds } })
  //     .then((foundCategories) => {
  //       console.log(foundCategories, "foundCategories");
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });

  const brandIds = brand.map((product) => product);
  console.log(brandIds,"brandIds")
  const foundbrands = await Brand.find({ _id:  brandIds  });
  console.log(foundbrands,"foundbrands");





    const post = new Post({
      name,
      category:foundcategorys,
      brand:foundbrands,
      price,
      ProductLink,
      discountedPrice,
      menuProductNumber,
      images: req.files.map((file) => file.filename), // Array of image file names
      // video: req.file.filename, // Video file name
      unitsolds: singleProductUnit,
      totalUnits,
      longDescription,
      shortDescription,
    });
  

 
  await post.save(); 

  console.log(post, "post");

    // await post.save();

    // console.log(title);
    console.log(post, "post");

    res.status(201).json({ message: 'Post added successfully and pending admin approval' });
    // });
  } catch (error) {
    console.log(req.files, "req.user");
    res.status(500).json({ message: 'Failed to add post', error: error.message });
  }
};


const Findbylink = async (req, res) => {
  try { 
    const searchKey = req.params.Findbylink; // URL se search key hasil karen
    console.log(searchKey,"searchKey")
    
    const result = await Post.findOne({ ProductLink: searchKey });
    
    if (!result) {
      res.status(404).json({ message: 'ProductLink ke saath koi product nahi mila.' });
      return;
    }
    
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve post', error: error.message });
  }
}
// Admin approve post route
const ApprovePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    console.log(req.body.action)
    const action = req.body.action;
    console.log(req.params.postId, " req.params.postId")

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (action === 1) {
      post.isApproved = true;
      res.json({ message: 'Post approved successfully' });
    }
    else if (action === 0) {
      post.isApproved = false;
      res.json({ message: 'Post rejected successfully' });
    }
    else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await post.save();

  } catch (error) {
    res.status(500).json({ message: 'Failed to approve post', error: error.message });
  }
};


const GetAllApprovedPostAdmin = async (req, res) => {
  try {
    const action = req.body.action;
    if (action === 1) {
      const posts = await Post.find({ isApproved: true }).populate('author');
      res.json({ posts });
    }
    else if (action === 0) {
      const posts = await Post.find({ isApproved: false }).populate('author');
      res.json({ posts });
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Failed to retrieve approved or reject posts', error: error.message });
  }
}
const GetAllProducts = async (req, res) => {
  try {
    const action = req.body.action;

    const posts = await Post.find();

    res.json({ posts });
  }
  catch (error) {
    res.status(500).json({ message: 'Failed to retrieve approved or reject posts', error: error.message });
  }
}
const GetAllApprovedPost = async (req, res) => {
  try {

    const posts = await Post.find({ isApproved: true }).populate('author');
    res.json({ posts });

  }
  catch (error) {
    res.status(500).json({ message: 'Failed to retrieve approved or reject posts', error: error.message });
  }
}




module.exports = {
  AddProduct,
  ApprovePost,
  GetAllApprovedPost,
  GetAllApprovedPostAdmin,
  GetAllProducts,
  Findbylink
}




