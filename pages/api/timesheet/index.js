import connectToMongo from "../../../database/server";
import { VerifyToken } from "../../../database/Controllers/AuthController";
import { CreateTimesheet, DeleteTimesheet, GetAllTimesheets, GetTimesheetById, UpdateTimesheet, GetTimesheetByUserId } from "../../../database/Controllers/TimesheetController";

export default async function handler(req, res) {
    connectToMongo().catch(() => res.status(405).json({ Error: "DB Connection Failed" }));

    const { method, query, headers } = req;
    if (headers.authorization) {
        let token = headers.authorization.split(" ")
        const isVerified = await VerifyToken(token[1]);
        if (isVerified.success) {
            switch (method) {
                case "GET":
                    if (query?.id) {
                        await GetTimesheetById(req, res);
                    } else if (query?.userId) {
                        await GetTimesheetByUserId(req, res);
                    } else {
                        await GetAllTimesheets(req, res);
                    }
                    break;
                case "POST":
                    await CreateTimesheet(req, res);
                    break;
                case "DELETE":
                    await DeleteTimesheet(req, res);
                    break;
                case "PUT":
                    await UpdateTimesheet(req, res);
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