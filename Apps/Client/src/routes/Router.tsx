import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NoMatch from '../components/pages/no-match/NoMatch';
import Home from '../components/pages/home/Home';
import SignIn from '../components/pages/sign-in/SignIn';
import SignUp from '../components/pages/sign-up/SignUp';
import AuthenticatedRoute from './AuthenticatedRoute';
import UnauthenticatedRoute from './UnauthenticatedRoute';
import ForgotPassword from '../components/pages/forgot-password/ForgotPassword';
import ResetPassword from '../components/pages/reset-password/ResetPassword';
import ConfirmEmail from '../components/pages/confirm-email/ConfirmEmail';
import Admin from '../components/pages/admin/Admin';

export enum Page {
    Home = '',
    Admin = 'admin',
    SignIn = 'sign-in',
    SignUp = 'sign-up',
    ForgotPassword = 'forgot-password',
    ResetPassword = 'reset-password',
}

export const getURL = (page: Page) => {
    let url = '';

    switch (page) {
        case Page.Home:
            url = '/';
            break;

        // Authentication pages
        case Page.Admin:
        case Page.SignIn:
        case Page.SignUp:
        case Page.ForgotPassword:
        case Page.ResetPassword:
            url = `/${page}`;
            break;
    }

    return url;
};

interface Props {

}

const Router: React.FC<Props> = () => {
    return (
        <Routes>
            <Route path='/' element={
                <AuthenticatedRoute>
                    <Home />
                </AuthenticatedRoute>
            } />

            <Route path='/admin' element={
                <AuthenticatedRoute shouldBeAdmin>
                    <Admin />
                </AuthenticatedRoute>
            } />

            <Route path='/sign-in' element={
                <UnauthenticatedRoute>
                    <SignIn />
                </UnauthenticatedRoute>
            } />
            
            <Route path='/sign-up' element={
                <UnauthenticatedRoute>
                    <SignUp />
                </UnauthenticatedRoute>
            } />

            <Route path='/confirm-email' element={
                <UnauthenticatedRoute>
                    <ConfirmEmail />
                </UnauthenticatedRoute>
            } />

            <Route path='/forgot-password' element={
                <UnauthenticatedRoute>
                    <ForgotPassword />
                </UnauthenticatedRoute>
            } />

            <Route path='/reset-password' element={
                <ResetPassword />
            } />

            <Route path='*' element={<NoMatch />} />
        </Routes>
    );
}

export default Router;