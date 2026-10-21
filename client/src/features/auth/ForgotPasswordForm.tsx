import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query'
import ShinyQuestLogo from '../../assets/ShinyQuestLogo.svg';
import { sendResetVerificationCode } from '../../api/auth';

function ForgotPasswordForm () {

    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const navigate = useNavigate();

    const sendResetCodeMutation = useMutation({

        mutationFn: ( vars: { email: string } ) =>
            sendResetVerificationCode( vars.email ),

        onSuccess: (_data, vars) => {

            setEmailError("")
            navigate("/forgotPassword/verify", { state: { email: vars.email } });

        },

        onError: (error) => {

            setEmailError(error.message)

        }

    })

    const baseInputClass = 'bg-gray-900 w-full text-lg lg:text-xl py-4 lg:py-3 px-3 lg:px-2 border-2 rounded-xl mb-2 hover:shadow-xl focus:shadow-xl focus:outline-none'
    const normalInputClass = 'border-gray-700 hover:border-amber-400 focus:border-amber-400 hover:shadow-amber-400/20 focus:shadow-amber-400/30'
    const errorInputClass = 'border-red-500 shadow-xl shadow-red-500/20 hover:shadow-red-500/30 focus:shadow-red-500/30'
    const errorTextClass = 'text-red-500 -mt-1 mb-2'

    function handleSubmit( e: FormEvent<HTMLFormElement> ) {

        e.preventDefault();

        const trimmedEmail = email.trim()

        if (!trimmedEmail) {
            setEmailError("Email is required")
            return
        }

        sendResetCodeMutation.mutate({ email: trimmedEmail })

    }

    return (

        <form className="w-full max-w-md lg:w-115 lg:max-w-[90vw] px-1 lg:bg-gray-800 lg:border-t-5 lg:border-2 lg:border-t-amber-400 lg:border-gray-700 lg:rounded-xl lg:py-10 lg:px-5" onSubmit={handleSubmit}>
                <div id="logo" className="flex justify-center mb-2 lg:mb-6">
                    <img src={ShinyQuestLogo} alt="Shiny Quest logo" className="w-72 lg:w-100" />
                </div>
                <div className='mt-7'>
                    <h1 className='text-3xl lg:text-2xl font-bold'>Recovery Code</h1>
                    <p className='text-base lg:text-lg text-gray-400 mt-2 lg:mt-3'>If you've forgotten your password, we can send you a code to reset it.  Please enter your email address below to get started.</p>
                </div>
                <div className='mt-7'>
                    <div className='mb-1 text-lg lg:text-xl font-bold'>
                        <label htmlFor='email' className=''>Email</label>
                    </div>
                    <input
                        className={`${baseInputClass} ${emailError ? errorInputClass : normalInputClass}`}
                        id='email'
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            if (emailError) setEmailError("")
                        }}
                        placeholder='Email'
                    />
                    {emailError && <p className={errorTextClass}>{emailError}</p>}
                </div>
                <div className="text-center mt-7">
                    <button
                        type="submit"
                        disabled={sendResetCodeMutation.isPending}
                        className='inline-flex justify-center items-center bg-amber-400 w-full lg:w-100 py-4 lg:py-3 px-1 rounded-xl text-black font-bold text-xl mb-2 active:bg-amber-500 active:text-gray-800 disabled:cursor-not-allowed disabled:active:bg-amber-400'
                    >
                        {sendResetCodeMutation.isPending ? (
                            <span className='h-7 w-7 border-4 border-black border-t-transparent rounded-full animate-spin' aria-label='Sending' />
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

export default ForgotPasswordForm;
