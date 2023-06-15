import { CreateInvoice, GetAllInvoices, GetInvoiceById, SendEmailReminder, UpdateInvoiceStatus, GetInvoicesByOrgId } from "../../../database/Controllers/InvoiceController";
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
                    if (query?.id) {
                        await GetInvoiceById(req, res);
                    } else if (query?.orgId) {
                        await GetInvoicesByOrgId(req, res);
                    } else {
                        await GetAllInvoices(req, res);
                    }
                    break;
                case "POST":
                    await CreateInvoice(req, res);
                    break;
                case "DELETE":
                    break;
                case "PUT":
                    if (body?.InvoiceNumber) {
                        await SendEmailReminder(req, res);
                    } else {
                        await UpdateInvoiceStatus(req, res);
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