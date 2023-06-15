import mongoose, { model, models, Schema } from "mongoose";

const timesheetSchema = new Schema({
    Organization: {
        type: mongoose.Types.ObjectId,
        ref: 'Organization'
    },
    User: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    Contract: {
        type: mongoose.Types.ObjectId,
        ref: 'Contract'
    },
    Invoice: {
        type: mongoose.Types.ObjectId,
        ref: 'Invoice'
    },
    TimePeriodStart: {
        type: String,
    },
    TimePeriodEnd: {
        type: String,
    },
    TimeLog: [{
        date: String,
        hours: String,
        check: String
    }],
    CreatedBy: {
        type: String,
    }
}, { timestamps: true })

const Timesheet = models.Timesheet || model('Timesheet', timesheetSchema);

export default Timesheet;