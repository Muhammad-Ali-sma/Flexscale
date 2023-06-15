import { createSlice } from '@reduxjs/toolkit';

export const dataSlice = createSlice({
    name: 'dataSlice',
    initialState: {
        OrganizationList: [],
        usersList: [],
    },
    reducers: {
        setOrganizationList: (state, action) => {
            state.OrganizationList = action.payload.organizations
        },
        setUsersList: (state, action) => {
            state.usersList = action.payload.users
        },
    },
})


export const { setOrganizationList, setUsersList } = dataSlice.actions;


export default dataSlice;