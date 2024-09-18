import mongoose from "../db/conn.mjs";
import { Schema } from "mongoose";

const PetSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    color: { type: String, required: true },
    images: { type: [], required: true },
    available: { type: Boolean },
    user: {
      _id: { type: Schema.Types.ObjectId, ref: "User" },
      name: { type: String },
      image: { type: String },
      phone: { type: String },
    },
    adopter: {
      _id: { type: Schema.Types.ObjectId, ref: "User" },
      name: { type: String },
      image: { type: String },
      phone: { type: String },
    },
  },
  { timestamps: true }
);

const Pet = mongoose.model("Pet", PetSchema);

export default Pet;
