import { useState } from 'react'
import { Link } from 'react-router';

function RegisterForm () {

    const [trainerName, setTrainerName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    return (

        <form className="bg-gray-800 border-t-5 border-2 border-t-amber-400 border-gray-700 rounded-xl py-10 px-5">
                <div>
                    <h1 className='text-4xl font-bold'>Create an account</h1>
                    <p className='text-gray-400 mt-3'>Start logging your hunts and shiny catches</p>
                </div>
                <div className='mt-6'>
                    <div className='mb-1'>
                        <label htmlFor='email' className=''>Trainer name</label>
                    </div>
                    <input
                        className='bg-gray-900 w-full py-3 px-2 border-2 border-gray-700 rounded-xl mb-2 hover:border-amber-400 focus:border-amber-400 hover:shadow-xl hover:shadow-amber-400/20 focus:shadow-xl focus:shadow-amber-400/30 focus:outline-none'
                        id='trainerName'
                        type="trainerName"
                        value={trainerName}
                        onChange={(e) => setTrainerName(e.target.value)}
                        placeholder='Trainer#532'
                    />
                </div>
                <div>
                    <div className='mb-1'>
                        <label htmlFor='email' className=''>Email</label>
                    </div>
                    <input
                        className='bg-gray-900 w-full py-3 px-2 border-2 border-gray-700 rounded-xl mb-2 hover:border-amber-400 focus:border-amber-400 hover:shadow-xl hover:shadow-amber-400/20 focus:shadow-xl focus:shadow-amber-400/30 focus:outline-none'
                        id='email'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='example@email.com'
                    />
                </div>
                <div>
                    <div className='mb-1 mt-2'>
                        <label htmlFor='password'>Password</label>
                    </div>
                    <input
                        className='bg-gray-900 w-full py-3 px-2 border-2 border-gray-700 rounded-xl mb-2 hover:border-amber-400 focus:border-amber-400 hover:shadow-xl hover:shadow-amber-400/20 focus:shadow-xl focus:shadow-amber-400/30 focus:outline-none'
                        id='password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                    />
                </div>
                <div className='mb-7'>
                    <div className='mb-1 mt-2'>
                        <label htmlFor='password'>Confirm Password</label>
                    </div>
                    <input
                        className='bg-gray-900 w-full py-3 px-2 border-2 border-gray-700 rounded-xl mb-2 hover:border-amber-400 focus:border-amber-400 hover:shadow-xl hover:shadow-amber-400/20 focus:shadow-xl focus:shadow-amber-400/30 focus:outline-none'
                        id='confirmPassword'
                        type="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder='Confirm Password'
                    />
                </div>
                <div className='flex justify-center flex-col'>
                    <button type="submit" className='bg-amber-400 w-100 py-3 px-1 rounded-xl text-black font-bold text-xl'>Log in</button>
                    <Link to="/login" className=" flex gap-1 text-amber-400 ml-auto mr-auto mt-3">
                        <p className='text-gray-400'>Already have an account? </p>
                        <p className='font-bold'>Log in</p>
                    </Link>
                </div>
        </form>

    )

}

export default RegisterForm;