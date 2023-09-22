const Brand = require("../Model/BrandSchema")

// Subadmin add post route
const AddBrand = async (req, res) => {
  try {
    const { name,link} = req.body;
    console.log(req.files.map((file) => file.filename),"images")
     const post = new Brand({
      name,
      link,
      images: req.files.map((file) => file.filename),
    });

    await post.save();
    res.status(201).json({ status:true,message: 'Brand added successfully' });
    // });
  } catch (error) {
    // console.log(req.files, "req.user");
    res.status(500).json({ message: 'Failed to Brand' , error: error.message });
  }
};
const GetBrand = async (req, res) => {
  try {

    const brands = await Brand.find();

    res.json({ brands });
  } catch (error) {
    // console.log(req.files, "req.user");
    res.status(500).json({ message: 'Failed to Brand', error: error.message });
  }
};


const Findbylinkbrand = async (req, res) => {
  try { 
    const searchKey = req.params.Findbylink; // URL se search key hasil karen
    console.log(searchKey,"searchKey")
    
    const result = await Brand.findOne({ link: searchKey });
    
    if (!result) {
      res.status(404).json({status:true, message: 'ProductLink ke saath koi product nahi mila.' });
      return;
    }
    
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve post', error: error.message });
  }
}

module.exports = {
    AddBrand,
    GetBrand,
    Findbylinkbrand
}