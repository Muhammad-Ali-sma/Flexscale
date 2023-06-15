import { url } from "../utils";
import RestClient from "../utils/RestClient";

const getAllTimesheets = () => RestClient.Get(`${url}timesheet`);

const Create = (formData) => RestClient.Post(`${url}timesheet`, formData);

const getTimesheetById = (id) => RestClient.Get(`${url}timesheet?id=${id}`);

const deleteTimesheet = (id) => RestClient.Delete(`${url}timesheet?timesheetId=${id}`);

const updateTimesheet = (id, data) => RestClient.Put(`${url}timesheet?timesheetId=${id}`, data);

const getTimesheetByUserId = (userId, orgId, contractId) => RestClient.Get(`${url}timesheet?userId=${userId}&orgId=${orgId}&contractId=${contractId}`);

export default { Create, getAllTimesheets, getTimesheetById, updateTimesheet, deleteTimesheet, getTimesheetByUserId };