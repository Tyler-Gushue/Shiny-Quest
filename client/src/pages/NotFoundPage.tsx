import { Link } from 'react-router';
import RecoveryLayout from '../components/RecoveryLayout';
import ShinyQuestLogo from '../assets/ShinyQuestLogo.svg';
import { useAuth } from '../hooks/useAuth';

function NotFoundPage () {

    const { user, isLoading } = useAuth();

    // Logged in users go back to the dashboard, everyone else to login
    const destination = user ? '/dashboard' : '/login';
    const destinationLabel = user ? 'Back to Dashboard' : 'Back to Login';

    return (

        <RecoveryLayout>
            <section id='not-found-page' className="w-full max-w-md lg:w-115 lg:max-w-[90vw] px-1 text-center lg:bg-gray-800 lg:border-t-5 lg:border-2 lg:border-t-amber-400 lg:border-gray-700 lg:rounded-xl lg:py-10 lg:px-5">
                <div id="logo" className="flex justify-center mb-2 lg:mb-6">
                    <img src={ShinyQuestLogo} alt="Shiny Quest logo" className="w-72 lg:w-100" />
                </div>
                <div className='mt-7'>
                    <h1 className='text-7xl lg:text-8xl font-bold text-amber-400'>404</h1>
                    <h2 className='text-3xl lg:text-2xl font-bold mt-3'>Page Not Found</h2>
                    <div className='text-base lg:text-lg text-gray-400 mt-2 lg:mt-3'>
                        <p>The page you're looking for is missing. It may have been moved, deleted, or never existed.</p>
                    </div>
                </div>
                <div className="mt-7">
                    {/* Hold the button until the session restore finishes so the label doesn't flip */}
                    {isLoading ? (
                        <div className='inline-flex justify-center items-center w-full lg:w-100 py-4 lg:py-3'>
                            <span className='h-7 w-7 border-4 border-amber-400 border-t-transparent rounded-full animate-spin' aria-label='Loading' />
                        </div>
                    ) : (
                    <Link
                        to={destination}
                        replace
                        className='inline-flex justify-center items-center bg-amber-400 w-full lg:w-100 py-4 lg:py-3 px-1 rounded-xl text-black font-bold text-xl active:bg-amber-500 active:text-gray-800'
                    >
                        {destinationLabel}
                    </Link>
                    )}
                </div>
            </section>
        </RecoveryLayout>

    )

}

export default NotFoundPage;
