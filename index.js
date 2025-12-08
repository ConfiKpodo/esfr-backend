require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require('./swaggerOption');
const cors = require("cors"); // ✅ change to require since you're using CommonJS
const path = require("path"); 
const app = express();

// ✅ Put this FIRST, before anything else
app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const userRoutes = require("./routes/user.routes.js");
const productRoutes = require("./routes/product.routes.js");
const transportationRoutes = require("./routes/transportation.routes.js");
app.use('/uploads', express.static('uploads'));


// ✅ Define routes after CORS
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/transportation', transportationRoutes);
app.use(express.static(path.join(__dirname, "dist/esfr/browser")));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist/esfr/browser/index.html"));
});

const mongoDbUrl = process.env.MONGODB_url;
mongoose.connect(mongoDbUrl)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err));

app.get("/", (req, res) => res.send("Hello!"));
app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
