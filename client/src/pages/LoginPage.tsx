import logo from '../assets/ShinyQuestLogo.svg';
import LoginForm from '../features/auth/LoginForm'

function LoginPage () {

    return (

        <>
            <section id='login-page' className='flex justify-center min-h-screen font-poppins'>

                <section id="left-side" className='flex flex-col w-3/7 justify-center bg-gray-900 text-white border-r-2 border-gray-700 pl-8 pr-8 gap-4'>

                    <img 
                        src={logo} 
                        alt="" 
                        aria-hidden="true" 
                        className="absolute opacity-6 w-1/3" 
                    />

                    <div id="logo" className=" flex gap-3 mt-auto text-4xl font-bold">
                        <img src={logo} alt="Shiny Quest logo" className="w-10 h-10" />
                        <h1>Shiny Quest</h1>
                    </div>

                    <div id="Text" className="text-amber-400 text-6xl font-bold">
                        <p>
                            Track every shiny,
                        </p>
                        <p>
                            every hunt
                        </p>
                    </div>

                    <div id="bottom-stats" className="flex mt-auto mb-10 text-3xl font-bold">

                        <div className="flex flex-col">
                            <text>14,728</text>
                            <text>Shinnies Logged</text>
                        </div>
                        <div className="flex flex-col ml-auto mr-auto">
                            <text>1,765</text>
                            <text>Trainers Joined</text>
                        </div>
                        
                    </div>

                </section>

                <section id="right-side" className="flex flex-1 bg-gray-950 text-white justify-center flex-col items-center
                    bg-[radial-gradient(circle,#FFE06655_1px,transparent_1px)] bg-[size:20px_20px]">
                    <LoginForm/>
                </section>

            </section>
        </>

    )

}

export default LoginPage;