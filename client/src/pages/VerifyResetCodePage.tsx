import React from 'react'
import RecoveryLayout from '../components/RecoveryLayout';
import VerifyCodeForm from '../features/auth/VerifyCodeForm'

function verifyCodePage () {

    return (
        <>
            <RecoveryLayout>
                <VerifyCodeForm />
            </RecoveryLayout>
        </>
    )

}

export default verifyCodePage