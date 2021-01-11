const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  nickname: {
    type: String,
  },
  WPM: { type: Number, default: -1 },
  place: { type: Number },
});
module.exports = mongoose.model("Todo", TodoSchema);
