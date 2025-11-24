const Product = require("../models/product.model");

// ✅ Create product
exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // ✅ Attach logged-in user automatically
    productData.user = req.user._id;

    if (req.files?.length > 0) {
      productData.images = req.files.map(
        file => `/uploads/images/${file.filename}`
      );
    }

    const savedProduct = await Product.create(productData);

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
    res.status(500).json({error:error.message});
  }
};



// ✅ Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("user", "username phone email");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("user", "username phone email");

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update product
exports.updateProduct = async (req, res) => {
  try {
    const updatedData = req.body;

    // If a new file is uploaded, save the new image path
    if (req.file) {
      updatedData.image = `/uploads/images/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

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
    const location = req.params.location;

    if (!location) {
      return res.status(400).json({ message: "Location parameter required" });
    }

    const products = await Product.find({
      location: { $regex: new RegExp(location, "i") }, // case-insensitive
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this location" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error finding products by location:", error);
    res.status(500).json({ message: "Server error", error });
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
exports.findProductsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const products = await Product.find({ user: userId });

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
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

