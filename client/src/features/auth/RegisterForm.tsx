import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query'
import { signUpUser } from '../../api/auth'
import PasswordStrength from './PasswordStrength'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\x20-\x7E]{8,72}$/

function validateTrainerName( trainerName: string ) {

    if ( !trainerName.trim() ) return "Trainer name can't be empty"
    return ''

}

function validateEmail( email: string ) {

    if ( !email.trim() ) return 'Email is required'
    if ( !EMAIL_REGEX.test(email) ) return 'Invalid email, for ex: example@email.com'
    return ''

}

function validatePassword( password: string ) {

    if ( !password ) return "Password can't be empty"
    if ( !PASSWORD_REGEX.test(password) ) return 'Invalid password format. Must be 8 to 72 characters with at least one lowercase letter, one uppercase letter, and one number'
    return ''

}

function validateConfirmPassword( confirmPassword: string, password: string ) {

    if ( confirmPassword !== password ) return 'Passwords must match'
    return ''

}

function RegisterForm () {

    const [trainerName, setTrainerName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [trainerNameError, setTrainerNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [serverError, setServerError] = useState('')
    const navigate = useNavigate()

    const signUpMutation = useMutation({

        mutationFn: ( vars: { username: string; email: string; password: string; confirmPassword: string }) =>
            signUpUser(vars.username, vars.email, vars.password, vars.confirmPassword),

        onSuccess: (data, vars) => {

            console.log("signed up!", data)
            setServerError('')
            navigate("/verifyEmail", { state: { email: vars.email } })

        },

        onError: (error) => {

            console.log('sign up failed', error)
            setServerError(error.message || 'Something went wrong')

        }

    })

    const baseInputClass = 'bg-gray-900 w-full py-3 px-2 text-base border-2 rounded-xl mb-2 hover:shadow-xl focus:shadow-xl focus:outline-none'
    const normalInputClass = 'border-gray-700 hover:border-amber-400 focus:border-amber-400 hover:shadow-amber-400/20 focus:shadow-amber-400/30'
    const errorInputClass = 'border-red-500 shadow-xl shadow-red-500/20 hover:shadow-red-500/30 focus:shadow-red-500/30'
    const errorTextClass = 'text-red-500 text-sm -mt-1 mb-2 lg:max-w-100'

    function handleSubmit( e: FormEvent<HTMLFormElement> ) {

        e.preventDefault()

        const trainerNameMessage = validateTrainerName(trainerName)
        const emailMessage = validateEmail(email)
        const passwordMessage = validatePassword(password)
        const confirmPasswordMessage = validateConfirmPassword(confirmPassword, password)

        setTrainerNameError(trainerNameMessage)
        setEmailError(emailMessage)
        setPasswordError(passwordMessage)
        setConfirmPasswordError(confirmPasswordMessage)

        if ( trainerNameMessage || emailMessage || passwordMessage || confirmPasswordMessage ) return

        signUpMutation.mutate({ username: trainerName, email, password, confirmPassword })

    }

    return (

        <form onSubmit={handleSubmit} className="w-full max-w-md lg:w-auto lg:max-w-none px-1 lg:bg-gray-800 lg:border-t-5 lg:border-2 lg:border-t-amber-400 lg:border-gray-700 lg:rounded-xl lg:py-10 lg:px-5">
                <div>
                    <h1 className='text-2xl lg:text-4xl font-bold'>Create an account</h1>
                    <p className='text-gray-400 text-sm lg:text-base mt-1 lg:mt-3'>Start logging your hunts and shiny catches</p>
                </div>
                <div className='mt-4 lg:mt-6'>
                    <div className='mb-1'>
                        <label htmlFor='trainerName' className='text-base'>Trainer name</label>
                    </div>
                    <input
                        className={`${baseInputClass} ${trainerNameError ? errorInputClass : normalInputClass}`}
                        id='trainerName'
                        type="text"
                        value={trainerName}
                        onChange={(e) => {
                            setTrainerName(e.target.value)
                            if (trainerNameError) setTrainerNameError(validateTrainerName(e.target.value))
                        }}
                        onBlur={() => setTrainerNameError(validateTrainerName(trainerName))}
                        placeholder='Trainer#532'
                    />
                    {trainerNameError && <p className={errorTextClass}>{trainerNameError}</p>}
                </div>
                <div>
                    <div className='mb-1'>
                        <label htmlFor='email' className='text-base'>Email</label>
                    </div>
                    <input
                        className={`${baseInputClass} ${emailError ? errorInputClass : normalInputClass}`}
                        id='email'
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            if (emailError) setEmailError(validateEmail(e.target.value))
                        }}
                        onBlur={() => setEmailError(validateEmail(email))}
                        placeholder='example@email.com'
                    />
                    {emailError && <p className={errorTextClass}>{emailError}</p>}
                </div>
                <div>
                    <div className='mb-1 lg:mt-2'>
                        <label htmlFor='password' className='text-base'>Password</label>
                    </div>
                    <input
                        className={`${baseInputClass} ${passwordError ? errorInputClass : normalInputClass}`}
                        id='password'
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            if (passwordError) setPasswordError(validatePassword(e.target.value))
                        }}
                        onBlur={() => {
                            setPasswordError(validatePassword(password))
                            // Re-check confirm password if it's already been filled in
                            if (confirmPassword) setConfirmPasswordError(validateConfirmPassword(confirmPassword, password))
                        }}
                        placeholder='Password'
                    />
                    <PasswordStrength password={password} />
                    {passwordError && <p className={errorTextClass}>{passwordError}</p>}
                </div>
                <div className='mb-5 lg:mb-7'>
                    <div className='mb-1 lg:mt-2'>
                        <label htmlFor='confirmPassword' className='text-base'>Confirm Password</label>
                    </div>
                    <input
                        className={`${baseInputClass} ${confirmPasswordError ? errorInputClass : normalInputClass}`}
                        id='confirmPassword'
                        type="password"
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
                <div className='flex justify-center flex-col'>
                    {serverError && (
                        <p className='text-red-500 font-bold text-center mb-3 lg:max-w-100'>{serverError}</p>
                    )}
                    <button
                        type="submit"
                        disabled={signUpMutation.isPending}
                        className='flex justify-center items-center bg-amber-400 w-full lg:w-100 py-3 px-1 rounded-xl text-black font-bold text-lg lg:text-xl active:bg-amber-500 active:text-gray-800 disabled:cursor-not-allowed disabled:active:bg-amber-400'
                    >
                        {signUpMutation.isPending ? (
                            <span className='h-7 w-7 border-4 border-black border-t-transparent rounded-full animate-spin' aria-label='Creating account' />
                        ) : (
                            'Register'
                        )}
                    </button>
                    <Link to="/login" className="flex gap-1 text-amber-400 ml-auto mr-auto mt-3">
                        <p className='text-gray-400'>Already have an account? </p>
                        <p className='font-bold'>Log in</p>
                    </Link>
                </div>
        </form>

    )

}

export default RegisterForm;
