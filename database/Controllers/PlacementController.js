import CandidateMapPlacements from "../Models/Candidate_Placement_Schema";
import { getOrganizationAdmins_Managers } from "./UserController";
import Placement from "../Models/PlacementSchema";
import { getTemplate } from "../../utils/script";
import { host, INTERNAL_ADMIN, INTERNAL_MANAGER } from "../../utils";
import mongoose from "mongoose";
import moment from "moment";
import { sendNotificationEmail } from "../server";

export const CreatePlacement = async (req, res) => {
    try {

        const formData = req.body;
        Placement.create({
            JobTitle: formData?.JobTitle,
            CreatedBy: formData?.CreatedBy,
            Status: formData?.Status ? formData?.Status : 'Active',
            StartDate: formData?.StartDate,
            GoLiveDate: formData?.GoLiveDate,
            EndDate: formData?.EndDate,
            Organization: mongoose.Types.ObjectId(formData?.Organization),
            Role: formData?.Role ?? null,
            Skills: formData?.Skills ?? null,
            WorkExperience: formData?.WorkExperience ?? null,
            TimeZone: formData?.TimeZone ?? '',
            PrimaryRecruitingContact: formData?.PrimaryRecruitingContact ? mongoose.Types.ObjectId(formData?.PrimaryRecruitingContact) : null,
            Subscribers: formData?.Subscribers ? formData?.Subscribers?.map(x => mongoose.Types.ObjectId(x?._id)) : [],
            TypeofEmployment: formData?.TypeofEmployment ? formData?.TypeofEmployment : 'None',
            WorkHoursPerWeek: formData?.WorkHoursPerWeek,
            RatePerHour: formData?.RatePerHour,
            NoOfPaidTimeOffDays: formData?.NoOfPaidTimeOffDays,
            Candidates: formData?.Candidates ? formData?.Candidates?.map(x => mongoose.Types.ObjectId(x)) : [],
            Contracts: formData?.Contracts ? formData?.Contracts?.map(x => mongoose.Types.ObjectId(x)) : []
        }, async (err, data) => {
            if (formData?.Name) {
                let item = await data?.populate(['Organization', 'PrimaryRecruitingContact', 'Subscribers'])
                let users = await getOrganizationAdmins_Managers(formData?.Organization, [INTERNAL_MANAGER.level, INTERNAL_ADMIN.level]);
                let tempEmails = [item?.PrimaryRecruitingContact?.Email];
                item?.Subscribers?.map(x => tempEmails.push(x?.Email))
                if (err) throw err;
                const clientTemplate = {
                    heading: "Your hiring request has been submitted",
                    subheading: '',
                    description: `We will review your request to hire a ${data?.JobTitle} with an ideal start date of ${moment(data?.StartDate).format('MM-DD-YYYY')} <br><br> You can track the progress of your request below by clicking the button below.`,
                    link: `${host}/hiring/requests/${data?._id}`,
                    linktext: "See hiring request",
                };
                tempEmails?.map(x => sendNotificationEmail(getTemplate(clientTemplate), `Your request to hire a ${data?.JobTitle} has been submitted`, x))
                const adminTemplate = {
                    heading: `Hiring request submitted by ${item?.Organization?.Name}`,
                    subheading: '',
                    description: `Here are the details:<ul><li>Organization: ${item?.Organization?.Name}</li><li>User: ${formData?.Name}</li><li>Job Title: ${data?.JobTitle}</li><li>Ideal Start Date: ${moment(data?.StartDate).format('MM-DD-YYYY')}</li><li>Request ID: ${data?._id}</li></ul>`,
                    linktext: "See hiring request",
                    link: `${host}/placements/${data?._id}`,
                };
                users?.userEmails?.map(x => sendNotificationEmail(getTemplate(adminTemplate), `Hiring request from ${item?.Organization?.Name}`, x))
            }
            if (data) return res.status(200).json({ success: true, data });
        })
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const GetPlacementsByOrgId = async (req, res) => {
    try {
        const { orgId } = req.query;
        let tempIds = orgId.split(',')
        const placements = await Placement.find({ Organization: { $in: tempIds?.map(x => mongoose.Types.ObjectId(x)) } }).populate('Contracts');
        let contracts = [];
        placements?.map(x => x?.Contracts?.length > 0 && contracts.push(...x?.Contracts))
        if (!placements) return res.status(200).json({ success: false, message: 'No Placement Found!' })
        return res.status(200).json({ success: true, placements, contracts });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const GetPlacementById = async (req, res) => {
    try {
        const { Id } = req.query;
        const placement = await Placement.findOne({ _id: Id }).populate(['Organization', 'Contracts', 'PrimaryRecruitingContact', 'Subscribers', {
            path: 'Candidates',
            populate: { path: 'candidateId' }
        }])
        if (!placement) return res.status(200).json({ success: false, message: 'No Placement Found!' })
        return res.status(200).json({ success: true, data: placement });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const updatePlacement = async (req, res) => {
    try {
        const { placementId } = req.query;
        const data = req.body;

        if (placementId && data) {
            if (data?.Status === 'Inactive') {
                let users = await getOrganizationAdmins_Managers(data?.Organization?._id, [INTERNAL_MANAGER.level, INTERNAL_ADMIN.level]);
                let tempEmails = [data?.PrimaryRecruitingContact?.Email];
                data?.Subscribers?.map(x => tempEmails.push(x?.Email))

                const clientTemplate = {
                    heading: "Your hiring request has been closed",
                    subheading: '',
                    description: `${data?.Creator} has closed the hiring request for a ${data?.JobTitle}.<br><br>Please reach out to your Account Manager if this is in error.`,
                    link: `${host}/hiring/requests/${placementId}`,
                    linktext: "See hiring request",
                };
                tempEmails?.map(x => sendNotificationEmail(getTemplate(clientTemplate), `Your request to hire a ${data?.JobTitle} has been closed`, x))
                const adminTemplate = {
                    heading: `Hiring request closed by ${data?.Organization?.Name}`,
                    subheading: '',
                    description: `${data?.Creator} has closed the hiring request for a ${data?.JobTitle}.<br><br>Please reach out to the client if there has been an error.`,
                    linktext: "See hiring request",
                    link: `${host}/placements/${placementId}`,
                };
                users?.userEmails?.map(x => sendNotificationEmail(getTemplate(adminTemplate), `Hiring request from ${data?.Organization?.Name} has been closed`, x))
                await CandidateMapPlacements.updateMany(
                    { placementId: placementId, candidateStatus: { $ne: 'Hired' } },
                    {
                        $set: {
                            candidateStatus: 'Rejected'
                        },
                    }
                )
            }
            const placement = await Placement.updateOne(
                { _id: placementId },
                {
                    $set: {
                        JobTitle: data?.JobTitle,
                        Status: data?.Status,
                        StartDate: data?.StartDate,
                        GoLiveDate: data?.GoLiveDate,
                        Role: data?.Role,
                        Skills: data?.Skills,
                        WorkExperience: data?.WorkExperience,
                        TimeZone: data?.TimeZone
                    },
                }
            )
            res.status(200).json({ success: true, placement })
        } else {
            res.status(200).json({ success: false, message: 'Error occcured please try again!' })
        }
    } catch (error) {
        res.status(404).json({ error: "Error While Updating the Data...!", error })
    }
}

export const UpdateHiringStatus = async (req, res) => {
    try {
        const { hiringId, status } = req.query;

        const data = req.body;
        if (hiringId) {
            if (status === 'Inactive') {
                let users = await getOrganizationAdmins_Managers(data?.placement?.Organization?._id, [INTERNAL_MANAGER.level, INTERNAL_ADMIN.level]);
                let tempEmails = [data?.placement?.PrimaryRecruitingContact?.Email];
                data?.placement?.Subscribers?.map(x => tempEmails.push(x?.Email))

                const clientTemplate = {
                    heading: "Your hiring request has been closed",
                    subheading: '',
                    description: `${data?.Creator?.FirstName} ${data?.Creator?.LastName} has closed the hiring request for a ${data?.placement?.JobTitle}.<br><br>Please reach out to your Account Manager if this is in error.`,
                    link: `${host}/hiring/requests/${hiringId}`,
                    linktext: "See hiring request",
                };
                tempEmails?.map(x => sendNotificationEmail(getTemplate(clientTemplate), `Your request to hire a ${data?.placement?.JobTitle} has been closed`, x))
                const adminTemplate = {
                    heading: `Hiring request closed by ${data?.placement?.Organization?.Name}`,
                    subheading: '',
                    description: `${data?.Creator?.FirstName} ${data?.Creator?.LastName} has closed the hiring request for a ${data?.placement?.JobTitle}.<br><br>Please reach out to the client if there has been an error.`,
                    linktext: "See hiring request",
                    link: `${host}/placements/${hiringId}`,
                };
                users?.userEmails?.map(x => sendNotificationEmail(getTemplate(adminTemplate), `Hiring request from ${data?.placement?.Organization?.Name} has been closed`, x))
                await CandidateMapPlacements.updateMany(
                    { placementId: hiringId, candidateStatus: { $ne: 'Hired' } },
                    {
                        $set: {
                            candidateStatus: 'Rejected'
                        },
                    }
                )
            }
            const hiring = await Placement.updateOne(
                { _id: hiringId },
                {
                    $set: {
                        Status: status
                    },
                }
            )
            res.status(200).json({ success: true, hiring })
        } else {
            res.status(200).json({ success: false, message: 'Error occcured please try again!' })
        }
    } catch (error) {
        res.status(404).json({ error: "Error While Updating the Data...!", error })
    }
}

export const addCandidate = async (req, res) => {
    try {
        const { placementId } = req.query;
        const formData = req.body;
        if (placementId && formData) {
            CandidateMapPlacements.create({
                placementId: placementId,
                candidateId: mongoose.Types.ObjectId(formData?.CandidateID),
                candidateStatus: 'New'
            }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    let temp = [...formData?.prevIds, data?._id]
                    await Placement.updateOne(
                        { _id: placementId },
                        {
                            $set: {
                                Candidates: temp?.map(x => mongoose.Types.ObjectId(x)),
                            },
                        }
                    )
                    return res.status(200).json({ success: true, data });
                }
            })

        } else {
            res.status(200).json({ success: false, message: 'Error occcured please try again!' })
        }
    } catch (error) {
        res.status(404).json({ error: `Error: ${error}` })
    }
}

export const GetAllPlacements = async (req, res) => {
    try {
        const placements = await Placement.find().populate('Organization').sort({ createdAt: 'desc' });
        if (!placements) return res.status(200).json({ success: false, message: 'No Placement Found!' })
        return res.status(200).json({ success: true, list: placements });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const GetAllCandidates = async (req, res) => {
    try {
        const { placementOrg } = req.query;
        const placements = await Placement.find({ Organization: mongoose.Types.ObjectId(placementOrg) })
            .populate(['Organization',
                {
                    path: 'Contracts',
                    populate: { path: 'User' },
                }, {
                    path: 'Candidates',
                    populate: { path: 'candidateId' },
                }
            ]).sort({ createdAt: 'desc' });
        if (!placements) return res.status(200).json({ success: false, message: 'No Placement Found!' })
        let candidates = [];
        placements?.map(x => candidates.push(...x?.Candidates));
        let contracts = [];
        placements?.map(x => contracts.push(...x?.Contracts))
        return res.status(200).json({ success: true, list: placements, candidates, contracts });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const updateCandidateStatus = async (req, res) => {
    try {
        const { candidatePlacementId } = req.query;
        const data = req.body;
        if (candidatePlacementId) {
            if (data?.Status === 'Rejected' && data?.placement) {
                let users = await getOrganizationAdmins_Managers(data?.placement?.Organization?._id, [INTERNAL_MANAGER.level, INTERNAL_ADMIN.level]);
                const adminTemplate = {
                    heading: `${data?.placement?.Organization?.Name} has rejected ${data?.Candidate}`,
                    subheading: '',
                    description: `${data?.Candidate} has been rejected for the ${data?.placement?.JobTitle} position.`,
                    linktext: "See placement",
                    link: `${host}/placements/${data?.placement?._id}`,
                };
                users?.userEmails?.map(x => sendNotificationEmail(getTemplate(adminTemplate), `${data?.placement?.Organization?.Name} has rejected ${data?.Candidate}`, x))
            }
            CandidateMapPlacements.updateOne(
                { _id: candidatePlacementId },
                {
                    $set: {
                        candidateStatus: data?.Status
                    },
                }, async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        return res.status(200).json({ success: true, data });
                    }
                })

        } else {
            res.status(200).json({ success: false, message: 'Error occcured please try again!' })
        }
    } catch (error) {
        res.status(404).json({ error: "Error While Updating the Data...!", error })
    }
}

export const deletePlacement = async (req, res) => {
    try {
        const { placementId } = req.query;
        if (placementId) {
            await Placement.findByIdAndDelete(placementId);
            const response = await CandidateMapPlacements.deleteOne({ placementId });
            return res.status(200).json({ success: true, response });
        } else {
            res.status(404).json({ success: false, error: "Error occured please try again!" })
        }
    } catch (error) {
        res.status(404).json({ error: "Error While Deleting the Placement...!" })
    }
}

export const removeCandidate = async (req, res) => {
    try {
        const { placementId } = req.query;
        const formData = req.body;
        if (placementId && formData) {
            const candidate = await CandidateMapPlacements.findByIdAndDelete(mongoose.Types.ObjectId(formData?.Candidate))

            const placement = await Placement.updateOne(
                { _id: placementId },
                {
                    $set: {
                        Candidates: formData?.prevIds?.map(x => mongoose.Types.ObjectId(x)),
                    },
                }
            )
            res.status(200).json({ success: true, candidate, placement });
        } else {
            res.status(200).json({ success: false, message: 'Error occcured please try again!' })
        }
    } catch (error) {
        res.status(404).json({ error: `Error: ${error}` })
    }
}

export const GetCandidateById = async (req, res) => {
    try {
        const { candidatePlacementId } = req.query;
        const candidate = await CandidateMapPlacements.findOne({ _id: candidatePlacementId }).populate({ path: "candidateId", populate: 'Documents' });
        if (!candidate) return res.status(200).json({ success: false, message: 'No Placement Found!' })
        return res.status(200).json({ success: true, candidate });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const GetPlacementsByCandidateId = async (req, res) => {
    try {
        const { candidateId, accessLevel } = req.query;
        let list;
        if (accessLevel == INTERNAL_MANAGER.level) {
            list = await Placement.find({ CreatedBy: candidateId }).populate('Organization');
        } else {
            list = await CandidateMapPlacements.find({ candidateId: mongoose.Types.ObjectId(candidateId) }).populate(['candidateId', 'placementId', { path: 'placementId', populate: 'Organization' }]);
        }
        if (!list) return res.status(200).json({ success: false, message: 'No Placement Found!' })
        return res.status(200).json({ success: true, list });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}