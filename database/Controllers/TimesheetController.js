import mongoose from "mongoose";
import Timesheet from "../Models/TimesheetSchema";


export const CreateTimesheet = async (req, res) => {
    try {
        const data = req.body;
        Timesheet.create({
            Organization: mongoose.Types.ObjectId(data?.Organization?._id),
            User: mongoose.Types.ObjectId(data?.User?._id),
            Contract: mongoose.Types.ObjectId(data?.Contract?._id),
            TimePeriodStart: data?.TimePeriodStart,
            TimePeriodEnd: data?.TimePeriodEnd,
            TimeLog: data?.TimeLog,
            CreatedBy: data?.CreatedBy
        }, async (err, item) => {
            if (err) throw err;
            if (item) {
                return res.status(200).json({ success: true, item });
            }
        })
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const GetAllTimesheets = async (req, res) => {
    try {
        const timesheets = await Timesheet.find().populate(['Organization', 'User', 'Contract']).sort({ createdAt: 'desc' });
        if (!timesheets) return res.status(200).json({ message: 'Timesheet Not Found' })
        return res.status(200).json({ success: true, timesheets });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` });
    }
}

export const GetTimesheetById = async (req, res) => {
    try {
        const { id } = req.query;
        const timesheet = await Timesheet.findOne({ _id: id }).populate(['Organization', 'User', 'Contract'])
        if (!timesheet) return res.status(200).json({ message: 'Timesheet Not Found' })
        return res.status(200).json({ success: true, timesheet });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` });
    }
}

export const GetTimesheetByUserId = async (req, res) => {
    try {
        const { userId, orgId, contractId } = req.query;
        const timesheets = await Timesheet.find({ User: mongoose.Types.ObjectId(userId), Organization: mongoose.Types.ObjectId(orgId), Contract: mongoose.Types.ObjectId(contractId) })
        if (!timesheets) return res.status(200).json({ message: 'Timesheets Not Found' })
        return res.status(200).json({ success: true, timesheets });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` });
    }
}

export const UpdateTimesheet = async (req, res) => {
    try {
        const { timesheetId } = req.query;
        const data = req.body;
        if (timesheetId && data) {
            const timesheet = await Timesheet.updateOne(
                { _id: timesheetId },
                {
                    $set: {
                        TimePeriodStart: data?.TimePeriodStart,
                        TimePeriodEnd: data?.TimePeriodEnd,
                        TimeLog: data?.TimeLog,
                    },
                }
            )
            res.status(200).json({ success: true, timesheet })
        } else {
            res.status(200).json({ success: false, message: 'Error occcured please try again!' })
        }
    } catch (error) {
        res.status(404).json({ error: `Error: ${error}` })
    }
}

export const DeleteTimesheet = async (req, res) => {
    try {
        const { timesheetId } = req.query;
        if (timesheetId) {
            const response = await Timesheet.findByIdAndDelete(timesheetId);
            return res.status(200).json({ success: true, response });
        } else {
            res.status(404).json({ success: false, error: "Error occured please try again!" })
        }
    } catch (error) {
        res.status(404).json({ error: "Error While Deleting the Timesheet...!" })
    }
}