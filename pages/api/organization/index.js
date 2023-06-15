import { RegisterOrganization, UpdateOrganization, getAllOrganizations, DeleteOrganization, getStripeCustomer } from "../../../database/Controllers/OrganizationController";
import { VerifyToken } from "../../../database/Controllers/AuthController";
import connectToMongo from "../../../database/server";

export default async function handler(req, res) {
    connectToMongo().catch(() => res.status(405).json({ Error: "DB Connection Failed" }));

    const { method, headers, query } = req;

    if (headers.authorization) {
        let token = headers.authorization.split(" ")
        const isVerified = await VerifyToken(token[1])
        if (isVerified?.success) {
            switch (method) {
                case "GET":
                    if (query?.stripeId) {
                        await getStripeCustomer(req, res);
                    } else {
                        await getAllOrganizations(req, res);
                    }
                    break;
                case "POST":
                    await RegisterOrganization(req, res);
                    break;
                case "DELETE":
                    await DeleteOrganization(req, res);
                    break;
                case "PUT":
                    await UpdateOrganization(req, res);
                    break;
                default:
                    res.setHeader("Allow", ['GET', 'POST', 'PUT', 'DELETE'])
                    res.status(403).end('Method Not Supported');
                    break;
            }
        } else {
            if (method === 'POST') {
                await RegisterOrganization(req, res);
            } else {
                res.status(403).json({ token: false, message: isVerified?.message });
            }
        }
    } else {
        if (method === 'POST') {
            await RegisterOrganization(req, res);
        } else {
            res.status(403).json({ token: false, message: 'Token Expired' });
        }
    }
}