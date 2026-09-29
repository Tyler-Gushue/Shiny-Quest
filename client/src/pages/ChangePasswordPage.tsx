import RecoveryLayout from '../components/RecoveryLayout';
import ChangePasswordForm from '../features/auth/ChangePasswordForm';

function ChangePasswordPage() {

    return (
        <>
            <RecoveryLayout>
                <ChangePasswordForm />
            </RecoveryLayout>
        </>
    )

}

export default ChangePasswordPage;