import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'authUser',
    initialState: {
        login: {
            loading: true,
            userData: {},
            token: null,
        },
        selectedOrganization: null,
        activeStep: 0,
        OrganizationList: [],
        usersList: [],
    },
    reducers: {
        loginAuth: (state, action) => {
            state.login = {
                loading: false,
                userData: action.payload.userData,
                token: action.payload.userData.token
            }
        },
        logoutAuth: (state, action) => {
            state.login = {
                loading: false,
                userData: {},
                token: null,
            },
                state.selectedOrganization = null,
                state.OrganizationList = [],
                state.usersList = []
        },
        nextStep: (state, action) => {
            state.activeStep = action.payload.step
        },
        previousStep: (state, action) => {
            state.activeStep = Number(state.activeStep) - 1
        },
        updateOrganization: (state, action) => {
            state.login.userData = {
                ...state.login.userData,
                Organization: action.payload.organization
            }
        },
        setOrganization: (state, action) => {
            state.selectedOrganization = action.payload.org
        },
        updateImage: (state, action) => {
            console.log("action", action)
            state.login.userData.ProfileImage = action.payload.image
        }
    },
})


export const { loginAuth, logoutAuth, nextStep, previousStep, updateOrganization, setOrganization, updateImage } = authSlice.actions;

export const selectAuth = (state) => state.authUser.login;

export default authSlice;