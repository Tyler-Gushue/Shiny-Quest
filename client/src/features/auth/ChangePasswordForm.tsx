import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query'
import ShinyQuestLogo from '../../assets/ShinyQuestLogo.svg';
import { resetPassword } from '../../api/auth';
import PasswordStrength from './PasswordStrength'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\x20-\x7E]{8,72}$/

function validatePassword( password: string ) {

    if ( !password ) return "Password can't be empty"
    if ( !PASSWORD_REGEX.test(password) ) return 'Invalid password format. Must be 8 to 72 characters with at least one lowercase letter, one uppercase letter, and one number'
    return ''

}

function validateConfirmPassword( confirmPassword: string, password: string ) {

    if ( confirmPassword !== password ) return 'Passwords must match'
    return ''

}

function ChangePasswordForm() {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email as string | undefined;
    const resetToken = location.state?.resetToken as string | undefined;

    const resetPasswordMutation = useMutation({

        mutationFn: ( vars: { resetToken: string; newPassword: string; confirmPassword: string } ) =>
            resetPassword( vars.resetToken, vars.newPassword, vars.confirmPassword ),

        onSuccess: () => {

            setPasswordError('')
            setConfirmPasswordError('')
            navigate("/login", { replace: true })

        },

        onError: (error) => {

            console.log('password reset failed', error)
            setPasswordError(error.message || 'Something went wrong')

        }

    })

    const baseInputClass = 'bg-gray-900 w-full text-lg lg:text-xl py-4 lg:py-3 px-3 lg:px-2 border-2 rounded-xl mb-2 hover:shadow-xl focus:shadow-xl focus:outline-none'
    const normalInputClass = 'border-gray-700 hover:border-amber-400 focus:border-amber-400 hover:shadow-amber-400/20 focus:shadow-amber-400/30'
    const errorInputClass = 'border-red-500 shadow-xl shadow-red-500/20 hover:shadow-red-500/30 focus:shadow-red-500/30'
    const errorTextClass = 'text-red-500 -mt-1 mb-2'

    // No reset token means the code was never verified, send them back to the start
    if (!resetToken) {
        return <Navigate to="/forgotPassword" replace />;
    }

    function handleSubmit( e: FormEvent<HTMLFormElement> ) {

        e.preventDefault();

        const passwordMessage = validatePassword(password)
        const confirmPasswordMessage = validateConfirmPassword(confirmPassword, password)

        setPasswordError(passwordMessage)
        setConfirmPasswordError(confirmPasswordMessage)

        if (passwordMessage || confirmPasswordMessage) return

        resetPasswordMutation.mutate({ resetToken: resetToken!, newPassword: password, confirmPassword })

    }

    return (

        <form className="w-full max-w-md lg:w-115 lg:max-w-[90vw] px-1 lg:bg-gray-800 lg:border-t-5 lg:border-2 lg:border-t-amber-400 lg:border-gray-700 lg:rounded-xl lg:py-10 lg:px-5" onSubmit={handleSubmit}>
                <div id="logo" className="flex justify-center mb-2 lg:mb-6">
                    <img src={ShinyQuestLogo} alt="Shiny Quest logo" className="w-72 lg:w-100" />
                </div>
                <div className='mt-7'>
                    <h1 className='text-3xl lg:text-2xl font-bold'>Change Password</h1>
                    <p className='text-base lg:text-lg text-gray-400 mt-2 lg:mt-3'>
                        Please enter your new password for the email address:{' '}
                        <span className='text-amber-400'>{email}</span>
                    </p>
                </div>
                <div className='mt-7'>
                    <div className='mb-1 text-lg lg:text-xl font-bold'>
                        <label htmlFor='password' className=''>New Password</label>
                    </div>
                    <input
                        className={`${baseInputClass} ${passwordError ? errorInputClass : normalInputClass}`}
                        id='password'
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            if (passwordError) setPasswordError(validatePassword(e.target.value))
                        }}
                        onBlur={() => {
                            setPasswordError(validatePassword(password))
                            if (confirmPassword) setConfirmPasswordError(validateConfirmPassword(confirmPassword, password))
                        }}
                        placeholder='New Password'
                    />
                    <PasswordStrength password={password} />
                    {passwordError && <p className={errorTextClass}>{passwordError}</p>}
                    <div className='mb-1 text-lg lg:text-xl font-bold'>
                        <label htmlFor='confirmPassword' className=''>Confirm Password</label>
                    </div>
                    <input
                        className={`${baseInputClass} ${confirmPasswordError ? errorInputClass : normalInputClass}`}
                        id='confirmPassword'
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                            if (confirmPasswordError) setConfirmPasswordError(validateConfirmPassword(e.target.value, password))
                        }}
                        onBlur={() => setConfirmPasswordError(validateConfirmPassword(confirmPassword, password))}
                        placeholder='Confirm Password'
                    />
                    {confirmPasswordError && <p className={errorTextClass}>{confirmPasswordError}</p>}
                </div>
                <div className="text-center mt-7">
                    <button
                        type="submit"
                        disabled={resetPasswordMutation.isPending}
                        className='inline-flex justify-center items-center bg-amber-400 w-full lg:w-100 py-4 lg:py-3 px-1 rounded-xl text-black font-bold text-xl mb-2 active:bg-amber-500 active:text-gray-800 disabled:cursor-not-allowed disabled:active:bg-amber-400'
                    >
                        {resetPasswordMutation.isPending ? (
                            <span className='h-7 w-7 border-4 border-black border-t-transparent rounded-full animate-spin' aria-label='Saving' />
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

export default ChangePasswordForm;
