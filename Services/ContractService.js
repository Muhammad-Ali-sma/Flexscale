import { url } from "../utils";
import RestClient from "../utils/RestClient"

const getAllContracts = () => RestClient.Get(`${url}contract`);

const Create = (formData) => RestClient.Post(`${url}contract`, formData);

const getContractById = (id) => RestClient.Get(`${url}contract?Id=${id}`);

const getContractsByOrgId = (id) => RestClient.Get(`${url}contract?orgId=${id}`);

const getContractsByUserId = (id) => RestClient.Get(`${url}contract?userId=${id}`);

const updateContract = (id, data) => RestClient.Put(`${url}contract?contractId=${id}`, data);

const updateContractStatus = (id, userId, data) => RestClient.Put(`${url}contract?contractId=${id}&userId=${userId}`, data);

export default { Create, getContractById, getContractsByOrgId, getContractsByUserId, getAllContracts, updateContract, updateContractStatus };