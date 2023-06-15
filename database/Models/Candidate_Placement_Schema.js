import mongoose, { model, models, Schema } from "mongoose";

const candidateMappingSchema = new Schema({
    placementId: {
        type: mongoose.Types.ObjectId,
        ref: 'Placement'
    },
    candidateId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    candidateStatus: {
        type: String,
        enum: ['New', 'Interviewing', 'Hired', 'Rejected']
    }
}, { timestamps: true });

const CandidateMapPlacements = models.Candidate_Placement || model('Candidate_Placement', candidateMappingSchema);

export default CandidateMapPlacements;
