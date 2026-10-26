import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query'
import ShinyQuestLogo from '../../assets/ShinyQuestLogo.svg';
import { verifyResetCode, sendResetVerificationCode } from '../../api/auth';

function VerifyCodeForm () {

    const [code, setCode] = useState("")
    const [codeError, setCodeError] = useState("")
    const [resendMessage, setResendMessage] = useState("")
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email as string | undefined;

    const verifyResetCodeMutation = useMutation({

        mutationFn: ( vars: { email: string; code: string } ) =>
            verifyResetCode( vars.email, vars.code ),

        onSuccess: (data, vars) => {

            setCodeError("")

            // The reset token authorizes the password change on the next page
            navigate("/changePassword", { replace: true, state: { email: vars.email, resetToken: data.resetToken } });

        },

        onError: (error) => {

            setCodeError(error.message)

        }

    })

    const resendCodeMutation = useMutation({

        mutationFn: ( vars: { email: string } ) =>
            sendResetVerificationCode( vars.email ),

        onSuccess: () => {

            setCodeError("")
            setResendMessage("A new code has been sent")

        },

        onError: (error) => {

            setResendMessage("")
            setCodeError(error.message)

        }

    })

    const baseInputClass = 'bg-gray-900 w-full text-lg lg:text-xl py-4 lg:py-3 px-3 lg:px-2 border-2 rounded-xl mb-2 hover:shadow-xl focus:shadow-xl focus:outline-none'
    const normalInputClass = 'border-gray-700 hover:border-amber-400 focus:border-amber-400 hover:shadow-amber-400/20 focus:shadow-amber-400/30'
    const errorInputClass = 'border-red-500 shadow-xl shadow-red-500/20 hover:shadow-red-500/30 focus:shadow-red-500/30'
    const errorTextClass = 'text-red-500 -mt-1 mb-2'

    // Page was opened directly (no email passed from forgot password), nothing to verify
    if (!email) {
        return <Navigate to="/forgotPassword" replace />;
    }

    function handleSubmit( e: FormEvent<HTMLFormElement> ) {

        e.preventDefault();
        setResendMessage("")

        const trimmedCode = code.trim()

        if (!/^\d{6}$/.test(trimmedCode)) {
            setCodeError("Code must be 6 digits")
            return
        }

        verifyResetCodeMutation.mutate({ email: email!, code: trimmedCode })

    }

    function handleResend() {

        resendCodeMutation.mutate({ email: email! })

    }

    return (

        <form className="w-full max-w-md lg:w-115 lg:max-w-[90vw] px-1 lg:bg-gray-800 lg:border-t-5 lg:border-2 lg:border-t-amber-400 lg:border-gray-700 lg:rounded-xl lg:py-10 lg:px-5" onSubmit={handleSubmit}>
                <div id="logo" className="flex justify-center mb-2 lg:mb-6">
                    <img src={ShinyQuestLogo} alt="Shiny Quest logo" className="w-72 lg:w-100" />
                </div>
                <div className='mt-7'>
                    <h1 className='text-3xl lg:text-2xl font-bold'>Verify Code</h1>
                    <div className='text-base lg:text-lg text-gray-400 mt-2 lg:mt-3'>
                        <p>Please enter the verification code sent to: <span className='text-amber-400'>{email}</span></p>
                    </div>
                </div>
                <div className='mt-7'>
                    <div className='mb-1 text-lg lg:text-xl font-bold'>
                        <label htmlFor='code' className=''>Verification Code</label>
                    </div>
                    <input
                        className={`${baseInputClass} ${codeError ? errorInputClass : normalInputClass}`}
                        id='code'
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value.replace(/\D/g, ''))
                            if (codeError) setCodeError("")
                        }}
                        placeholder='Verification Code'
                    />
                    {codeError && <p className={errorTextClass}>{codeError}</p>}
                    {resendMessage && <p className='text-green-400 -mt-1 mb-2'>{resendMessage}</p>}
                    <div className='flex justify-start mx-1 mt-2'>
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resendCodeMutation.isPending}
                            className='text-lg lg:text-base text-amber-400 font-bold disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {resendCodeMutation.isPending ? 'Sending...' : 'Resend code?'}
                        </button>
                    </div>
                </div>
                <div className="text-center mt-7">
                    <button
                        type="submit"
                        disabled={verifyResetCodeMutation.isPending}
                        className='inline-flex justify-center items-center bg-amber-400 w-full lg:w-100 py-4 lg:py-3 px-1 rounded-xl text-black font-bold text-xl mb-2 active:bg-amber-500 active:text-gray-800 disabled:cursor-not-allowed disabled:active:bg-amber-400'
                    >
                        {verifyResetCodeMutation.isPending ? (
                            <span className='h-7 w-7 border-4 border-black border-t-transparent rounded-full animate-spin' aria-label='Verifying' />
                        ) : (
                            'Submit'
                        )}
                    </button>
                    <Link to="/login" className="inline-block text-lg lg:text-base text-amber-400 font-bold mt-2 lg:mt-0">
                        Back to login
                    </Link>
                </div>
        </form>

    )

}

export default VerifyCodeForm;
