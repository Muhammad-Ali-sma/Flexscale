import stripe from "stripe";
import mongoose from "mongoose";
import sgMail from '@sendgrid/mail'
import nodeMailer from "nodemailer";
import Logs from "./Models/FlexLogSchema";
import { DB_URI, SENDGRID_API_KEY, SMTPSettings, Stripe_SecretT_Key } from "../utils";

require('./Models/Candidate_Placement_Schema');
require('./Models/ContractSchema');
require('./Models/UserSchema');
require('./Models/PlacementSchema');
require('./Models/OrganizationSchema');
require('./Models/InvoiceSchema');
require('./Models/TimesheetSchema');
require('./Models/DocumentSchema');

const connectToMongo = async () => {

    try {
        const { connection } = await mongoose.connect(DB_URI);
        if (connection.readyState === 1) {
            console.log('Connected')
        } else {
            console.log('Connected Failed')
        }
    } catch (e) {
        return e;
    }
}

export const stripeObj = () => {
    return stripe(Stripe_SecretT_Key)
}

export const sendGrid = (html, subject, Email) => {
    sgMail.setApiKey(SENDGRID_API_KEY)

    const msg = {
        to: process.env.NODE_ENV === 'development' ? "syedalisma1234@gmail.com" : Email,
        from: "Flexscale <no-reply@flexscale.com>",
        subject,
        html
    }
    return sgMail.send(msg)
        .then(async (res) => { await Logs.create({ code: 'Test', message: JSON.stringify(res) }); return res })
        .catch(async (error) => { await Logs.create({ code: 'Test', message: JSON.stringify(error) }); return error })
}

export const sendNotificationEmail = (html, subject, Email) => {
    console.log('Email', Email)
    const mailData = {
        from: "Flexscale <no-reply@flexscale.com>",
        html,
        subject,
        to: process.env.NODE_ENV === 'development' ? "syedalisma1234@gmail.com" : Email,
    };
    return nodeMailer.createTransport(SMTPSettings).sendMail(mailData, (error, data) => {
        if (error) {
            return error;
        }
        if (data) {
            return data;
        }
    });

}
export default connectToMongo;