import mongoose, { model, models, Schema } from "mongoose";

const documentSchema = new Schema({
    FileName: {
        type: String,
    },
    User: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    Location: {
        type: String,
    },
    CreatedBy: {
        type: String,
    }
}, { timestamps: true });

const Document = models.Document || model('Document', documentSchema);

export default Document;