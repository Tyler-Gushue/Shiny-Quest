type PasswordStrengthProps = {
    password: string;
};

const LEVELS = [
    { label: 'Weak', barClass: 'bg-red-500', textClass: 'text-red-500' },
    { label: 'Fair', barClass: 'bg-orange-500', textClass: 'text-orange-500' },
    { label: 'Good', barClass: 'bg-amber-400', textClass: 'text-amber-400' },
    { label: 'Strong', barClass: 'bg-green-500', textClass: 'text-green-500' },
]

// Returns 1-4. Anything that doesn't meet the server's rules (8+ chars, lower, upper, number) stays Weak
function getStrength( password: string ) {

    const meetsRules = password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)
    if ( !meetsRules ) return 1

    let score = 2
    if ( password.length >= 12 ) score++
    if ( /[^A-Za-z0-9]/.test(password) ) score++
    return score

}

function PasswordStrength({ password }: PasswordStrengthProps) {

    // Empty password: show all gray bars and a placeholder label until they start typing
    const score = password ? getStrength(password) : 0
    const level = LEVELS[score - 1] ?? { label: 'Strength', barClass: '', textClass: 'text-gray-500' }

    return (

        <div className='flex items-center gap-2 -mt-1 mb-2'>
            <div className='flex flex-1 gap-1'>
                {LEVELS.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${i < score ? level.barClass : 'bg-gray-700'}`}
                    />
                ))}
            </div>
            <span className={`text-sm font-bold w-20 text-right whitespace-nowrap ${level.textClass}`}>{level.label}</span>
        </div>

    )

}

export default PasswordStrength;
