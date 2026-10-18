import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query'
import ShinyQuestLogo from '../../assets/ShinyQuestLogo.svg';
import { verifyEmailCode, sendEmailVerificationCode } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';

function VerifyEmailForm () {

    const [code, setCode] = useState("")
    const [codeError, setCodeError] = useState("")
    const [resendMessage, setResendMessage] = useState("")
    const location = useLocation();
    const navigate = useNavigate()
    const { setAuth } = useAuth()
    const email = location.state?.email as string | undefined;

    const verifyEmailMutation = useMutation({

        mutationFn: ( vars: { email: string; code: string } ) =>
            verifyEmailCode( vars.email, vars.code ),

        onSuccess: (data) => {

            console.log("Email verified", data)
            setCodeError("")

            // verify-email logs the user in too, so save them in AuthContext before going to a protected page
            setAuth(data.user, data.accessToken)
            navigate("/dashboard", { replace: true })

        },

        onError: (error) => {

            console.log('verification failed', error)
            setCodeError(error.message)

        }

    })

    const resendCodeMutation = useMutation({

        mutationFn: ( vars: { email: string } ) =>
            sendEmailVerificationCode( vars.email ),

        onSuccess: () => {

            setCodeError("")
            setResendMessage("A new code has been sent")

        },

        onError: (error) => {

            setResendMessage("")
            setCodeError(error.message)

        }

    })

    const baseInputClass = 'bg-gray-900 w-full text-xl py-3 px-2 border-2 rounded-xl mb-2 hover:shadow-xl focus:shadow-xl focus:outline-none'
    const normalInputClass = 'border-gray-700 hover:border-amber-400 focus:border-amber-400 hover:shadow-amber-400/20 focus:shadow-amber-400/30'
    const errorInputClass = 'border-red-500 shadow-xl shadow-red-500/20 hover:shadow-red-500/30 focus:shadow-red-500/30'

    // Page was opened directly (no email passed from login/register), nothing to verify
    if (!email) {
        return <Navigate to="/login" replace />
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();
        setResendMessage("")

        const trimmedCode = code.trim()

        if (!/^\d{6}$/.test(trimmedCode)) {
            setCodeError("Code must be 6 digits")
            return
        }

        verifyEmailMutation.mutate({ email: email!, code: trimmedCode })

    }

    function handleResend() {

        resendCodeMutation.mutate({ email: email! })

    }

    return (

        <form className="bg-gray-800 border-t-5 border-2 border-t-amber-400 border-gray-700 rounded-xl py-10 px-5 w-115 max-w-[90vw]" onSubmit={handleSubmit}>
                <div id="logo" className=" flex gap-3 mt-auto text-4xl font-bold justify-center mb-6">
                    <img src={ShinyQuestLogo} alt="Shiny Quest logo" className="w-100" />
                </div>
                <div className='mt-7'>
                    <h1 className='text-2xl font-bold'>Verify Email</h1>
                    <div className='text-lg text-gray-400 mt-3'>
                        <p>Please enter the verification code sent to: <span className='text-amber-400'>{email}</span></p>
                    </div>
                </div>
                <div className='mt-7'>
                    <div className='mb-1 text-xl font-bold'>
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
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                        placeholder='Verification Code'
                    />
                </div>
                <div className="text-center mt-7">
                    {codeError && (
                        <p className='text-red-500 font-bold text-center mb-3'>{codeError}</p>
                    )}
                    {resendMessage && (
                        <p className='text-green-400 font-bold text-center mb-3'>{resendMessage}</p>
                    )}
                    <button
                        type="submit"
                        disabled={verifyEmailMutation.isPending}
                        className='inline-flex justify-center items-center bg-amber-400 w-100 max-w-full py-3 px-1 rounded-xl text-black font-bold text-xl mb-2 active:bg-amber-500 active:text-gray-800 disabled:cursor-not-allowed disabled:active:bg-amber-400'
                    >
                        {verifyEmailMutation.isPending ? (
                            <span className='h-7 w-7 border-4 border-black border-t-transparent rounded-full animate-spin' aria-label='Verifying' />
                        ) : (
                            'Verify'
                        )}
                    </button>
                    <div className='flex justify-center gap-1 mb-2'>
                        <p className='text-gray-400'>Didn't get a code?</p>
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resendCodeMutation.isPending}
                            className='text-amber-400 font-bold disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {resendCodeMutation.isPending ? 'Sending...' : 'Resend code'}
                        </button>
                    </div>
                    <Link to="/login" className="text-amber-400 ml-auto font-bold">
                        Back to login
                    </Link>
                </div>
        </form>

    )

}

export default VerifyEmailForm;
