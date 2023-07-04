const mongoose = require("mongoose");

mongoose.connect("mongodb://0.0.0.0/mongoose-social", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;
