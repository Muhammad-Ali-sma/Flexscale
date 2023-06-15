import connectToMongo from "../../../database/server";
import { VerifyToken } from "../../../database/Controllers/AuthController";
import { CreatePaymentMethod, CreatePlaidLink, DeletePaymentMethod, GetAllPayments, GetCustomerPayments, GetPaymentMethodsByCustomerId, UpdatePaymentMethod } from "../../../database/Controllers/PaymentController";

export default async function handler(req, res) {
    connectToMongo().catch(() => res.status(405).json({ Error: "DB Connection Failed" }));

    const { method, query, headers } = req;
    if (headers.authorization) {
        let token = headers.authorization.split(" ")
        const isVerified = await VerifyToken(token[1]);
        if (isVerified.success) {
            switch (method) {
                case "GET":
                    if (query?.stripeId) {
                        await GetCustomerPayments(req, res);
                    } else if (query?.customerId) {
                        await GetPaymentMethodsByCustomerId(req, res);
                    }else if (query?.plaidLink) {
                        await CreatePlaidLink(req, res);
                    } else {
                        await GetAllPayments(req, res);
                    }
                    break;
                case "POST":
                    await CreatePaymentMethod(req, res);
                    break;
                case "DELETE":
                    await DeletePaymentMethod(req, res);
                    break;
                case "PUT":
                    await UpdatePaymentMethod(req, res);
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