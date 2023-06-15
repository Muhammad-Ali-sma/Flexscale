import CandidateMapPlacements from "../Models/Candidate_Placement_Schema";
import Organization from "../Models/OrganizationSchema";
import Timesheet from "../Models/TimesheetSchema";
import Placement from "../Models/PlacementSchema";
import { getTemplate } from "../../utils/script";
import Contract from "../Models/ContractSchema";
import Document from "../Models/DocumentSchema";
import Invoice from "../Models/InvoiceSchema";
import Payment from "../Models/PaymentSchema";
import Logs from "../Models/FlexLogSchema";
import Users from "../Models/UserSchema";
import { sendGrid } from "../server";
import { host } from "../../utils";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export const LoginUser = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        let err = [];
        if (!Email) err.push('Please Enter Email');
        if (!Password) err.push('Please Enter Password');

        const user = await Users.findOne({ Email: Email?.toLowerCase() }).populate('Organization')
        if (!user) return res.status(404).json({ success: false, message: 'This account does not exist!' })

        const matchPass = await bcrypt.compare(Password, user?.Password);
        if (matchPass) {
            const token = makeToken(user?._id);
            res.status(200).json({ success: true, user, token });
        } else {
            err.push('Incorrect Password');
        }
        if (err.length > 0) {
            return res.status(200).json({ success: false, message: err });
        }
    } catch (e) {
        return res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const ChangePassword = async (req, res) => {
    try {
        const { Email, CPassword } = req.body;

        const user = await Users.findOne({ Email: Email?.toLowerCase() })
        if (!user) return res.status(404).json({ success: false, message: 'Incorrect Email!' });

        if (user) {
            const hashPass = await bcrypt.hash(CPassword, 10);

            const user = await Users.updateOne(
                { email: Email },
                {
                    $set: {
                        Password: hashPass,

                    }
                })
            res.status(200).json({ success: true, user })
        }
    } catch (e) {
        return res.status(200).json({ success: false, message: e })
    }
}

export const makeToken = (id, expiry) => {
    return jwt.sign({ sub: id }, 'serverRuntimeConfig.secret', { expiresIn: expiry ? expiry : '7d' });
};

export const SendMagicLink = async (req, res, dest) => {
    const { Email } = req.body;

    const user = await Users.findOne({ Email: Email?.toLowerCase() })
    if (dest === 'login') {
        if (!user) {
            const token = makeToken(Email);
            const emailTemplate = {
                heading: `Sign up to Flexscale`,
                subheading: 'Click the button below to sign up.',
                description: `Here is the sign up link you requested. If you did not request this link, please ignore this email.`,
                linktext: "Click to sign up",
                link: `${host}/signup?token=${token}`,
            };
            await sendGrid(getTemplate(emailTemplate), 'Sign up to Flexscale', Email);
            return res.status(200).send({ success: true, message: `Sign Up link has been successfully sent to your email.` });
        }
    } else {
        if (!user) return res.status(404).json({ success: false, message: 'Incorrect Email' })
    }
    const token = makeToken(user?._id, '10m');
    if (dest === 'login') {
        const emailTemplate = {
            heading: `Sign in to Flexscale`,
            subheading: 'Click the button below to sign in.',
            description: `Here is the sign in link you requested. If you did not request this link, please ignore this email.`,
            linktext: "Click to sign in",
            link: `${host}/${dest}?token=${token}`,
        };
        await sendGrid(getTemplate(emailTemplate), 'Sign in to Flexscale', Email);
        res.status(200).send({ success: true, message: `Sign In link has been successfully sent to your email.` });
    }
    if (dest === 'forget-password') {
        const emailTemplate = {
            heading: `Reset your password`,
            subheading: 'Click the button below to create a new password.',
            description: `You will be able to reset your password or create a new one for the first time.`,
            linktext: "Click to reset password",
            link: `${host}/${dest}?token=${token}`,
        };
        sendGrid(getTemplate(emailTemplate), 'Reset your password for Flexscale', Email);
        res.status(200).send({ success: true, message: `Email sent successfully.` });
    }

}

export const VerifyToken = async (token) => {
    try {
        if (!token) {
            return ({ success: false, message: "Can't verify user." });
        }
        var decoded = jwt.decode(token);
        if (Date.now() >= decoded?.exp * 1000) {
            return ({ success: false, message: 'Token Expired!' })
        }
        if (decoded?.sub) {
            const user = await Users.findOne({ _id: decoded?.sub })
            if (!user) return ({ success: false, message: 'Login link expired!' });
            return ({ success: true, token, accessLevel: user?.AccessLevel });
        } else {
            return ({ success: false, message: 'Login link expired!' })
        }
    } catch (e) {
        return ({ success: false, message: `Error: ${e}` })
    }
};

export const VerifyLoginLink = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        var decoded = jwt.decode(token);
        if (decoded?.sub) {
            const user = await Users.findOne({ _id: decoded?.sub }).populate("Organization")
            if (user) {
                const newToken = makeToken(user?._id);

                return res.status(200).json({ success: true, token: newToken, user });
            } else {
                return res.status(404).json({ success: false, message: 'Login link expired!' })
            }
        } else {
            res.status(404).json({ success: false, message: 'Login link expired!' })
        }
    } catch (e) {
        return res.status(404).json({ success: false, message: `Error: ${e}` })
    }
};

export const createLog = async (req, res) => {
    try {
        const { code, message, userId } = req.body;
        const response = await Logs.create({ code, message, userId });
        res.send({ response });
    } catch (e) {
        return res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const GetErrorLogs = async (req, res) => {
    try {
        const data = await Logs.find().sort({ createdAt: 'desc' });
        res.status(200).send({ success: true, data });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const DeleteErrorLogs = async (req, res) => {
    try {
        await Logs.deleteMany();
        res.status(200).json({ success: true, message: `Logs cleared successfully` });
    } catch (e) {
        return res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const ClearDatabase = async (req, res) => {
    try {
        await Contract.deleteMany();
        await Placement.deleteMany();
        await Invoice.deleteMany();
        await Document.deleteMany();
        await Timesheet.deleteMany();
        await Organization.deleteMany({ Name: { $ne: "Flexscale" } });
        await Users.deleteMany({ _id: { $nin: [mongoose.Types.ObjectId('6386106b8534e766fcbada14'), mongoose.Types.ObjectId('638738cac433dd6d8b03daf5')] } });
        await Payment.deleteMany();
        await CandidateMapPlacements.deleteMany();
        await Logs.deleteMany();
        return res.status(200).json({ success: true, message: `Database cleared successfully` })
    } catch (e) {
        return res.status(404).json({ success: false, message: `Error: ${e}` })
    }
};