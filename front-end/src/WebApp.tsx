import { Routes, Route } from 'react-router-dom';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';

function WebApp() {
    return (
        <Routes>
            <Route
                path="/auth/signin"
                element={
                    <>
                        <PageTitle title="Signin | TailAdmin" />
                        <SignIn />
                    </>
                }
            />
            <Route
                path="/auth/signup"
                element={
                    <>
                        <PageTitle title="Signup | TailAdmin" />
                        <SignUp />
                    </>
                }
            />
        </Routes>
    );
}

export default WebApp;
