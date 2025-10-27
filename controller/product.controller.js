const Product = require("../models/product.model");

// ✅ Create product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update product
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Find by location
exports.findProductsByLocation = async (req, res) => {
  try {
    const products = await Product.find({ location: req.params.location });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Find by name or location (query params)
exports.findProductByNameOrLocation = async (req, res) => {
  try {
    const { name, location } = req.query;

    if (!name && !location) {
      return res.status(400).json({
        message: "Please provide at least a name or location to search",
      });
    }

    // Build the query object dynamically
    const query = {};

    if (name) {
      // Case-insensitive partial match for name
      query.name = { $regex: name, $options: "i" };
    }

    if (location) {
      // Case-insensitive exact match for location
      query.location = { $regex: `^${location}$`, $options: "i" };
    }

    const products = await Product.find(query);

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error finding product:", error.message);
    res.status(500).json({ error: error.message });
  }
};


// ✅ Find by username
exports.findProductsByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Username parameter is required" });
    }

    const products = await Product.find({
      username: { $regex: `^${username}$`, $options: "i" }, // case-insensitive exact match
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this username" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by username:", error.message);
    res.status(500).json({ error: error.message });
  }
};


//find product by name
exports.findProductsByName = async (req, res) => {
  try {
    const { name } = req.params;
    const products = await Product.find({
      name: { $regex: name, $options: "i" }, // i = case-insensitive
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Find by category
exports.findProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ message: "Category parameter is required" });
    }

    const products = await Product.find({
      category: { $regex: `^${category}$`, $options: "i" }, // exact match, case-insensitive
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

