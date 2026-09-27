import type { ReactNode } from 'react';
import StarBackground from './StarBackground';

type RecoveryLayoutProps = {
    children: ReactNode;
};

function RecoveryLayout({ children }: RecoveryLayoutProps) {

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-950 text-white relative overflow-hidden font-display">
            <div className="relative z-10">
                {children}
            </div>
            <StarBackground />
        </div>
    );
}

export default RecoveryLayout;