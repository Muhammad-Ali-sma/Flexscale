import { sendNotificationEmail, stripeObj } from "../../../database/server";
import Payment from "../../../database/Models/PaymentSchema";
import { getTemplate } from "../../../utils/script";
import { host } from "../../../utils";

export default async function handler(request, response) {
    const { body } = request;

    switch (body.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = body.data.object;
            let stripeInvoice = null;
            if (paymentIntent?.invoice) {
                stripeInvoice = await stripeObj().invoices.retrieve(paymentIntent?.invoice);
            }
            let temp = {
                ...paymentIntent,
                metadata: { orgName: stripeInvoice?.customer_name }
            }
            Payment.create({ payment: temp });
            const adminTemplate = {
                heading: `Thank you for your payment`,
                subheading: `We have received your payment for invoice #${stripeInvoice?.number}.`,
                description: `You can see further detail on this payment by clicking the button below.`,
                linktext: "See profile",
                link: `${host}/payments/${paymentIntent?.invoice}`,
            };
            sendNotificationEmail(getTemplate(adminTemplate), `Payment received successfully`, stripeInvoice?.customer_email);
            const clientTemplate = {
                ...adminTemplate,
                link: `${host}/billing/payment/${paymentIntent?.invoice}`,
            };
            sendNotificationEmail(getTemplate(clientTemplate), `Payment received successfully`, stripeInvoice?.metadata?.userEmail);
            break;
        default:
            response.status(403).end('Method Not Supported');
            break;
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
}