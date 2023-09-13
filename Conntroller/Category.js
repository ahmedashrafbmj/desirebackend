const Category = require("../Model/CategorySchema")

// Subadmin add post route
const AddCategory = async (req, res) => {
  try {
     const imageFileNames = req.files.map((file) => file.filename);
    const { name} = req.body;
     const post = new Category({
      name,
    });

    await post.save();
    res.status(201).json({ message: 'Category added successfully' });
    // });
  } catch (error) {
    // console.log(req.files, "req.user");
    res.status(500).json({ message: 'Failed to Category', error: error.message });
  }
};

module.exports = {
    AddCategory
}