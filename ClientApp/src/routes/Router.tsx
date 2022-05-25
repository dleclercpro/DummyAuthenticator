import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignOut from '../components/auth/SignOut';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';

export enum Page {
    Home = '',
    SignIn = 'sign-in',
    SignUp = 'sign-up',
}

export const getURL = (page: Page) => {
    let url = '';

    switch (page) {
        case Page.Home:
            url = '/';
            break;

        // Authentication pages
        case Page.SignIn:
        case Page.SignUp:
            url = `/${page}`;
            break;
    }

    return url;
};

interface Props {

}

const Router: React.FC<Props> = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<SignOut />} />
                <Route path='sign-in' element={<SignIn />} />
                <Route path='sign-up' element={<SignUp />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;