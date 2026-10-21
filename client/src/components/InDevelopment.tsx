type InDevelopmentProps = {
    pageName: string;
};

// Placeholder card for pages that aren't built yet, styled like the 404 card
function InDevelopment({ pageName }: InDevelopmentProps) {

    return (
        <div className="flex justify-center pt-10 lg:pt-20">
            <section className="w-full max-w-md lg:w-115 lg:max-w-[90vw] px-1 text-center lg:bg-gray-800 lg:border-t-5 lg:border-2 lg:border-t-amber-400 lg:border-gray-700 lg:rounded-xl lg:py-10 lg:px-5">
                <h1 className='text-5xl lg:text-6xl font-bold text-amber-400'>{pageName}</h1>
                <h2 className='text-3xl lg:text-2xl font-bold mt-3'>Still in Development</h2>
                <div className='text-base lg:text-lg text-gray-400 mt-2 lg:mt-3'>
                    <p>This page is still being built. Check back soon!</p>
                </div>
            </section>
        </div>
    )

}

export default InDevelopment;
