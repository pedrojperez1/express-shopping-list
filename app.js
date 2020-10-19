const express = require("express");
const itemRoutes = require("./routes/items");
const ExpressError = require("./expressError");

const app = express();

app.use(express.json());

app.use("/items", itemRoutes);

// 404 handler
app.use((req, res, next) => {
    next(new ExpressError("Not found", 404));
})

// general error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
  
    return res.json({
      error: err.message,
    });
  });

module.exports = app;