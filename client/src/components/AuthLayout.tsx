import type { ReactNode } from 'react';
import ShinyQuestLogo from '../assets/ShinyQuestLogo.svg';
import StarBackground from './StarBackground';

type AuthLayoutProps = {
    tagline: ReactNode;
    children: ReactNode;
};

function AuthLayout({ tagline, children }: AuthLayoutProps) {
    return (
            <section id='login-page' className='flex justify-center min-h-screen font-display'>

                <section id="left-side" className='relative hidden lg:flex flex-col w-3/7 justify-center bg-gray-900 text-white border-r-2 border-gray-700 pl-8 pr-8 gap-4 overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-850'>

                    <StarBackground opacity="opacity-3"/>

                    <div id="logo" className=" flex gap-3 mt-auto text-4xl font-bold">
                        <img src={ShinyQuestLogo} alt="Shiny Quest logo" className="w-100" />
                    </div>

                    <div id="Text" className="text-amber-400 text-6xl font-bold">
                        {tagline}
                    </div>

                    <div id="bottom-stats" className="flex mt-auto mb-10 text-3xl font-bold">

                        <div className="flex flex-col">
                            <text>- - -</text>
                            <text>Shinies Logged</text>
                        </div>
                        <div className="flex flex-col ml-auto mr-auto">
                            <text>- - -</text>
                            <text>Trainers Joined</text>
                        </div>
                        
                    </div>

                </section>

                <section 
                    id="right-side" 
                    className="relative flex flex-1 min-h-screen lg:h-screen bg-gray-950 text-white justify-center flex-col items-center overflow-hidden px-4 py-10 lg:p-0"
                >
                    <StarBackground/>
                    <div className="relative z-10 flex flex-col items-center w-full lg:w-auto">
                        {/* Mobile only: the left panel is hidden, so show the logo above the form */}
                        <img src={ShinyQuestLogo} alt="Shiny Quest logo" className="lg:hidden w-72 mb-8" />
                        {children}
                    </div>
                </section>

            </section>
    );
}

export default AuthLayout;