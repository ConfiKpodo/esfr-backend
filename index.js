require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require('./swaggerOption');
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// STATIC IMAGES
app.use('/uploads', express.static('uploads'));

// API ROUTES
const userRoutes = require("./routes/user.routes.js");
const productRoutes = require("./routes/product.routes.js");
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);

// ANGULAR DIST
app.use(express.static(path.join(__dirname, "dist/esfr/browser")));

// CATCH ALL → MUST BE LAST
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/esfr/browser/index.html"));
});

// DATABASE
mongoose.connect(process.env.MONGODB_url)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// START SERVER
app.listen(process.env.PORT, () => console.log("🚀 Server running"));
