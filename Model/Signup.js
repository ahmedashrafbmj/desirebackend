const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');     
// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required.'],
  },
  number: {
    type: String,
    required: [true, 'Number is required.'],
  },
  address: {
    type: String,
    required: [true, 'Address is required.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
});
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
