const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: String,
  img_url: String,
  connection_url: String,
  action_id: [mongoose.SchemaTypes.ObjectId],
  reaction_id: [mongoose.SchemaTypes.ObjectId],
});

module.exports = mongoose.model("Services", serviceSchema);