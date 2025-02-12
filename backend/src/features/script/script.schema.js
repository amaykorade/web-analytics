import mongoose from "mongoose";

const scriptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true, unique: true },
    websiteName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const ScriptModel = mongoose.model("ScriptInstallation", scriptSchema);

export default ScriptModel;
