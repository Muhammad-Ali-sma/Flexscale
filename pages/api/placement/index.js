import connectToMongo from "../../../database/server";
import { VerifyToken } from "../../../database/Controllers/AuthController";
import { addCandidate, CreatePlacement, deletePlacement, GetAllCandidates, GetAllPlacements, GetPlacementById, removeCandidate, updateCandidateStatus, updatePlacement, GetCandidateById, UpdateHiringStatus, GetPlacementsByCandidateId, GetPlacementsByOrgId } from "../../../database/Controllers/PlacementController";

export default async function handler(req, res) {
    connectToMongo().catch(() => res.status(405).json({ Error: "DB Connection Failed" }));

    const { method, query, headers, body } = req;

    if (headers.authorization) {
        let token = headers.authorization.split(" ")
        const isVerified = await VerifyToken(token[1]);
        if (isVerified.success) {
            switch (method) {
                case "GET":
                    if (query?.Id) {
                        await GetPlacementById(req, res);
                    } else if (query?.candidatePlacementId) {
                        await GetCandidateById(req, res);
                    } else if (query?.placementOrg) {
                        await GetAllCandidates(req, res);
                    } else if (query?.candidateId) {
                        await GetPlacementsByCandidateId(req, res);
                    } else if (query?.orgId) {
                        await GetPlacementsByOrgId(req, res);
                    } else {
                        await GetAllPlacements(req, res);
                    }
                    break;
                case "POST":
                    await CreatePlacement(req, res);
                    break;
                case "DELETE":
                    await deletePlacement(req, res);
                    break;
                case "PUT":
                    if (body?.CandidateID) {
                        await addCandidate(req, res);
                    } else if (query?.hiringId) {
                        await UpdateHiringStatus(req, res);
                    } else if (query?.candidatePlacementId) {
                        await updateCandidateStatus(req, res);
                    } else if (body?.Candidate) {
                        await removeCandidate(req, res);
                    } else {
                        await updatePlacement(req, res);
                    }
                    break;
                default:
                    res.setHeader("Allow", ['GET', 'POST', 'PUT', 'DELETE'])
                    res.status(403).end('Method Not Supported');
                    break;
            }
        } else {
            res.status(403).json({ token: false, message: isVerified?.message });
        }
    } else {
        res.status(403).json({ token: false, message: 'Token Expired' });
    }
}