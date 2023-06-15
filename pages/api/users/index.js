import { RegisterUser, GetUsers, updateUser, deleteUser, GetTeamMembers, UploadProfileImage } from "../../../database/Controllers/UserController";
import { VerifyToken } from "../../../database/Controllers/AuthController";
import connectToMongo from "../../../database/server";
import { UploadDoc } from "../../../database/Controllers/DocumentController";

export default async function handler(req, res) {
    connectToMongo().catch(() => res.status(405).json({ Error: "DB Connection Failed" }));

    const { method, headers, query } = req;

    if (headers.authorization) {
        let token = headers?.authorization.split(" ")
        const isVerified = await VerifyToken(token[1])
        if (isVerified.success) {
            switch (method) {
                case "GET":
                    if (query?.OrganizationId) {
                        await GetTeamMembers(req, res);
                    } else {
                        await GetUsers(req, res);
                    }
                    break;
                case "POST":
                    if (req?.body?.FileName) {
                        await UploadDoc(req, res);
                    } else {
                        await RegisterUser(req, res);
                    }
                    break;
                case "DELETE":
                    await deleteUser(req, res);
                    break;
                case "PUT":
                    if (req.body.image) {
                        await UploadProfileImage(req, res);
                    } else {
                        await updateUser(req, res);
                    }
                    break;
                default:
                    res.setHeader("Allow", ['GET', 'POST', 'PUT', 'DELETE'])
                    res.status(403).end('Method Not Supported');
                    break;
            }
        } else {
            if (method == "POST") {
                await RegisterUser(req, res);
            } else {
                res.status(403).json({ token: false, message: isVerified?.message });
            }
        }
    } else {
        if (method == "POST") {
            RegisterUser(req, res);
        } else {
            res.status(403).json({ token: false, message: 'Token Expired' });
        }
    }
}