import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NoMatchPage from '../components/pages/no-match/NoMatchPage';
import HomePage from '../components/pages/home/HomePage';
import SignInPage from '../components/pages/sign-in/SignInPage';
import SignUpPage from '../components/pages/sign-up/SignUpPage';
import AuthenticatedRoute from './AuthenticatedRoute';
import UnauthenticatedRoute from './UnauthenticatedRoute';
import ForgotPasswordPage from '../components/pages/forgot-password/ForgotPasswordPage';
import ResetPasswordPage from '../components/pages/reset-password/ResetPasswordPage';
import ConfirmEmailPage from '../components/pages/confirm-email/ConfirmEmailPage';
import AdminPage from '../components/pages/admin/AdminPage';
import UsersPage from '../components/pages/users/UsersPage';
import SearchPage from '../components/pages/search/SearchPage';

export enum Page {
    Home = '',
    Admin = 'admin',
    SignIn = 'sign-in',
    SignUp = 'sign-up',
    ForgotPassword = 'forgot-password',
    ResetPassword = 'reset-password',
    Users = 'users',
    Search = 'search',
}

export const getURL = (page: Page) => {
    let url = '';

    switch (page) {
        case Page.Home:
            url = '/';
            break;

        // Authentication pages
        case Page.Admin:
        case Page.Search:
        case Page.SignIn:
        case Page.SignUp:
        case Page.ForgotPassword:
        case Page.ResetPassword:
        case Page.Users:
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
                    <HomePage />
                </AuthenticatedRoute>
            } />

            <Route path='/admin' element={
                <AuthenticatedRoute shouldBeAdmin>
                    <AdminPage />
                </AuthenticatedRoute>
            } />

            <Route path='/sign-in' element={
                <UnauthenticatedRoute>
                    <SignInPage />
                </UnauthenticatedRoute>
            } />
            
            <Route path='/sign-up' element={
                <UnauthenticatedRoute>
                    <SignUpPage />
                </UnauthenticatedRoute>
            } />

            <Route path='/confirm-email' element={
                <UnauthenticatedRoute>
                    <ConfirmEmailPage />
                </UnauthenticatedRoute>
            } />

            <Route path='/forgot-password' element={
                <UnauthenticatedRoute>
                    <ForgotPasswordPage />
                </UnauthenticatedRoute>
            } />

            <Route path='/reset-password' element={
                <ResetPasswordPage />
            } />

            <Route path='/users' element={
                <AuthenticatedRoute>
                    <UsersPage />
                </AuthenticatedRoute>
            } />

            <Route path='/search' element={
                <AuthenticatedRoute>
                    <SearchPage />
                </AuthenticatedRoute>
            } />

            <Route path='*' element={<NoMatchPage />} />
        </Routes>
    );
}

export default Router;