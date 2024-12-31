import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import arrow from '../assets/icons/arrow.svg'

const InfoBox = ({ text, link, linkText, isVisible }) => {
    return (
        <div className={`sm:text-xl sm:leading-snug text-center py-4 px-8 dark:text-white mx-5 flex flex-col items-center gap-4 transition-opacity duration-200
            ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <h1 className='max-w-[700px] text-xl'>{text}</h1>
            <Link 
                to={link}
                className='fill-button group flex items-center justify-center gap-2 px-6 py-2.5 font-semibold text-base rounded-full dark:border-white'
            >
                {linkText}
                <img 
                    src={arrow} 
                    className="w-3.5 h-3.5 brightness-0 dark:invert 
                    group-hover:filter-none dark:group-hover:filter-none"
                    draggable="false"
                />
            </Link>
        </div>
    )
};

const HomeInfo = ({ currentStage }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [content, setContent] = useState({
        text: "",
        link: "",
        linkText: ""
    });

    useEffect(() => {
        setIsVisible(false);
        
        const timer = setTimeout(() => {
            if (currentStage === null) {
                setContent({ text: "", link: "", linkText: "" });
            } else {
                switch(currentStage) {
                    case 1:
                        setContent({
                            text: "In 2020, I first embarked on the path as a self-taught engineer, developing an e-commerce application for a local firm.",
                            link: "/about",
                            linkText: "See Project"
                        });
                        break;
                    case 2:
                        setContent({
                            text: "In 2021, I ventured to the U.S to further pursue software engineering in Massachusetts.",
                            link: "/about",
                            linkText: "See Project"
                        });
                        break;
                    case 3:
                        setContent({
                            text: "In 2023, I journeyed to the tech hubs of Hangzhou, China to investigate high-technology recruitment and development.",
                            link: "/about",
                            linkText: "See Project"
                        });
                        break;
                    case 4:
                        setContent({
                            text: "In 2024, I conquered my final quest before graduation at NVIDIA.",
                            link: "/about",
                            linkText: "See Project"
                        });
                        break;
                }
                setIsVisible(true);
            }
        }, 100); // Reduced from 300ms to 100ms

        return () => clearTimeout(timer);
    }, [currentStage]);

    return (
        <InfoBox 
            text={content.text}
            link={content.link}
            linkText={content.linkText}
            isVisible={isVisible}
        />
    );
}

export default HomeInfo;