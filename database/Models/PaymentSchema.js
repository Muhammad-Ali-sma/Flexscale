import { model, models, Schema } from "mongoose";

const paymentSchema = new Schema({
    payment: {
        type: Object
    }
}, { timestamps: true });

const Payment = models.Payment || model('Payment', paymentSchema);

export default Payment;