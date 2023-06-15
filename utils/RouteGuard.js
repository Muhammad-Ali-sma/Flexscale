import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { logoutAuth, selectAuth } from '../store/authSlice';
import { getOrganizationList, getUsersList } from './globalFunctions';


const RouteGuard = ({ children }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector(selectAuth);
    const [authorized, setAuthorized] = useState(false);
    const users = useSelector(state => state.dataSlice.usersList);
    const publicPaths = ['/login', '/signup', '/forget-password', "/swagger"];
    const organizations = useSelector(state => state.dataSlice.OrganizationList);

    useEffect(() => {

        if (!authState?.token) {
            if (Object(authState?.userData).keys > 0) {
                dispatch(logoutAuth());
                if (!publicPaths.includes(router.asPath.split('?')[0])) {
                    router.push('/login');
                }
            }
        } else {
            if (organizations?.length === 0) {
                getOrganizationList();
            }
            if (users?.length === 0) {
                getUsersList();
            }
        }
        // on initial load - run auth check 
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false  
        const hideContent = () => {
            const path = router.asPath.split('?')[0];
            if (authState?.token && authState?.token == null && !publicPaths.includes(path)) {
                setAuthorized(false)
            }
        };
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authState]);

    function authCheck(url) {
        // redirect to login page if accessing a private page and not logged in 
        const path = url.split('?')[0];
        if (authState?.token == null && !publicPaths.includes(path)) {
            setAuthorized(false);
            router.push('/login');
        } else {
            setAuthorized(true);
        }
    }

    return (authorized && children);
}

export default RouteGuard;
