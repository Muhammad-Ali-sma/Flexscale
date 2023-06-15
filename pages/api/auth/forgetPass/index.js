import { SendMagicLink } from "../../../../database/Controllers/AuthController";
import connectToMongo from "../../../../database/server";

export default async function handler(req, res) {
    connectToMongo().catch(() => res.status(405).json({ Error: "DB Connection Failed" }));

    const { method, body } = req;

    switch (method) {
        case "POST":
            await SendMagicLink(req, res, 'forget-password');
            break;
        default:
            res.setHeader("Allow", ['POST'])
            res.status(403).end('Method Not Supported');
            break;
    }

}