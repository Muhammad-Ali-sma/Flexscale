import { CreateContract, UpdateContract, GetAllContracts, GetContractById, GetContractByOrgId, UpdateContractStatus, GetContractByUserId } from "../../../database/Controllers/ContractController";
import { VerifyToken } from "../../../database/Controllers/AuthController";
import connectToMongo from "../../../database/server";

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
                        await GetContractById(req, res);
                    } else if (query?.orgId) {
                        await GetContractByOrgId(req, res);
                    } else if (query?.userId) {
                        GetContractByUserId(req, res)
                    } else {
                        await GetAllContracts(req, res);
                    }
                    break;
                case "POST":
                    await CreateContract(req, res);
                    break;
                case "DELETE":
                    break;
                case "PUT":
                    if (query?.contractId && (body?.ContractStatus || query?.userId)) {
                        await UpdateContractStatus(req, res);
                    } else {
                        await UpdateContract(req, res);
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