// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const AllRoutes = require('./Route/index');
// Create an Express app
const app = express();
const cors = require('cors');
const multer  = require("multer")
const upload  = multer()
const { AddProduct} = require('./Conntroller/Product');


// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads/", express.static('uploads'))

// app.use(bodyParser. text({type: '/'}));


// Routes
// Define your routes and their corresponding handlers here

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/'); // Set the destination folder where uploaded files will be stored
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       cb(null, file.fieldname + '-' + uniqueSuffix); // Set the filename for the uploaded file
//     }
//   });

//   const upload2 = multer({ storage: storage }).single('picture');
// module.exports = {upload}
// Example route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api', AllRoutes);
// app.use('/api/AddProduct', AddProduct);
// Connect to MongoDB
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });