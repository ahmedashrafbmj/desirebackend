const Header = require("../Model/HeaderSchema")

// Subadmin add post route
const AddHeader = async (req, res) => {
  try {
     const imageFileNames = req.files.map((file) => file.filename);
    const { name} = req.body;
     const post = new Header({
      name,
    });

    await post.save();
    res.status(201).json({ message: 'Header added successfully' });
    // });
  } catch (error) {
    // console.log(req.files, "req.user");
    res.status(500).json({ message: 'Failed to Header', error: error.message });
  }
};

module.exports = {
    AddHeader
}