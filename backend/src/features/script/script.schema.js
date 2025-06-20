import mongoose from "mongoose";

const scriptSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    websiteName: {
        type: String,
        required: true
    },
    scriptId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "active"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const ScriptModel = mongoose.model("Script", scriptSchema);

export default ScriptModel;
