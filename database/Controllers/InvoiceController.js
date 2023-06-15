import moment from "moment";
import mongoose from "mongoose";
import Invoice from "../Models/InvoiceSchema";
import { CLIENT_BILLING_ADMIN, CLIENT_SUPER_ADMIN, host } from "../../utils";
import { getTemplate } from "../../utils/script";
import { formatNum } from "../../utils/globalFunctions";
import { sendNotificationEmail, stripeObj } from "../server";
import { getOrganizationAdmins_Managers } from "./UserController";


export const CreateInvoice = async (req, res) => {
    try {
        const data = req.body;
        if (data?.Organization?.StripeId) {
            let users = await getOrganizationAdmins_Managers(data?.Organization?._id, [CLIENT_SUPER_ADMIN.level, CLIENT_BILLING_ADMIN.level]);
            const customer = await stripeObj().customers.retrieve(data?.Organization?.StripeId);
            const invoiceArgs = {
                pending_invoice_items_behavior: 'exclude',
                customer: data?.Organization?.StripeId,
                description: data?.Description ?? '',
                metadata: { userEmail: data?.BilledTo?.Email },
            };
            if (!customer?.invoice_settings?.default_payment_method) {
                invoiceArgs.due_date = new Date(data?.DueDate);
                invoiceArgs.collection_method = 'send_invoice';
            }
            stripeObj().invoices.create(invoiceArgs).then(invoice => {
                data?.InvoiceItems?.map((x, i) => {
                    stripeObj().invoiceItems.create({
                        customer: data?.Organization?.StripeId,
                        unit_amount: x.unitPrice * 100,
                        quantity: x.quantity,
                        description: x.name,
                        invoice: invoice.id,
                        currency: 'usd'
                    })
                })
                stripeObj().invoices.retrieve(invoice.id).then(updatedInvoice => {
                    stripeObj().invoices.finalizeInvoice(updatedInvoice.id).then(finalizedInvoice => {
                        if (customer?.invoice_settings?.default_payment_method && finalizedInvoice?.lines?.data?.length > 0) {
                            if (customer?.invoice_settings?.default_payment_method?.includes('ba_')) {
                                stripeObj().invoices.pay(finalizedInvoice.id, { source: customer?.invoice_settings?.default_payment_method })
                            } else {
                                stripeObj().invoices.pay(finalizedInvoice.id, { payment_method: customer?.invoice_settings?.default_payment_method })
                            }
                        }
                        let emailData = {
                            InvoiceNumber: finalizedInvoice?.number,
                            InvoiceId: finalizedInvoice.id,
                            ...data
                        }
                        Invoice.create({
                            invoiceId: finalizedInvoice.id,
                            Organization: data?.Organization ? mongoose.Types.ObjectId(data?.Organization?._id) : null,
                            BilledTo: data?.BilledTo ? mongoose.Types.ObjectId(data?.BilledTo?._id) : null,
                            Timesheets: data?.Timesheets ? data?.Timesheets?.map(x => mongoose.Types.ObjectId(x?._id)) : null,
                        }, async (err, data) => {
                            if (err) return res.status(404).json({ success: false, message: `${err}` });
                            if (data) {
                                await InvoiceEmail(emailData, users, customer);
                                return res.status(200).json({ success: true, data });
                            }
                        });
                    }).catch(e => {
                        return res.status(404).json({ success: false, message: `${e}` })
                    });
                }).catch(e => {
                    return res.status(404).json({ success: false, message: `${e}` })
                });
            }).catch(e => {
                return res.status(404).json({ success: false, message: `${e}` })
            });
        } else {
            return res.status(404).json({ success: false, message: `Please create customer first!` })
        }
    } catch (e) {
        res.status(404).json({ success: false, message: `${e}` })
    }
}

