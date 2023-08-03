import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  data: {
    type: mongoose.Schema.Types.Mixed,
  },
  dataFile: {
    type: Buffer,
  },
  detail: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Content = mongoose.model("Content", contentSchema);
export default Content;
