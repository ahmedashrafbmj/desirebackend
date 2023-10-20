const express = require("express");
const router = express.Router();
const multer = require("multer");
// const upload  = multer()

//Controller Import
const { signup } = require("../Conntroller/Signup");
const { login } = require("../Conntroller/Login");
const {
  AddProduct,
  FindbyId,
  ApprovePost,
  GetAllApprovedPost,
  GetAllApprovedPostAdmin,
  GetAllProducts,
  Findbylink,
  DeleteProduct,
  updateProduct,
} = require("../Conntroller/Product");
const {
  placeOrder,
  approveRejectOrder,
  GetAllOrders,
} = require("../Conntroller/Orders");
// const {ApprovePost} = require("../Conntroller/Product")
// const {GetAllApprovedPost} = require("../Conntroller/Product")

// MiddelWare Import
const {
  verifyAdminToken,
  verifySubadminToken,
  verifyUserToken,
} = require("../MiddelWare/TokenVaerification");
const { upload, uploadvideo } = require("../MiddelWare/Multer");
// const {uploadvideo} = require("../MiddelWare/VideosMulter")

// stripe
const { processPayment, confirmPayment } = require("../Conntroller/Strippe");
const {
  AddCategory,
  GetCategories,
  Findbylinkcat,
} = require("../Conntroller/Category");
const {
  AddBrand,
  GetBrand,
  Findbylinkbrand,
  updateBrand,
  deleteBrand,
} = require("../Conntroller/Brand");
const reviewController = require("../Conntroller/Review");
const { AddsubCategory } = require("../Conntroller/SubCategory");
// Signup route
// router.post('/signup', upload.none(),signup);
router.post("/signup", signup);
router.post("/login", login);
router.post("/addProduct", upload, AddProduct);

// router.put('/posts/:postId/approve',verifyAdminToken, ApprovePost);
// router.post('/GetAllApprovedPostAdmin',verifyAdminToken, GetAllApprovedPostAdmin);

router.get("/product/:Findbylink", Findbylink);
router.get("/category/:Findbylink", Findbylinkcat);
router.get("/brand/:Findbylink", Findbylinkbrand);
router.get("/GetAllProducts", GetAllProducts);
router.get("/GetAllOrders", GetAllOrders);
router.get("/getBrand", GetBrand);
router.get("/getCategories", upload, GetCategories);
router.get("/FindbyId/:name", FindbyId);
router.get("/getAllReview/:ProductId", reviewController.getReviewsByProductId);

router.post("/addCategory", upload, AddCategory);
router.post("/addBrand", upload, AddBrand);
// router.get('/GetAllApprovedPost', GetAllApprovedPost);
router.post("/Checkout", upload, placeOrder);
router.post("/approveRejectOrder", verifyAdminToken, approveRejectOrder);
router.post("/processPayment", verifyUserToken, processPayment);
router.post("/confirmPayment", verifyUserToken, confirmPayment);
// router.post("/addsubCategory", verifyUserToken, confirmPayment);
router.post("/addsubCategory", upload, AddsubCategory);

router.post("/createreview", upload, reviewController.createReview);

router.put(
  "/updatereview/:reviewId",
  upload,
  reviewController.ApproveandRejectReview
);
router.put("/updateProduct/:productId", upload, updateProduct);
router.put("/updateBrand/:brandId", upload, updateBrand);

router.delete("/deleteReview/:reviewId", reviewController.deleteReview);
router.delete("/deleteProduct/:productId", DeleteProduct);
router.delete("/deleteBrand/:brandId", deleteBrand);

module.exports = router;
