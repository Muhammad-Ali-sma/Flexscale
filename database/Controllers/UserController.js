import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import Users from "../Models/UserSchema";
import { makeToken } from "./AuthController";
import Contract from "../Models/ContractSchema";
import { INTERNAL_USER } from '../../utils';

export const GetUsers = async (req, res) => {
    try {
        const users = await Users.find().populate(['Organization', 'Manager', 'Contracts', 'Documents']);
        if (users?.length && users?.length > 0) {
            return res.status(200).json({ success: true, users });
        } else {
            return res.status(200).json({ success: false, message: 'Data Not Found' });
        }
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` });
    }
}

export const getOrganizationAdmins_Managers = async (orgId, accessLevels) => {
    const users = await Users.find({ AccessLevel: { $in: accessLevels }, Organization: mongoose.Types.ObjectId(orgId) }).populate('Organization');
    if (!users) return res.status(200).json({ success: false, message: 'No User Found!' })
    let userEmails = [];
    users?.map(x => userEmails?.push(x?.Email))
    return { userEmails };
}

export const GetTeamMembers = async (req, res) => {
    try {
        const { OrganizationId } = req.query;
        let members = await Contract.find({ Status: { $ne: 'Ended' }, Organization: mongoose.Types.ObjectId(OrganizationId) }).populate(['Organization', 'User', { path: 'User', populate: 'Manager' }])
        if (!members) return res.status(200).json({ message: 'User Not Found' })
        return res.status(200).json({ success: true, members });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.query;
        const formData = req.body;
        if (userId && formData) {
            const user = await Users.updateOne(
                { _id: userId },
                {
                    $set: {
                        FirstName: formData?.FirstName,
                        LastName: formData?.LastName,
                        Phone: formData?.Phone,
                        Email: formData?.Email,
                        PreferredName: formData?.PreferredName,
                        AccessLevel: formData?.AccessLevel,
                        Gender: formData?.Gender,
                        Location: formData?.country,
                        Organization: formData?.Organization?.filter(x => mongoose.Types.ObjectId(x)),
                        Manager: formData?.manager ? formData?.manager?.filter(x => mongoose.Types.ObjectId(x)) : []
                    },
                }
            )
            res.status(200).json({ success: true, user, organization: formData?.Organization })
        } else {
            res.status(200).json({ success: false, message: 'Error occcured please try again!' })
        }
    } catch (error) {
        res.status(404).json({ error: "Error While Updating the Data...!", error })
    }
}

export const UploadProfileImage = async (req, res) => {
    try {
        const { userId } = req.query;
        const formData = req.body;
        if (userId && formData) {
            const user = await Users.updateOne(
                { _id: userId },
                {
                    $set: {
                        ProfileImage: formData?.image,
                    },
                }
            )
            res.status(200).json({ success: true, user })
        } else {
            res.status(200).json({ success: false, message: 'Error occcured please try again!' })
        }
    } catch (error) {
        res.status(404).json({ error: "Error While Updating the Data...!", error })
    }
}

export const RegisterUser = async (req, res) => {
    try {

        const userData = req.body;
        let decoded = null;
        let err = [];
        let token = null;
        if (userData?.token) {
            decoded = jwt.decode(userData?.token);
        }

        if(userData?.accessLevel !== INTERNAL_USER.level){
            const user = await Users.findOne({ Email: userData?.email })
            if (user) err.push('Email already Exist!');
        }
        
        if (err.length > 0) {
            return res.status(200).json({ success: false, message: err });
        }

        const hashPass = await bcrypt.hash(userData?.firstName + 123, 10);
        Users.create({
            FirstName: userData?.firstName,
            LastName: userData?.lastName,
            Phone: userData?.phone,
            Email: decoded && Object.keys(decoded)?.length > 0 ? decoded?.sub : userData?.email,
            Password: hashPass,
            ProfileImage: userData?.image,
            Status: userData?.status ? userData?.status : "Active",
            PreferredName: userData?.preferredName,
            AccessLevel: userData?.accessLevel,
            CreatedBy: userData?.createdBy,
            JobTitle: userData?.jobTitle,
            TypeOfEmployment: userData?.typeOfEmployment ? userData?.typeOfEmployment : 'Full-Time',
            WorkHoursPerWeek: userData?.workHoursPerWeek,
            RatePerHour: userData?.ratePerHour,
            NoOfPaidTimeOffDays: userData?.noOfPaidTimeOffDays,
            Manager: userData?.manager ? userData?.manager?.map(x => mongoose.Types.ObjectId(x)) : [],
            Gender: userData?.gender,
            Location: userData?.country,
            Organization: userData?.organization ? userData?.organization?.map(x => mongoose.Types.ObjectId(x)) : [],
        }, async (err, user) => {
            if (decoded && Object.keys(decoded)?.length > 0) {
                token = makeToken(user?._id);
            }
            const data = await user?.populate('Organization')
            if (err) throw err;
            if (user) return res.status(200).json({ success: true, data, token });
        })
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.query;
        if (userId) {
            const user = await Users.findByIdAndDelete(userId)
            return res.status(200).json({ success: true, user });
        } else {
            return res.status(400).json({ success: false, error: "Error occured please try again!" })
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: `${error}` })
    }
}
