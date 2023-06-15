import { ClearDatabase, createLog, DeleteErrorLogs, GetErrorLogs } from "../../../../database/Controllers/AuthController";
import connectToMongo from "../../../../database/server";

export default async function handler(req, res) {
    connectToMongo().catch(() => res.status(405).json({ Error: "DB Connection Failed" }));

    const { method, body } = req;

    switch (method) {
        case "POST":
            if (body?.code && body?.message) {
                await createLog(req, res);
            } else {
                res.status(200).json({ success: true });
            }
            break;
        case "DELETE":
            await DeleteErrorLogs(req, res);
            break;
        case "GET":
            if (req.query.clearAll == true) {
                await ClearDatabase(req, res);
            } else {
                await GetErrorLogs(req, res);
            }
            break;
        default:
            res.setHeader("Allow", ['GET', 'POST', 'PUT', 'DELETE'])
            res.status(403).end('Method Not Supported');
            break;
    }

}