/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react'
import { Link } from 'react-router-dom'
import arrow from '../assets/icons/arrow.svg'


const InfoBox = ({ text, link}) => {
    return (
        <div className='sm:text-xl sm:leading-snug text-center py-4 px-8 dark:text-white mx-5 flex flex-col items-center gap-4'>
            <h1 className='max-w-[550px]'>{text}</h1>
            <Link 
                to={link}
                className='fill-button flex items-center justify-center gap-2 px-6 py-3 
                text-white font-semibold text-base rounded-full bg-blue-500'
            >
                Learn More
                <img src={arrow} className="w-4 h-4" />
            </Link>
        </div>
    )
};

const HomeInfo = ({ currentStage }) => {

    switch(currentStage){
        case 1:
            return <InfoBox 
                text="In 2020, I first embarked on the path as a novice, 
                offering my web-dev service to a local firm."
                link="/about"
            />
        case 2:
            return <InfoBox 
                text="In 2021, I ventured to the U.S to pursue higher education at prestige institute."
                link="/about"
            />
        case 3:
            return <InfoBox 
                text="In 2023, I journeyed to the tech hubs of Hangzhou to investigate high-technology recruitment."
                link="/about"
            />
        case 4:
            return <InfoBox 
                text="In 2024, I completed my final quest before graduation at NVIDIA."
                link="/about"
            />
    }

}

export default HomeInfo; 