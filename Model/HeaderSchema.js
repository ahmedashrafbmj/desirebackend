const mongoose = require('mongoose');

const headerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "name is Required"],
    },
});

const Header = mongoose.model('header', headerSchema);

module.exports = Header;
