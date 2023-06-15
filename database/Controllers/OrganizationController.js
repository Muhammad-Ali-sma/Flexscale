import mongoose from "mongoose";
import { stripeObj } from "../server";
import Organization from "../Models/OrganizationSchema";

export const getStripeCustomer = async (req, res) => {
    try {
        const { stripeId } = req.query;
        const customer = await stripeObj().customers.retrieve( stripeId );
        if (!customer) return res.status(200).json({ success: false, message: 'Customer Not Found!' });
        return res.status(200).json({ success: true, customer })
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` });
    }
}

export const getAllOrganizations = async (req, res) => {
    try {
        const list = await Organization.find();
        if (!list) return res.status(200).json({ success: false, message: 'Organizations Not Found!' });
        return res.status(200).json({ success: true, list })
    } catch (e) {
        res.status(404).json({ success: false, message: `Error: ${e}` });
    }
}

export const RegisterOrganization = async (req, res) => {
    try {

        const organizationData = req.body;
        let stripeCustomer = null;
        if(organizationData?.StripeId && organizationData?.StripeId !== ""){
            stripeCustomer = {
                id: organizationData?.StripeId
            }
        } else {
            stripeCustomer = await stripeObj().customers.create({
                email: organizationData?.BillingContactEmail,
                name: organizationData?.Name,
                phone: organizationData?.BillingContactPhone,
                address: {
                    city: organizationData?.BillingCity,
                    country: organizationData?.BillingCountry,
                    line1: organizationData?.BillingAddress,
                    line2: organizationData?.BillingAddress2,
                    postal_code: organizationData?.BillingPostalCode,
                    state: organizationData?.BillingState,
                },
            });
        }
        
        let orgData = {
            Name: organizationData?.Name,
            OrganizationType: organizationData?.OrganizationType,
            CreatedBy: organizationData?.CreatedBy ? mongoose.Types.ObjectId(organizationData?.CreatedBy) : null,
            BillingContactEmail: organizationData?.BillingContactEmail,
            BillingContactPhone: organizationData?.BillingContactPhone,
            BillingContactFirstName: organizationData?.BillingContactFirstName,
            BillingContactLastName: organizationData?.BillingContactLastName,
            BillingAddress: organizationData?.BillingAddress,
            BillingAddress2: organizationData?.BillingAddress2,
            BillingCity: organizationData?.BillingCity,
            BillingState: organizationData?.BillingState,
            BillingPostalCode: organizationData?.BillingPostalCode,
            BillingCountry: organizationData?.BillingCountry,
            Address1: organizationData?.Address1,
            Address2: organizationData?.Address2,
            City: organizationData?.City,
            State: organizationData?.State,
            PostalCode: organizationData?.PostalCode,
            Country: organizationData?.Country,
            StripeId: stripeCustomer?.id
        }
        Organization.create(orgData, async (err, data) => {
            await stripeObj().customers.update(
                stripeCustomer?.id,
                { metadata: { companyId: String(data?._id) } }
            );
            if (data) return res.status(200).json({ success: true, data });
            if (err) throw err;
        })
    } catch (e) {
        return res.send({ success: false, message: `Error: ${e}` });
    }
}

export const UpdateOrganization = async (req, res) => {
    try {
        const { orgId } = req.query;
        const organizationData = req.body;

        if (orgId && organizationData) {
            const org = await Organization.findOneAndUpdate(
                { _id: orgId },
                {
                    $set: {
                        Name: organizationData?.Name,
                        OrganizationType: organizationData?.OrganizationType,
                        BillingContactEmail: organizationData?.BillingContactEmail,
                        BillingContactPhone: organizationData?.BillingContactPhone,
                        BillingContactFirstName: organizationData?.BillingContactFirstName,
                        BillingContactLastName: organizationData?.BillingContactLastName,
                        BillingAddress: organizationData?.BillingAddress,
                        BillingAddress2: organizationData?.BillingAddress2,
                        BillingCity: organizationData?.BillingCity,
                        BillingState: organizationData?.BillingState,
                        BillingPostalCode: organizationData?.BillingPostalCode,
                        BillingCountry: organizationData?.BillingCountry,
                        Address1: organizationData?.Address1,
                        Address2: organizationData?.Address2,
                        City: organizationData?.City,
                        State: organizationData?.State,
                        PostalCode: organizationData?.PostalCode,
                        Country: organizationData?.Country,
                    },
                }
                , { returnDocument: 'after' }
            )
            stripeObj().customers.update(
                org?.StripeId,
                { metadata: { companyId: String(org?._id) } }
            ).then(response => res.status(200).json({ success: true, org }))
                .catch(async err => {
                    if (`${err}`.includes("Error: No such customer:")) {
                        const stripeCustomer = await stripeObj().customers.create({
                            email: organizationData?.BillingContactEmail,
                            name: organizationData?.Name,
                            phone: organizationData?.BillingContactPhone,
                            address: {
                                city: organizationData?.BillingCity,
                                country: organizationData?.BillingCountry,
                                line1: organizationData?.BillingAddress,
                                line2: organizationData?.BillingAddress2,
                                postal_code: organizationData?.BillingPostalCode,
                                state: organizationData?.BillingState,
                            },
                        });
                        await stripeObj().customers.update(
                            stripeCustomer?.id,
                            { metadata: { companyId: String(org?._id) } }
                        );
                        await Organization.findOneAndUpdate(
                            { _id: orgId },
                            {
                                $set: {
                                    StripeId: stripeCustomer?.id
                                }
                            }
                        )
                        res.status(200).json({ success: true, org });
                    }
                })
        } else {
            res.status(200).json({ success: false, message: 'Error occured please try again!' })
        }
    } catch (e) {
        return res.send({ success: false, message: `${e}` });
    }
}

export const DeleteOrganization = async (req, res) => {
    const { id } = req.query;
    try {
        const response = await Organization.findByIdAndDelete(id);
        return res.status(200).json({ success: true, response });
    } catch (e) {
        return res.status(400).json({ success: false, message: `${e}` });
    }
}