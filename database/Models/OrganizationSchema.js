import { model, models, Schema, Types } from "mongoose";

const organizationSchema = new Schema({
    Name: {
        type: String,
        required: true,
    },
    OrganizationType: {
        type: String,
        enum: ['Client', 'Partner'],
    },
    CreatedBy: {
        type: Types.ObjectId,
    },
    Address1: {
        type: String,
    },
    Address2: {
        type: String,
    },
    City: {
        type: String,
    },
    State: {
        type: String,
    },
    Country: {
        type: String,
    },
    PostalCode: {
        type: String,
    },
    BillingContactEmail: {
        type: String,
    },
    BillingContactPhone: {
        type: String,
    },
    BillingContactFirstName: {
        type: String,
    },
    BillingContactLastName: {
        type: String,
    },
    BillingAddress: {
        type: String,
    },
    BillingAddress2: {
        type: String,
    },
    BillingCity: {
        type: String,
    },
    BillingState: {
        type: String,
    },
    BillingPostalCode: {
        type: String,
    },
    BillingCountry: {
        type: String,
    },
    StripeId: {
        type: String,
    }
}, { timestamps: true });

const Organization = models.Organization || model('Organization', organizationSchema);

export default Organization;