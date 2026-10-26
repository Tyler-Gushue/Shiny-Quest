import RecoveryLayout from '../components/RecoveryLayout';
import ForgotPasswordForm from '../features/auth/ForgotPasswordForm';

function ForgotPasswordPage () {

    return (
        <>
            <RecoveryLayout>
                <ForgotPasswordForm />
            </RecoveryLayout>
        </>
    )

}

export default ForgotPasswordPage;