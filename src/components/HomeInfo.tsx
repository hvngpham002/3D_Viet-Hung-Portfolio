/* eslint-disable @typescript-eslint/naming-convention */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import arrow from "/icons/arrow.svg";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getHomeInfo } from "../services/supabaseService";
import type { homeInfo } from "../services/supabaseService";


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
      className={`text-lg sm:text-lg md:text-xl sm:leading-snug text-center py-3 sm:py-4 px-4 sm:px-8 dark:text-white mx-5 flex flex-col items-center gap-5 transition-opacity duration-300 relative z-10
            ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <h1 className="max-w-[700px] text-base sm:text-base md:text-xl">{text}</h1>
      <Link
        to={link}
        className={`fill-button ${themeMode === 'dark' ? 'fill-button-dark' : ''} group flex items-center justify-center gap-1.5 px-6 py-2.5 font-semibold text-xs sm:text-base rounded-full dark:border-white`}
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
  const [homeInfoData, setHomeInfoData] = useState<homeInfo[]>([]);

  useEffect(() => {
    const fetchHomeInfo = async () => {
      try {
        const data = await getHomeInfo();
        setHomeInfoData(data);
      } catch (error) {
        console.error('Error fetching home info:', error);
      }
    };

    fetchHomeInfo();
  }, []);

  useEffect(() => {
    setIsVisible(false);

    const timer = setTimeout(() => {
      if (currentStage === null) {
        setContent({ text: "", link: "", linkText: "" });
      } else {
        const stageInfo = homeInfoData.find(info => info.stage === currentStage);
        if (stageInfo) {
          setContent({
            text: t(stageInfo.text),
            link: stageInfo.link,
            linkText: t(stageInfo.linkText),
          });
        }
        setIsVisible(true);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [currentStage, homeInfoData, t]);

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
