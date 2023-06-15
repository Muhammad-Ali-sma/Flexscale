import { url } from "../utils";
import RestClient from "../utils/RestClient"


const uploadDoc = (data) => RestClient.Post(`${url}document`, data);

const deleteDoc = (id) => RestClient.Delete(`${url}document?id=${id}`);

const editDoc = (id, name) => RestClient.Put(`${url}document?id=${id}&FileName=${name}`);


export default { uploadDoc, deleteDoc, editDoc };