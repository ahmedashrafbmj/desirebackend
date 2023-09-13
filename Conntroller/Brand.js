const Brand = require("../Model/BrandSchema")

// Subadmin add post route
const AddBrand = async (req, res) => {
  try {
    const { name} = req.body;
     const post = new Brand({
      name,
    });

    await post.save();
    res.status(201).json({ message: 'Brand added successfully' });
    // });
  } catch (error) {
    // console.log(req.files, "req.user");
    res.status(500).json({ message: 'Failed to Brand', error: error.message });
  }
};

module.exports = {
    AddBrand
}