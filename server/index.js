require("dotenv").config();
console.log("Environment Variables:");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

<<<<<<< HEAD
const authRouter = require("./routes/authRoute");
const tenantApplicationRouter = require("./tenantApplication/routes/tenantApplicationRoute");
const propertiesRouter = require("./routes/propertiesRoute");
const leasesRouter = require("./routes/leaseRoute");
const commentByLandlordRoute = require("./routes/commentByLandlordRoute");
import leaseAgreementRoute from "./routes/leaseAgreementRoute";
const reviewTenantRoute = require("./routes/reviewTenantRoute");
=======
const authRouter = require('./routes/authRoute');
const tenantApplicationRouter = require('./tenantApplication/routes/tenantApplicationRoute');
const propertiesRouter = require('./routes/propertiesRoute');
>>>>>>> 314ff59 (jwt installed)

const app = express();
const port = 5000;

console.log("Environment Variables:");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);

// 1. MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 2. ROUTE
<<<<<<< HEAD
app.use("/api/auth", authRouter);
app.use("/api/applications", tenantApplicationRouter);
app.use("/api/properties", propertiesRouter);
app.use("/api/leases", leasesRouter);
app.use("/api/reviewsTenant", reviewTenantRoute);
app.use("/api/leaseAgreement", leaseAgreementRoute);

// Serve static files from the React app build directory
const buildPath = path.join(__dirname, "../client/build");
=======
app.use('/api/auth',authRouter);
app.use('/api/applications',tenantApplicationRouter);
app.use('/api', propertiesRouter);

// Serve static files from the React app build directory
const buildPath = path.join(__dirname, '../client/build');
const ImagePath = path.join(__dirname, '../client/public/Images');
>>>>>>> 314ff59 (jwt installed)
app.use(express.static(buildPath));

// Handle React routing, return all requests to React app
app.get("*", function (req, res) {
  res.sendFile(path.join(buildPath, "index.html"));
});

// 3. MONGO DB CONNECTION
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Could not connect to MongoDB Atlas:", err));

// 4. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    next(err);
  }
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
