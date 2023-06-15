import mongoose, { model, models, Schema } from "mongoose";

const contractSchema = new Schema({
    JobTitle: {
        type: String,
        required: true,
    },
    CreatedBy: {
        type: String,
    },
    Status: {
        type: String,
        enum: ["Onboarding", "Active", "On Leave", "Inactive", "Ended"],
        default: "Onboarding"
    },
    StartDate: {
        type: Date,
    },
    GoLiveDate: {
        type: Date,
    },
    EndDate: {
        type: Date,
    },
    Organization: {
        type: mongoose.Types.ObjectId,
        ref: 'Organization'
    },
    TypeofEmployment: {
        type: String,
        enum: ['Full-Time', 'Part-Time', 'Contract', 'None']
    },
    WorkHoursPerWeek: {
        type: Number,
    },
    RatePerHour: {
        type: Number,
    },
    NoOfPaidTimeOffDays: {
        type: Number,
    },
    User: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    Placement: {
        type: mongoose.Types.ObjectId,
        ref: 'Placement'
    },
    Reason: {
        type: String,
    }
}, { timestamps: true });

const Contract = models.Contract || model('Contract', contractSchema);

export default Contract;