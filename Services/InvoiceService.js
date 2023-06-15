import { url } from "../utils";
import RestClient from "../utils/RestClient"

const getAllInvoices = () => RestClient.Get(`${url}invoice`);

const sendReminder = (data) => RestClient.Put(`${url}invoice`, data);

const Create = (formData) => RestClient.Post(`${url}invoice`, formData);

const getInvoiceById = (id) => RestClient.Get(`${url}invoice?id=${id}`);

const getInvoiceByOrgId = (id) => RestClient.Get(`${url}invoice?orgId=${id}`);

const updateInvoice = (id, data) => RestClient.Put(`${url}invoice?invoiceId=${id}`, data);

export default { Create, getInvoiceById, getAllInvoices, updateInvoice, sendReminder, getInvoiceByOrgId };