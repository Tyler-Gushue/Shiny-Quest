import starBg from '../assets/StarBackground.svg'

type StarBackgroundProps = {
    opacity?: string;
}

function StarBackground({ opacity = 'opacity-10' }: StarBackgroundProps) {

    return (

        <div
            className={ `absolute inset-0 bg-repeat overflow-hidden ${opacity}` }
            style={ { 
                backgroundImage: `url(${starBg})`,
                backgroundSize: '300px 300px',
                transform: 'scale(1.5)',
            }}
        />
    )

}

export default StarBackground