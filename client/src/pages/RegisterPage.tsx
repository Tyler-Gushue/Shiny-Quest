import logo from '../assets/ShinyQuestLogo.svg';
import RegisterForm from '../features/auth/RegisterForm'
import starBg from '../assets/StarBackground.svg';

function RegisterPage () {

    return (

        <>
            <section id='login-page' className='flex justify-center min-h-screen font-poppins'>

                <section id="left-side" className='relative flex flex-col w-3/7 justify-center bg-gray-900 text-white border-r-2 border-gray-700 pl-8 pr-8 gap-4 overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-850'>

                    <img 
                        src={logo} 
                        alt="" 
                        aria-hidden="true" 
                        className="absolute opacity-6 w-2/3" 
                    />
                    <div 
                        className="absolute inset-0 bg-repeat opacity-3 overflow-hidden"
                        style={{ 
                            backgroundImage: `url(${starBg})`, 
                            backgroundSize: '300px 300px',
                            transform: 'rotate(20deg) scale(1.5)',
                        }}
                    />

                    <div id="logo" className=" flex gap-3 mt-auto text-4xl font-bold">
                        <img src={logo} alt="Shiny Quest logo" className="w-10 h-10" />
                        <h1>Shiny Quest</h1>
                    </div>

                    <div id="Text" className="text-amber-400 text-6xl font-bold w-3/4">
                        <p>
                            Your shiny hunting journey begins here
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

                <section 
                    id="right-side" 
                    className="relative flex flex-1 h-screen bg-gray-950 text-white justify-center flex-col items-center overflow-hidden"
                >
                    <div 
                        className="absolute inset-0 bg-repeat opacity-10"
                        style={{ 
                            backgroundImage: `url(${starBg})`, 
                            backgroundSize: '300px 300px',
                            transform: 'rotate(20deg) scale(1.5)',
                        }}
                    />
                    <div className="relative z-10 flex flex-col items-center">
                        <RegisterForm/>
                    </div>
                </section>

            </section>
        </>


    )

}

export default RegisterPage;