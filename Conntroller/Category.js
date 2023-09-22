const Category = require("../Model/CategorySchema")

// Subadmin add post route
const AddCategory = async (req, res) => {
  try {
     const imageFileNames = req.files.map((file) => file.filename);
    const { name,link} = req.body;
     const post = new Category({
      name,
      link, 
      images:imageFileNames
    });

    await post.save();
    res.status(201).json({status:true, message: 'Category added successfully' });
    // });
  } catch (error) {
    // console.log(req.files, "req.user");
    res.status(500).json({ message: 'Failed to Category', error: error.message });
  }
};
const GetCategories = async (req, res) => {
  try {

    const categories = await Category.find();

    res.json({ categories });
  } catch (error) {
    // console.log(req.files, "req.user");
    res.status(500).json({ message: 'Failed to Brand', error: error.message });
  }
};



const Findbylinkcat = async (req, res) => {
  try { 
    const searchKey = req.params.Findbylink; // URL se search key hasil karen
    console.log(searchKey,"searchKey")
    
    const result = await Category.findOne({ link: searchKey });
    
    if (!result) {
      res.status(404).json({ message: 'ProductLink ke saath koi product nahi mila.' });
      return;
    }
    
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve post', error: error.message });
  }
}

module.exports = {
    AddCategory,
    GetCategories,
    Findbylinkcat
}