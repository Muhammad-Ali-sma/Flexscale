import UserService from "../Services/UserService";
import { logoutAuth } from "../store/authSlice";
import { store } from "../store/store";
import axios from "axios";

const LogServerError = (err) => {
    if (err.data?.token === false) {
        store.dispatch(logoutAuth());
        window.location.pathname = '/login';
        return false;
    }

    const user = store.getState().authUser.login.userData;
    var data = { 
        code: err.status, 
        message: err.data?.message 
    }
    if (user) {
        data.userId = user?._id;
    }
    UserService.createLog(data);
    return true;
}

const Get = async (host) => {
    const Token = store.getState().authUser.login.token;
    const controller = new AbortController();

    return axios.get(host, { headers: { "Authorization": Token ? 'Bearer ' + (Token ? Token : '') : '' }, signal: controller.signal })
        .then(({ data }) => data)
        .catch(error => {
            LogServerError(error.response);
            return error.response.data
        });
}

const Post = async (host, data, contentType) => {
    const Token = store.getState().authUser.login.token;
    return axios.post(host, data, { headers: { "Content-Type": contentType ?? "application/json", "Authorization": Token ? 'Bearer ' + (Token ? Token : '') : '' } })
        .then(({ data }) => data)
        .catch(error => {
            LogServerError(error.response);
            return error.response.data
        });
}

const Put = async (host, data) => {
    const Token = store.getState().authUser.login.token;
    return axios.put(host, data, { headers: { "Content-Type": "application/json", "Authorization": Token ? 'Bearer ' + (Token ? Token : '') : '' } })
        .then(({ data }) => data)
        .catch(error => {
            LogServerError(error.response);
            return error.response.data
        });
}

const Delete = async (host) => {
    const Token = store.getState().authUser.login.token;
    return axios.delete(host, { headers: { "Authorization": Token ? 'Bearer ' + (Token ? Token : '') : '' } })
        .then(({ data }) => data)
        .catch(error => {
            LogServerError(error.response);
            return error.response.data
        })
}

export default { Get, Post, Put, Delete };