import { useState } from 'react'
import { Link } from 'react-router';

function LoginForm () {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    return (

        <form className="bg-gray-800 border-t-5 border-2 border-t-amber-400 border-gray-700 rounded-xl py-10 px-5">
                <div>
                    <h1 className='text-4xl font-bold'>Log in</h1>
                    <p className='text-gray-400 mt-3'>Welcome back!  Pick up where you last left off.</p>
                </div>
                <div className='mt-6'>
                    <div className='mb-1'>
                        <label htmlFor='email' className=''>Email</label>
                    </div>
                    <input
                        className='bg-gray-900 w-full py-3 px-2 border-2 border-gray-700 rounded-xl mb-2'
                        id='email'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                    />
                </div>
                <div>
                    <div className='mb-1 mt-2'>
                        <label htmlFor='password'>Password</label>
                    </div>
                    <input
                        className='bg-gray-900 w-full py-3 px-2 border-2 border-gray-700 rounded-xl mb-2'
                        id='password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                    />
                </div>
                <div className='flex justify-between mx-1 mb-7 mt-2'>
                    <div>
                        <input
                            type="checkbox"
                            id="remember-me"
                            className='accent-amber-400'
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor='remember-me' className='ml-1 text-amber-400'>Remember me</label>
                    </div>
                    <div>
                        <Link to="/forgotPassword" className="text-amber-400 ml-auto">
                            Forgot password?
                        </Link>
                    </div>
                </div>
                <div className='flex justify-center flex-col'>
                    <button type="submit" className='bg-amber-400 w-100 py-3 px-1 rounded-xl text-black font-bold text-xl'>Log in</button>
                    <Link to="/register" className=" flex gap-1 text-amber-400 ml-auto mr-auto mt-3">
                        <p className='text-gray-400'>New to Shiny Quest? </p>
                        <p>Sign Up!</p>
                    </Link>
                </div>
        </form>

    )

}

export default LoginForm;