const User = require("../Model/Signup")
const signup = async (req, res) => {
    try {
      const { number, email,name, password, address } = req.body;
      console.log(number, email,name, password, address  )
  
      // Create a new user instance or document based on the User model/schema
      const user = new User({
        email,
        name,
        number,
        address,
        password,
        
      });
  
      // Save the user to the database
      await user.save();
  
      res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
      res.status(500).json({ message: 'Signup failed', error: error.message });
    }
  };
  
  module.exports = {
    signup,
  };
  