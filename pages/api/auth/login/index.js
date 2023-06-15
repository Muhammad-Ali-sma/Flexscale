import { SendMagicLink, LoginUser, createLog } from "../../../../database/Controllers/AuthController";
import connectToMongo from "../../../../database/server";

export default async function handler(req, res) {
    connectToMongo().catch(() => res.status(405).json({ Error: "DB Connection Failed" }));

    const { method, body } = req;

    switch (method) {
        case "POST":
            if (body?.code && body?.message) {
                await createLog(req, res);
            } else if (body?.Password) {
                await LoginUser(req, res);
            } else {
                await SendMagicLink(req, res, 'login');
            }
            break;
        case "DELETE":
            res.status(200);
            break;
        case "PUT":
            res.status(200);
            break;
        default:
            res.setHeader("Allow", ['GET', 'POST', 'PUT', 'DELETE'])
            res.status(403).end('Method Not Supported');
            break;
    }

}