import mongoose, { model, models, Schema } from "mongoose";

const placementSchema = new Schema({
    JobTitle: {
        type: String,
        required: true,
    },
    CreatedBy: {
        type: String,
    },
    Status: {
        type: String,
        enum: ['Active', 'Inactive']
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
    Role: {
        type: String
    },
    Skills: {
        type: Array
    },
    WorkExperience: {
        type: String
    },
    TimeZone: {
        type: String
    },
    PrimaryRecruitingContact: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    Subscribers: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    ],
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
    Candidates: [{
        type: mongoose.Types.ObjectId,
        ref: 'Candidate_Placement'
    }],
    Contracts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Contract'
    }],
}, { timestamps: true });

const Placement = models.Placement || model('Placement', placementSchema);

export default Placement;