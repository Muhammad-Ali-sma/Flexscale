import { url } from "../utils";
import RestClient from "../utils/RestClient"

const getAllPayments = () => RestClient.Get(`${url}payment`);

const Create = (formData) => RestClient.Post(`${url}payment`, formData);

const CreatePlaidLink = () => RestClient.Get(`${url}payment?plaidLink=true`);

const getCustomerPayments = (id) => RestClient.Get(`${url}payment?stripeId=${id}`);

const getPaymentMethodsByCustomerId = (id) => RestClient.Get(`${url}payment?customerId=${id}`);

const Delete = (id, customerId) => RestClient.Delete(`${url}payment?paymentId=${id}&customerId=${customerId}`);

const Update = (customerId, paymentId) => RestClient.Put(`${url}payment?paymentId=${paymentId}&customerId=${customerId}`);

export default { Create, getPaymentMethodsByCustomerId, Delete, Update, getCustomerPayments, getAllPayments, CreatePlaidLink };