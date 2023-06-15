import { AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, Client_Secret_Id, Sandbox_Key, SMTPSettings } from ".";
import { setOrganizationList, setUsersList } from "../store/dataSlice";
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import OrganizationService from "../Services/OrganizationService";
import UserService from "../Services/UserService";
import { store } from "../store/store";
import S3 from 'react-aws-s3';
import moment from "moment";



export const formReducer = (state, event) => {
    return {
        ...state,
        [event.target?.name]: event.target?.value
    }
}

export const enumerateDaysBetweenDates = (TimePeriodStart, TimePeriodEnd) => {
    var days = [];
    var currDate = moment(TimePeriodStart).startOf('day');
    var lastDate = moment(TimePeriodEnd).startOf('day');
    days.push({
        date: TimePeriodStart,
        hours: 8,
        check: false
    });
    while (currDate.add(1, 'days').diff(lastDate) <= 0) {
        days.push({
            date: currDate.clone().toDate(),
            hours: 8,
            check: false
        });
    }
    return days;
};

export const getOrganizationList = () => {
    OrganizationService.getAllOrganizations()
        .then(res => {
            if (res?.success) {
                store.dispatch(setOrganizationList({ organizations: res?.list }))
            }
        })
}

export const getUsersList = () => {
    UserService.getUsersList()
        .then(res => {
            if (res?.success) {
                store.dispatch(setUsersList({ users: res?.users }))
            }
        })
}

export const plaidClient = () => {
    const configuration = new Configuration({
        basePath: PlaidEnvironments.sandbox,
        baseOptions: {
            headers: {
                'PLAID-CLIENT-ID': Client_Secret_Id,
                'PLAID-SECRET': Sandbox_Key,
            },
        },
    });
    const client = new PlaidApi(configuration);
    return client;
}

export const formatNum = (num) => {
    return Number(num)?.toFixed(2)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const s3 = (id) => {
    const config = {
        bucketName: "flexscalebucket",
        accessKeyId: AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
        region: 'us-west-2',
        dirName: `uploads/${id}`
    }

    const ReactS3Client = new S3(config);
    return ReactS3Client;
}

export const getUser = (key, value) => {
    return store.getState().dataSlice.usersList?.filter(x => x[key] === value);
}