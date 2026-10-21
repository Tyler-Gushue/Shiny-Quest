type LoadingSpinnerProps = {
    size?: string;
};

// Same amber spinner style as the one on the 404 page, just reusable
function LoadingSpinner({ size = 'h-16 w-16' }: LoadingSpinnerProps) {

    return (
        <span
            role='status'
            aria-label='Loading'
            className={`${size} block border-6 border-amber-400 border-t-transparent rounded-full animate-spin`}
        />
    )

}

export default LoadingSpinner;
