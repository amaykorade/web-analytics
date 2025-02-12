import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

export const AuthModel = mongoose.model("User", authSchema);