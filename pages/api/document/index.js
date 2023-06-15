import { UploadDoc, DeleteDoc, EditDoc } from "../../../database/Controllers/DocumentController";
import { VerifyToken } from "../../../database/Controllers/AuthController";
import connectToMongo from "../../../database/server";

export default async function handler(req, res) {
    connectToMongo().catch(() => res.status(405).json({ Error: "DB Connection Failed" }));

    const { method, headers } = req;

    if (headers.authorization) {
        let token = headers.authorization.split(" ")
        const isVerified = await VerifyToken(token[1]);
        if (isVerified.success) {
            switch (method) {
                case "GET":
                    break;
                case "POST":
                    await UploadDoc(req, res);
                    break;
                case "DELETE":
                    await DeleteDoc(req, res);
                    break;
                case "PUT":
                    await EditDoc(req, res);
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