export const GetAllInvoices = async (req, res) => {
    try {
        const dbList = await Invoice.find().populate('Organization').sort({ createdAt: 'desc' });
        if (!dbList) return res.status(200).json({ success: false, message: 'Invoices Not Found!' });
        if(dbList.length > 0){
            const stripeInvoiceList = await stripeObj().invoices.list({ limit: dbList?.length });
            const list = [];
            dbList?.filter(x => {
                if (stripeInvoiceList?.data?.filter(y => y.id === x?.invoiceId)?.length > 0) {
                    list.push(Object.assign(stripeInvoiceList?.data?.filter(y => y.id === x?.invoiceId)[0], x))
                }
            });
            return res.status(200).json({ success: true, list, dbList, stripeInvoiceList })
        } else {
            return res.status(200).json({ success: true, list: [], dbList: [], stripeInvoiceList: [] })
        }
        
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` });
    }
}

export const GetInvoiceById = async (req, res) => {
    try {
        const { id } = req.query;
        const invoice = await Invoice.findOne({ invoiceId: id }).populate(['Organization', 'BilledTo', {
            path: 'Timesheets',
            populate: { path: 'User' }
        }])

        if (!invoice) return res.status(200).json({ message: 'Invoice Not Found' })

        const stripeInvoice = await stripeObj().invoices.retrieve(id);
        let charge = null;
        if (stripeInvoice?.charge) {
            charge = await stripeObj().charges.retrieve(stripeInvoice?.charge);
        }
        
        return res.status(200).json({ success: true, invoice, stripeInvoice, charge });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` });
    }
}

export const GetInvoicesByOrgId = async (req, res) => {
    try {
        const { orgId } = req.query;
        const dbList = await Invoice.find({ Organization: mongoose.Types.ObjectId(orgId) }).populate(['Organization', 'Timesheets', 'BilledTo']).sort({ createdAt: 'desc' });
        if (!dbList) return res.status(200).json({ message: 'Data Not Found' });
        var list = [];
        if(dbList.length > 0){
            const stripeInvoiceList = await stripeObj().invoices.list({ limit: dbList?.length });
            dbList?.filter(x => {
                if (stripeInvoiceList?.data?.filter(y => y.id === x?.invoiceId)?.length > 0) {
                    list.push(Object.assign(stripeInvoiceList?.data?.filter(y => y.id === x?.invoiceId)[0], x))
                }
            });
        }
        return res.status(200).json({ success: true, list });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` });
    }
}

export const UpdateInvoiceStatus = async (req, res) => {
    try {
        const { invoiceId } = req.query;
        const data = req.body;
        if (invoiceId) {
            let response = null;
            if (data?.Status === 'Paid from outside') {
                response = await stripeObj().invoices.pay(
                    invoiceId,
                    { paid_out_of_band: true }
                );
            } else {
                response = await stripeObj().invoices.voidInvoice(invoiceId);
            }
            return res.status(200).json({ success: true, response });
        } else {
            res.status(404).json({ success: false, error: "Error occured please try again!" })
        }
    } catch (error) {
        res.status(404).json({ error: `Error: ${error}` })
    }
}

export const SendEmailReminder = async (req, res) => {
    try {
        const data = req.body;
        let users = await getOrganizationAdmins_Managers(data?.Organization?._id, [CLIENT_BILLING_ADMIN.level]);
        users?.userEmails?.push(data?.Organization?.BillingContactEmail)
        const response = await InvoiceEmail(data, users);
        return res.status(200).json({ success: true, response });
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` });
    }
}

const InvoiceEmail = async (data, users, customer) => {
    //Email Pay Invoice Button TODO
    let template = null;
    if (customer?.invoice_settings?.default_payment_method) {
        template = {
            heading: 'A new invoice is available',
            subheading: '',
            description: `Your invoice #${data?.InvoiceNumber} in the amount of USD $${formatNum(data?.Amount)} is now available.<br><br> You currently have auto pay enabled, so we will process your payment automatically.`,
            linktext: "See detail",
            link: `${host}/billing/invoice/${data?.InvoiceId}`,
        };
    } else {
        template = {
            heading: 'A new invoice is available',
            subheading: '',
            description: `Your invoice #${data?.InvoiceNumber} in the amount of USD $${formatNum(data?.Amount)} is now available. Payment is due on ${moment(data?.DueDate, 'MMMM DD, YYYY').format('MMMM DD, YYYY')}.<br><br> You can see further detail of this invoice or pay it by clicking the buttons below.`,
            linktext: "See detail",
            link: `${host}/billing/invoice/${data?.InvoiceId}`,
        };
    }
    users?.userEmails?.map(x => sendNotificationEmail(getTemplate(template), `New Invoice from ${data?.Organization?.Name} #${data?.InvoiceNumber}`, x));
}