import { url } from "../utils";
import RestClient from "../utils/RestClient";

const getUsersList = () => RestClient.Get(`${url}users`);

const getErrorLogs = () => RestClient.Get(`${url}auth/logerror`);

const deleteErrorLogs = () => RestClient.Delete(`${url}auth/logerror`);

const deleteUser = (id) => RestClient.Delete(`${url}users?userId=${id}`);

const verifyLink = () => RestClient.Get(`${url}auth/verifyToken`);

const createLog = (data) => RestClient.Post(`${url}auth/logerror`, data);

const Login = (formData) => RestClient.Post(`${url}auth/login`, formData);

const ClearDatabase = () => RestClient.Get(`${url}auth/logerror?clearAll=true`);

const loginByEmail = (formData) => RestClient.Post(`${url}auth/login`, formData);

const forgetPass = (formData) => RestClient.Post(`${url}auth/forgetPass`, formData);

const verifyToken = (token) => RestClient.Get(`${url}auth/verifyToken?token=${token}`);

const getTeamMembers = (orgId) => RestClient.Get(`${url}users?OrganizationId=${orgId}`);

const Register = (formData) => RestClient.Post(`${url}users`, JSON.stringify(formData));

const changePass = (formData) => RestClient.Post(`${url}auth/changepassword`, formData);

const updateUser = (id, formData) => RestClient.Put(`${url}users?userId=${id}`, JSON.stringify(formData));

const uploadProfileImage = (id, formData) => RestClient.Put(`${url}users?userId=${id}`, JSON.stringify(formData));

export default { Login, getUsersList, Register, ClearDatabase, updateUser, uploadProfileImage, deleteUser, loginByEmail, verifyLink, forgetPass, changePass, verifyToken, getTeamMembers, createLog, getErrorLogs, deleteErrorLogs };