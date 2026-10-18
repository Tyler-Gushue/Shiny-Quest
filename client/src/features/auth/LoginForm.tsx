import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'

function LoginForm () {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { setAuth } = useAuth()

    const loginMutation = useMutation({

        mutationFn: ( vars: { email: string; password: string }) =>
            loginUser(vars.email, vars.password),

        onSuccess: (data) => {

            console.log("logged in!", data)
            setEmailError(false)
            setPasswordError(false)

            // Save the user + token in AuthContext so ProtectedRoute lets them through
            setAuth(data.user, data.accessToken)

            // Go back to the page ProtectedRoute bounced them from, or the dashboard by default
            const from = location.state?.from?.pathname ?? "/dashboard"
            navigate(from, { replace: true })

        },

        onError: (error, vars) => {

            console.log('login failed', error)

            // Correct login but the account isn't verified yet (server already sent a new code)
            if (error.message === 'Email is not verified') {
                navigate("/verifyEmail", { state: { email: vars.email } })
                return
            }

            setEmailError(true)
            setPasswordError(true)

        }

    })

    const baseInputClass = 'bg-gray-900 w-full py-4 lg:py-3 px-3 lg:px-2 text-lg lg:text-base border-2 rounded-xl mb-2 hover:shadow-xl focus:shadow-xl focus:outline-none'
    const normalInputClass = 'border-gray-700 hover:border-amber-400 focus:border-amber-400 hover:shadow-amber-400/20 focus:shadow-amber-400/30'
    const errorInputClass = 'border-red-500 shadow-xl shadow-red-500/20 hover:shadow-red-500/30 focus:shadow-red-500/30'

    function handleSubmit( e: FormEvent<HTMLFormElement> ) {

        e.preventDefault()
        loginMutation.mutate({ email, password })

    }

    return (

        <form onSubmit={handleSubmit} className="w-full max-w-md lg:w-auto lg:max-w-none px-1 lg:bg-gray-800 lg:border-t-5 lg:border-2 lg:border-t-amber-400 lg:border-gray-700 lg:rounded-xl lg:py-10 lg:px-5">
                <div>
                    <h1 className='text-3xl lg:text-4xl font-bold'>Log in</h1>
                    <p className='text-gray-400 text-base mt-2 lg:mt-3'>Welcome back!  Pick up where you last left off.</p>
                </div>
                <div className='mt-6'>
                    <div className='mb-1'>
                        <label htmlFor='email' className='text-lg lg:text-base'>Email</label>
                    </div>
                    <input
                        className={`${baseInputClass} ${emailError ? errorInputClass : normalInputClass}`}
                        id='email'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                    />
                </div>
                <div>
                    <div className='mb-1 mt-2'>
                        <label htmlFor='password' className='text-lg lg:text-base'>Password</label>
                    </div>
                    <input
                        className={`${baseInputClass} ${passwordError ? errorInputClass : normalInputClass}`}
                        id='password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                    />
                </div>
                <div className='flex justify-start mx-1 mb-7 mt-2'>
                    <Link to="/forgotPassword" className="text-lg lg:text-base text-amber-400 font-bold">
                        Forgot password?
                    </Link>
                </div>
                <div className='flex justify-center flex-col'>
                    {(emailError || passwordError) && (
                        <p className='text-red-500 font-bold text-center mb-3'>Incorrect Email or Password</p>
                    )}
                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className='flex justify-center items-center bg-amber-400 w-full lg:w-100 py-4 lg:py-3 px-1 rounded-xl text-black font-bold text-xl active:bg-amber-500 active:text-gray-800 disabled:cursor-not-allowed disabled:active:bg-amber-400'
                    >
                        {loginMutation.isPending ? (
                            <span className='h-7 w-7 border-4 border-black border-t-transparent rounded-full animate-spin' aria-label='Logging in' />
                        ) : (
                            'Log in'
                        )}
                    </button>
                    <Link to="/register" className="flex gap-1 text-lg lg:text-base text-amber-400 ml-auto mr-auto mt-4 lg:mt-3">
                        <p className='text-gray-400'>New to Shiny Quest? </p>
                        <p className='font-bold'>Sign Up!</p>
                    </Link>
                </div>
        </form>

    )

}

export default LoginForm;