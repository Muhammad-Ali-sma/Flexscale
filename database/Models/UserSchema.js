import mongoose, { model, models, Schema } from "mongoose";
import { CLIENT_BILLING_ADMIN, CLIENT_SUPER_ADMIN, CLIENT_USER, INTERNAL_ADMIN, INTERNAL_MANAGER, INTERNAL_USER } from "../../utils";

const userSchema = new Schema({
    FirstName: {
        type: String,
        required: true,
    },
    PreferredName: {
        type: String,
    },
    LastName: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
    },
    Phone: {
        type: String,
    },
    ProfileImage: {
        type: String,
    },
    AccessLevel: {
        type: Number,
        enum: [CLIENT_SUPER_ADMIN.level, CLIENT_BILLING_ADMIN.level, CLIENT_USER.level, INTERNAL_ADMIN.level, INTERNAL_MANAGER.level, INTERNAL_USER.level]
    },
    Status: {
        type: String,
        enum: ["Onboarding", "Active", "On Leave", "Inactive", "Ended"],
        default: "Onboarding"
    },
    CreatedBy: {
        type: String,
    },
    Location: {
        type: String,
    },
    Organization: [{
        type: mongoose.Types.ObjectId,
        ref: 'Organization'
    }],
    Manager: [{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }],
    Password: {
        type: String,
    },
    Gender: {
        type: String,
    },
    Contracts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Contract'
    }],
    Documents: [{
        type: mongoose.Types.ObjectId,
        ref: 'Document'
    }]
}, { timestamps: true });

const Users = models.user || model('user', userSchema);

export default Users;