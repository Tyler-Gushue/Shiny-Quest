import { useState } from 'react'
import { Link } from 'react-router';
import ShinyQuestLogo from '../../assets/ShinyQuestLogo.svg';
import { useNavigate } from 'react-router';

function LoginForm () {

    const [email, setEmail] = useState("")
    const navigate = useNavigate();

    function handleSubmit( e: React.FormEvent<HTMLFormElement> ) {

        e.preventDefault();
        navigate("/forgotPassword/verify", { state: { email } });

    }

    return (

        <form className="bg-gray-800 border-t-5 border-2 border-t-amber-400 border-gray-700 rounded-xl py-10 px-5 w-115 max-w-[90vw]" onSubmit={handleSubmit}>
                <div id="logo" className=" flex gap-3 mt-auto text-4xl font-bold justify-center mb-6">
                    <img src={ShinyQuestLogo} alt="Shiny Quest logo" className="w-100" />
                </div>
                <div className='mt-7'>
                    <h1 className='text-2xl font-bold'>Recovery Code</h1>
                    <p className='text-lg text-gray-400 mt-3'>If you've forgotten your password, we can send you a code to reset it.  Please enter your email address below to get started.</p>
                </div>
                <div className='mt-7'>
                    <div className='mb-1 text-xl font-bold'>
                        <label htmlFor='email' className=''>Email</label>
                    </div>
                    <input
                        className='bg-gray-900 text-xl w-full py-3 px-2 border-2 border-gray-700 rounded-xl mb-2 hover:border-amber-400 focus:border-amber-400 hover:shadow-xl hover:shadow-amber-400/20 focus:shadow-xl focus:shadow-amber-400/30 focus:outline-none'
                        id='email'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                    />
                </div>
                <div className="text-center mt-7">
                    <button type="submit" className='bg-amber-400 w-100 py-3 px-1 rounded-xl text-black font-bold text-xl mb-2 active:bg-amber-500 active:text-gray-800'>Submit</button>
                    <Link to="/login" className="text-amber-400 ml-auto font-bold">
                        Back to login
                    </Link>
                </div>
        </form>

    )

}

export default LoginForm;