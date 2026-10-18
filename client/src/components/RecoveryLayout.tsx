import type { ReactNode } from 'react';
import StarBackground from './StarBackground';

type RecoveryLayoutProps = {
    children: ReactNode;
};

function RecoveryLayout({ children }: RecoveryLayoutProps) {

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-950 text-white relative overflow-hidden font-display px-4 py-10 lg:p-0">
            <div className="relative z-10 flex flex-col items-center w-full lg:w-auto">
                {children}
            </div>
            <StarBackground />
        </div>
    );
}

export default RecoveryLayout;