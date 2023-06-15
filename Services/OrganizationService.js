import { url } from "../utils";
import RestClient from "../utils/RestClient"


const getStripeCustomer = (id) => RestClient.Get(`${url}organization?stripeId=${id}`);

const getAllOrganizations = () => RestClient.Get(`${url}organization`);

const deleteOrganization = (id) => RestClient.Delete(`${url}organization?id=${id}`);

const createOrganization = (formData) => RestClient.Post(`${url}organization`, JSON.stringify(formData));

const updateOrganization = (id, formData) => RestClient.Put(`${url}organization?orgId=${id}`, JSON.stringify(formData));

export default { getStripeCustomer, getAllOrganizations, createOrganization, updateOrganization, deleteOrganization };