import moment from "moment";
import { stripeObj } from "../server";
import { host, url } from "../../utils";
import Payment from "../Models/PaymentSchema";
import { plaidClient } from "../../utils/globalFunctions";


export const CreatePaymentMethod = async (req, res) => {
    try {
        const data = req.body;

        if (data?.CustomerId) {
            if (data?.CardNumber && data?.CardNumber !== 'undefined') {
                const createMethod = await stripeObj().paymentMethods.create({
                    type: 'card',
                    card: {
                        number: data?.CardNumber,
                        exp_month: moment(data?.ExpiryDate).format('MM'),
                        exp_year: moment(data?.ExpiryDate).format('YY'),
                        cvc: data?.CardCVC,
                    },
                    billing_details: {
                        email: data?.user?.Email,
                        name: data?.CardholderName,
                        phone: data?.user?.Phone
                    },
                    metadata: {
                        paymentMethod: 'Send Invoice'
                    }
                });
                await stripeObj().paymentMethods.attach(
                    createMethod.id,
                    { customer: data?.CustomerId },
                    (err, source) => {
                        if (err) return res.status(400).json({ success: false, message: `${err}` });
                        return res.status(200).json({ success: true, source });
                    }
                );
            } else {
                const tokenResponse = await plaidClient().itemPublicTokenExchange({ public_token: data?.public_token });
                const stripeTokenResponse = await plaidClient().processorStripeBankAccountTokenCreate({
                    access_token: tokenResponse.data.access_token,
                    account_id: data?.account_id,
                });
                await stripeObj().customers.createSource(
                    data?.CustomerId,
                    { source: stripeTokenResponse.data.stripe_bank_account_token },
                    (err, source) => {
                        if (err) return res.status(400).json({ success: false, message: `${err}` });
                        return res.status(200).json({ success: true, source });
                    }
                );
            }
        } else {
            return res.status(404).json({ success: false, message: `Please create customer first!` })
        }
    } catch (e) {
        res.status(404).json({ success: false, message: `${e}` })
    }
}

export const CreatePlaidLink = async (req, res) => {
    try {
        plaidClient().linkTokenCreate({
            user: {
                client_user_id: `test-user-id`,
            },
            client_name: 'Flexscale',
            products: ['auth'],
            country_codes: ['US'],
            language: 'en',
            webhook: `${host}${url}webhook`,
        }).then(response => res.status(200).json(response?.data?.link_token))
            .catch(err => res.status(404).json({ success: false, message: err.toString() }))

    } catch (e) {
        res.status(404).json({ success: false, message: e.toString() })
    }
}

export const GetPaymentMethodsByCustomerId = async (req, res) => {
    try {
        const { customerId } = req.query;
        const customer = await stripeObj().customers.retrieve(customerId);
        const paymentMethods = await stripeObj().customers.listPaymentMethods(customerId);
        return res.status(200).json({ success: true, list: paymentMethods.data, customer });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const GetCustomerPayments = async (req, res) => {
    try {
        const { stripeId } = req.query;
        const list = await Payment.find({ 'payment.customer': stripeId });
        return res.status(200).json({ success: true, list });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const GetAllPayments = async (req, res) => {
    try {
        const list = [] = await Payment.find();
        return res.status(200).json({ success: true, list });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const DeletePaymentMethod = async (req, res) => {
    try {
        const { paymentId, customerId } = req.query;

        if (paymentId.startsWith('pm_')) {
            const response = await stripeObj().paymentMethods.detach(paymentId);
            return res.status(200).json({ success: true, response });
        }
        await stripeObj().customers.deleteSource(
            customerId,
            paymentId,
            (err, confirmation) => {
                if (err) return res.status(400).json({ success: false, err });
                return res.status(200).json({ success: true, confirmation });
            }
        );
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}

export const UpdatePaymentMethod = async (req, res) => {
    try {
        const { paymentId, customerId } = req.query;
        const response = await stripeObj().customers.update(
            customerId,
            { invoice_settings: { default_payment_method: paymentId !== 'null' ? paymentId : null } }
        );
        return res.status(200).json({ success: true, response });

    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` })
    }
}