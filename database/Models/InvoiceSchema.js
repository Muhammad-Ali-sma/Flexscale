import mongoose, { model, models, Schema } from "mongoose";

const invoiceSchema = new Schema({
    invoiceId: {
        type: String,
    },
    Organization: {
        type: mongoose.Types.ObjectId,
        ref: 'Organization'
    },
    BilledTo: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    Timesheets: [{
        type: mongoose.Types.ObjectId,
        ref: 'Timesheet'
    }],

}, { timestamps: true });

const Invoice = models.Invoice || model('Invoice', invoiceSchema);

export default Invoice;