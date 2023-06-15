import { model, models, Schema } from "mongoose";

const flexLogSchema = new Schema({
    code: {
        type: String,
    },
    message: {
        type: String,
    },
    userId: {
        type: String
    }
}, { timestamps: true });

const Logs = models.FlexLogs || model('FlexLogs', flexLogSchema);

export default Logs;