import mongoose from "mongoose";

const customSchema = new mongoose.Schema({
  ecLevel: {
    type: String,
    enum: ["L", "M", "Q", "H"],
    default: "L",
  },
  enableCORS: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    default: 240,
  },
  quietZone: {
    type: Number,
    default: 12,
  },
  bgColor: {
    type: String,
    default: "#ffffff",
  },
  fgColor: {
    type: String,
    default: "#000000",
  },
  logoOpacity: {
    type: Number,
    default: 1,
  },
  removeQrCodeBehindLogo: {
    type: Boolean,
    default: false,
  },
  logoPaddingStyle: {
    type: String,
    enum: ["square", "circle"],
    default: "square",
  },
  qrStyle: {
    type: String,
    enum: ["squares", "dots"],
    default: "squares",
  },
  eyeRadius: {
    type: Number,
    default: 12,
  },
  eyeColor: {
    type: String,
    default: "#000000",
  },
});

const Custom = mongoose.model("Custom", customSchema);

export default Custom;
