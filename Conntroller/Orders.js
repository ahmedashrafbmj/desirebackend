const Post = require("../Model/ProductSchema");
const Order = require("../Model/OrderSchema");

const placeOrder = async (req, res) => {
  try {
    const { products, name, email, address, totalprice, lastName, contact } =
      req.body;
    // const { userId } = req.user; // Assuming you have authenticated the user

    // Find the products by their IDs
    const productIds = products.map((product) => product.productId);
    const foundProducts = await Post.find({ _id: productIds });

    if (foundProducts.length !== productIds.length) {
      return res
        .status(404)
        .json({ message: "One or more products not found" });
    }

    // Check product stock and calculate total price
    let totalPrice = 0;
    const orderedProducts = [];

    for (const product of products) {
      const foundProduct = foundProducts.find(
        (p) => p._id.toString() === product.productId
      );

      if (!foundProduct) {
        return res
          .status(404)
          .json({ message: `Product with ID ${product.productId} not found` });
      }

      totalPrice += foundProduct.discountedPrice * product.quantity;
      console.log(totalPrice, "totalPrice");
      orderedProducts.push({
        productId: foundProduct._id,
        quantity: product.quantity,
      });
    }

    if (totalPrice == totalprice) {
      // Create a new order
      const order = new Order({
        products: orderedProducts,
        totalprice,
        // userId,
        name,
        email,
        number,
        address,
        lastName,
        contact,
      });

      await order.save();

      res.status(201).json({
        message: "Order placed successfully",
        order,
      });
    } else {
      res.status(400).json({
        message: "Total price does not match the expected total price",
        expectedTotalPrice: totalprice,
        calculatedTotalPrice: totalPrice,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to place the order", error: error.message });
  }
};

const approveRejectOrder = async (req, res) => {
  try {
    const { action, _id } = req.body;

    const order = await Order.findById(_id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (action === 1) {
      order.status = "approved";
      await order.save();
      res.json({ message: "Order approved successfully", order });
    } else if (action === 0) {
      order.status = "rejected";
      await order.save();
      res.json({ message: "Order rejected successfully", order });
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to approve/reject order",
      error: error.message,
    });
  }
};

const GetAllOrders = async (req, res) => {
  try {
    const action = req.body.action;

    const posts = await Order.find();

    res.json({ posts: posts });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve approved or reject posts",
      error: error.message,
    });
  }
};

// module.exports = {
//   approveRejectOrder,
// };

module.exports = {
  placeOrder,
  approveRejectOrder,
  GetAllOrders,
};
