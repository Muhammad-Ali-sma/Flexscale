import { VerifyLoginLink, VerifyToken } from "../../../../database/Controllers/AuthController";
import connectToMongo from "../../../../database/server";

export default async function handler(req, res) {
    connectToMongo().catch(() => res.status(405).json({ Error: "DB Connection Failed" }));

    const { method, body } = req;

    switch (method) {
        case "GET":
            if (req?.query?.token) {
                let response = await VerifyToken(req?.query?.token);
                res.json(response);
            } else {
                await VerifyLoginLink(req, res);
            }
            break;
        default:
            res.setHeader("Allow", ['GET'])
            res.status(403).end('Method Not Supported');
            break;
    }

}