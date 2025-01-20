/* eslint-disable @typescript-eslint/naming-convention */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import arrow from "../assets/icons/arrow.svg";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


type InfoBoxProps = {
  text: string;
  link: string;
  linkText: string;
  isVisible: boolean;
};

const InfoBox = ({ text, link, linkText, isVisible }: InfoBoxProps) => {

  const themeMode = useSelector((state: RootState) => state.theme.mode);

  return (
    <div
      className={`sm:text-xl sm:leading-snug text-center py-4 px-8 dark:text-white mx-5 flex flex-col items-center gap-4 transition-opacity duration-300 relative z-10
            ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <h1 className="max-w-[700px] text-xl">{text}</h1>
      <Link
        to={link}
        className={`fill-button ${themeMode === 'dark' ? 'fill-button-dark' : ''} group flex items-center justify-center gap-2 px-6 py-2.5 font-semibold text-base rounded-full dark:border-white`}
      >
        {linkText}
        <img
          src={arrow}
          className="w-3.5 h-3.5 brightness-0 dark:invert
                    group-hover:invert dark:group-hover:filter-none"
          draggable="false"
        />
      </Link>
    </div>
  );
};

type HomeInfoProps = {
  currentStage: number | null;
};

const HomeInfo = ({ currentStage }: HomeInfoProps) => {
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState({
    text: "",
    link: "",
    linkText: "",
  });

  useEffect(() => {
    setIsVisible(false);

    const timer = setTimeout(() => {
      if (currentStage === null) {
        setContent({ text: "", link: "", linkText: "" });
      } else {
        switch (currentStage) {
          case 1:
            setContent({
              text: t(
                "In 2020, I first embarked on the path as a self-taught engineer, developing an e-commerce application for a local firm."
              ),
              link: "/about",
              linkText: t("View Project"),
            });
            break;
          case 2:
            setContent({
              text: t(
                "In 2021, I ventured to the U.S to further pursue software engineering in Massachusetts."
              ),
              link: "/about",
              linkText: t("View Project"),
            });
            break;
          case 3:
            setContent({
              text: t(
                "In 2023, I journeyed to the tech hubs of Hangzhou, China to investigate high-technology recruitment and development."
              ),
              link: "/about",
              linkText: t("View Project"),
            });
            break;
          case 4:
            setContent({
              text: t(
                "In 2024, I conquered my final quest before graduation at NVIDIA."
              ),
              link: "/about",
              linkText: t("View Project"),
            });
            break;
        }
        setIsVisible(true);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [currentStage, t]);

  return (
    <InfoBox
      text={content.text}
      link={content.link}
      linkText={content.linkText}
      isVisible={isVisible}
    />
  );
};

export default HomeInfo;
