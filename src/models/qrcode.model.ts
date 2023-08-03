import mongoose from "mongoose";
import { ContentTypes } from "../constants/contentType.const";

const qrCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "QR code",
  },
  contentType: {
    type: String,
    enum: ContentTypes,
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content",
    required: true,
  },
  custom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Custom",
    required: true,
  },
  totalScan: {
    type: Number,
    default: 0,
  },
  ownerId: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QRCode = mongoose.model("QRCode", qrCodeSchema);

export default QRCode;
