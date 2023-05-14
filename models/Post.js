import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true
        },
        authors: {
            type: Array,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        imagesUrls: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true
    })

export default mongoose.model('Post', PostSchema)