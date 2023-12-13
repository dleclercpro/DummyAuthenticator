import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NoMatch from '../components/pages/no-match/NoMatch';
import Home from '../components/pages/home/Home';
import SignIn from '../components/pages/sign-in/SignIn';
import SignUp from '../components/pages/sign-up/SignUp';
import AuthenticatedRoute from './AuthenticatedRoute';
import UnauthenticatedRoute from './UnauthenticatedRoute';

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
        <Routes>
            <Route path='/' element={
                <AuthenticatedRoute>
                    <Home />
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

            <Route path='*' element={<NoMatch />} />
        </Routes>
    );
}

export default Router;