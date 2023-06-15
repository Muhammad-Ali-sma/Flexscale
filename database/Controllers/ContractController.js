import { getOrganizationAdmins_Managers } from "./UserController";
import Placement from "../Models/PlacementSchema";
import { getTemplate } from "../../utils/script";
import Contract from "../Models/ContractSchema";
import { CLIENT_SUPER_ADMIN, host, INTERNAL_ADMIN, INTERNAL_MANAGER } from "../../utils";
import Users from "../Models/UserSchema";
import mongoose from "mongoose";
import moment from "moment";
import { sendNotificationEmail } from "../server";


export const CreateContract = async (req, res) => {
    try {
        const data = req.body;
        Contract.create({
            JobTitle: data?.JobTitle,
            CreatedBy: data?.CreatedBy,
            Status: 'Onboarding',
            StartDate: data?.StartDate,
            GoLiveDate: data?.GoLiveDate,
            EndDate: data?.EndDate,
            Organization: mongoose.Types.ObjectId(data?.Organization?._id ? data?.Organization?._id : data?.Organization),
            User: mongoose.Types.ObjectId(data?.User?._id),
            Placement: data?.Placement ? mongoose.Types.ObjectId(data?.Placement?._id) : null,
            TypeofEmployment: data?.TypeofEmployment ? data?.TypeofEmployment : 'None',
            WorkHoursPerWeek: data?.WorkHoursPerWeek,
            RatePerHour: data?.RatePerHour,
            NoOfPaidTimeOffDays: data?.NoOfPaidTimeOffDays,
        }, async (err, item) => {
            if (err) throw err;
            if (item) {
                let temp = [...data?.prevIds, item?._id]
                let users = await getOrganizationAdmins_Managers(data?.Organization?._id, [INTERNAL_MANAGER.level, INTERNAL_ADMIN.level]);
                let tempEmails = [];
                if (data?.Placement?.PrimaryRecruitingContact && data?.Placement?.PrimaryRecruitingContact?.lengt > 0) {
                    tempEmails.push(data?.Placement?.PrimaryRecruitingContact[0]?.Email);

                }
                data?.Placement?.Subscribers?.map(x => tempEmails.push(x?.Email))

                const clientTemplate = {
                    heading: `Congrats on hiring ${data?.User?.FirstName} ${data?.User?.LastName}`,
                    subheading: 'We have received your confirmation for this candidate.',
                    description: `Thank you for confirming ${data?.User?.FirstName} ${data?.User?.LastName} for the ${data?.JobTitle} position.<br><br>We will start the onboarding process. You can now see your team member’s profile and contract in your account.`,
                    linktext: "See profile",
                    link: `${host}/team`,
                };
                tempEmails?.map(x => sendNotificationEmail(getTemplate(clientTemplate), `${data?.User?.FirstName} ${data?.User?.LastName} has been confirmed for the ${data?.JobTitle} role.`, x))

                const adminTemplate = {
                    heading: `${data?.Organization?.Name} has hired ${data?.User?.FirstName} ${data?.User?.LastName}`,
                    subheading: '',
                    description: `${data?.User?.FirstName} ${data?.User?.LastName} has been confirmed for the ${data?.JobTitle} position.<br> Please reach out to the client to start the onboarding process.`,
                    linktext: "See contract",
                    link: `${host}/contracts/${item?._id}`,
                };
                users?.userEmails?.map(x => sendNotificationEmail(getTemplate(adminTemplate), `${data?.Organization?.Name} has hired ${data?.User?.FirstName} ${data?.User?.LastName}`, x))
                await Placement.updateOne(
                    { _id: data?.Placement },
                    {
                        $set: {
                            Contracts: temp?.map(x => mongoose.Types.ObjectId(x)),
                        },
                    }
                )
                let contractIds = [...data?.userContractIds, item?._id];
                let orgIds = [...data?.prevOrganizationsIds, data?.Organization?._id];
                await Users.updateOne(
                    { _id: data?.User },
                    {
                        $set: {
                            Organization: orgIds?.map(x => mongoose.Types.ObjectId(x)),
                            Contracts: contractIds?.map(x => mongoose.Types.ObjectId(x))
                        },
                    }
                )

                return res.status(200).json({ success: true, item });
            }
        })
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const GetContractById = async (req, res) => {
    try {
        const { Id } = req.query;
        const contract = await Contract.findOne({ _id: Id }).populate(['Organization', {
            path: 'User',
            populate: { path: 'Manager' }
        }])
        if (!contract) return res.status(200).json({ success: false, message: 'No Contract Found!' })
        return res.status(200).json({ success: true, data: contract });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const GetContractByUserId = async (req, res) => {
    try {
        const { userId } = req.query;
        const contracts = await Contract.find({ User: userId }).populate(['Organization', {
            path: 'User',
            populate: { path: 'Manager' }
        }])
        if (!contracts) return res.status(200).json({ success: false, message: 'No Contract Found!' })
        return res.status(200).json({ success: true, data: contracts });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const GetAllContracts = async (req, res) => {
    try {
        const contracts = await Contract.find().populate(['Organization', {
            path: 'User',
            populate: { path: 'Manager' }
        }]).sort({ createdAt: 'desc' })
        if (!contracts) return res.status(200).json({ success: false, message: 'No Contract Found!' })
        return res.status(200).json({ success: true, contracts });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const GetContractByOrgId = async (req, res) => {
    try {
        const { orgId } = req.query;
        const contracts = await Contract.find({ Organization: mongoose.Types.ObjectId(orgId) }).populate(['Organization', 'User'])
        if (!contracts) return res.status(200).json({ success: false, message: 'No Contract Found!' })
        return res.status(200).json({ success: true, contracts });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const UpdateContract = async (req, res) => {
    try {
        const { contractId } = req.query;
        const data = req.body;
        if (contractId && data) {
            const contract = await Contract.updateOne(
                { _id: contractId },
                {
                    $set: {
                        JobTitle: data?.JobTitle,
                        Status: data?.Status,
                        StartDate: data?.StartDate,
                        GoLiveDate: data?.GoLiveDate,
                        EndDate: data?.EndDate,
                        TypeofEmployment: data?.TypeofEmployment,
                        WorkHoursPerWeek: data?.WorkHoursPerWeek,
                        RatePerHour: data?.RatePerHour,
                        NoOfPaidTimeOffDays: data?.NoOfPaidTimeOffDays
                    },
                }
            )
            res.status(200).json({ success: true, contract })
        } else {
            res.status(200).json({ success: false, message: 'Error occcured please try again!' })
        }
    } catch (error) {
        res.status(404).json({ error: "Error While Updating the Contract...!", error })
    }
}

export const UpdateContractStatus = async (req, res) => {
    try {
        const { contractId, userId } = req.query;
        const data = req.body;
        if (contractId) {
            if (userId && userId !== 'undefined') {
                await Users.updateOne(
                    { _id: userId },
                    {
                        $set: {
                            Organization: data?.Organization ? data?.Organization?.map(x => mongoose.Types.ObjectId(x)) : null,
                            Contracts: data?.Contracts ? data?.Contracts?.map(x => mongoose.Types.ObjectId(x)) : null
                        }
                    })
                const response = await Contract.updateOne(
                    { _id: contractId },
                    {
                        $set: {
                            Status: 'Ended',
                            Reason: ""
                        },
                    }
                )
                return res.status(200).json({ success: true, response });
            }
            const response = await Contract.findOneAndUpdate(
                { _id: contractId },
                {
                    $set: {
                        Status: data?.ContractStatus,
                        Reason: data?.Reason ?? ""
                    },
                }
                , { returnDocument: 'after' }
            );
            if (data?.ContractStatus === 'On Leave') {
                let users = await getOrganizationAdmins_Managers(data?.contract?.Organization?._id, [CLIENT_SUPER_ADMIN.level]);
                const clientTemplate = {
                    heading: `${data?.contract?.User?.FirstName} ${data?.contract?.User?.LastName} is on leave.`,
                    subheading: '',
                    description: `We are providing a notice of absence for ${data?.contract?.User?.FirstName} ${data?.contract?.User?.LastName} (${data?.contract?.JobTitle}), as of ${moment(response?.updatedAt).format('MMMM DD, YYYY h:mmA')}.${data?.Reason ? `<br><br>The reason is ""${data?.Reason}""` : ''}<br><br>Please contact your Account Manager if any questions.`,
                    linktext: "See profile",
                    link: `${host}/team/user-details/${data?.contract?.User?._id}`,
                };
                sendNotificationEmail(getTemplate(clientTemplate), `${data?.contract?.User?.FirstName} ${data?.contract?.User?.LastName} is on leave.`, users?.userEmails[0])
            }
            return res.status(200).json({ success: true, response });
        } else {
            res.status(404).json({ success: false, error: "Error occured please try again!" })
        }
    } catch (error) {
        res.status(404).json({ error: "Error While Updating the Contract Status...!" })
    }
}