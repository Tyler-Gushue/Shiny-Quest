import RegisterForm from '../features/auth/RegisterForm'
import AuthLayout from '../components/AuthLayout';

function RegisterPage () {

    return (

        <>
            <AuthLayout tagline={<><p>Your shiny hunting journey begins here</p></>}>
                <RegisterForm />
            </AuthLayout>
        </>


    )

}

export default RegisterPage;