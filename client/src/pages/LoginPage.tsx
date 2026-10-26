import LoginForm from '../features/auth/LoginForm'
import AuthLayout from '../components/AuthLayout';

function LoginPage () {

    return (

        <>
            <AuthLayout tagline={<><p>Track every shiny,</p><p>every hunt</p></>}>
                <LoginForm />
            </AuthLayout>
        </>

    )

}

export default LoginPage;