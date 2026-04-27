/* eslint-disable @typescript-eslint/naming-convention */
import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getHomeInfo } from "../services/supabaseService";
import type { homeInfo } from "../types/supabase";


type InfoBoxProps = {
  text: string;
  link: string;
  linkText: string;
  isVisible: boolean;
  stage: number;
};

const stageLabel = (stage: number) => {
  const roman = ["", "I", "II", "III", "IV"][stage] || String(stage);
  return `Stage ${roman}`;
};

const InfoBox = ({ text, link, linkText, isVisible, stage }: InfoBoxProps) => {
  return (
    <div
      className={`mx-5 max-w-2xl transition-opacity duration-150 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="corners relative px-6 py-7 text-center sm:px-8"
        style={{
          background: "color-mix(in srgb, var(--paper-0) 78%, transparent)",
          backdropFilter: "blur(10px)",
          border: "1px solid var(--rule-strong)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <span className="corner-tl" />
        <span className="corner-br" />
        <div className="t-eyebrow mb-3">-- {stageLabel(stage)} --</div>
        {text && (
          <h1
            className="font-display italic text-ink-900"
            style={{
              fontSize: "clamp(18px, 2.4vw, 22px)",
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            "{text}"
          </h1>
        )}
        {link && linkText && (
          <div className="mt-5 flex justify-center">
            <Link to={link} className="btn-quill no-underline">
              {linkText} -&gt;
            </Link>
          </div>
        )}
      </div>
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
      stage={currentStage ?? 1}
    />
  );
};

export default memo(HomeInfo);
