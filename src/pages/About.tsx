/* eslint-disable @typescript-eslint/naming-convention */
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { useState, useEffect } from "react";
import { getExperiences, getSkills } from "../services/supabaseService";
import type { experience, skill } from "../types/supabase";
import type { ReactNode } from "react";
import React from "react";

interface RadialMenuItemProps {
  rotate?: number;
  children: ReactNode;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const RadialMenuItem = ({
  rotate = 0,
  children,
  onClick,
}: RadialMenuItemProps) => {
  return (
    <motion.div
      className="absolute w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: Math.cos(rotate * (Math.PI / 180)) * 110 - 16,
        y: Math.sin(rotate * (Math.PI / 180)) * 110 - 16,
      }}
      whileHover={{ scale: 1.2 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  const { t } = useTranslation();
  const [experiences, setExperiences] = useState<experience[]>([]);
  const [skills, setSkills] = useState<skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [experiencesData, skillsData] = await Promise.all([
          getExperiences(),
          getSkills(),
        ]);
        setExperiences(experiencesData);
        setSkills(skillsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h3 className="text-xl font-bold mb-2">Error Loading Data</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.section
        initial="hidden"
        animate="show"
        className="max-container min-h-screen py-32 px-4 sm:px-6 lg:px-8"
      >
        {/* Hero Section */}
        <motion.div
          variants={textVariant()}
          className="mb-8 flex flex-col items-center"
        >
          <div className="relative inline-block profile-container">
            <motion.div className="relative cursor-pointer">
              <img
                src="/images/profile.webp"
                alt="Profile"
                className="w-44 h-44 rounded-full border-4 border-gray-300 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <AnimatePresence>
                  <React.Fragment>
                    {/* <RadialMenuItem
                      rotate={-65}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open("/Viet Hung Resume.pdf", "_blank");
                      }}
                    >
                      <img
                        src="/images/cv.svg"
                        alt="Resume"
                        className="w-6 h-6 invert"
                        loading="lazy"
                      />
                    </RadialMenuItem> */}
                    <RadialMenuItem
                      rotate={-45}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          "https://linkedin.com/in/vhungpham",
                          "_blank"
                        );
                      }}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </RadialMenuItem>
                    <RadialMenuItem
                      rotate={-25}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open("https://github.com/hvngpham002", "_blank");
                      }}
                    >
                      <img
                        src="/icons/github.svg"
                        alt="GitHub"
                        className="w-5 h-5 invert"
                        loading="lazy"
                      />
                    </RadialMenuItem>
                  </React.Fragment>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold dark:text-white mt-4">
            {t("about_greeting")}{" "}
            <span className="blue-gradient_text drop-shadow">
              {t("about_name")}.
            </span>
          </h1>
        </motion.div>

        {/* Bio Section */}
        <motion.div
          variants={fadeIn("up", "spring", 0.5, 1)}
          className="mb-12 md:mb-24"
        >
          <p className="text-base md:text-lg leading-relaxed text-gray-800 dark:text-gray-300 px-4 md:px-0 lg:indent-12">
            {t("about_bio")}
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={fadeIn("up", "spring", 0.7, 1)}
          className="mb-12 md:mb-24"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 dark:text-white px-4 md:px-0">
            {t("about_skills")}
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 px-2 md:px-0">
            {skills.map((skill, index) => (
              <div
                key={skill.id || index}
                className="flex flex-col md:flex-row items-center p-2 md:p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={`/icons/${skill.icon}`}
                  alt={skill.name}
                  className="w-6 h-6 md:w-7 md:h-7 md:mr-3 mb-1 md:mb-0"
                  loading="lazy"
                />
                <span className="text-gray-800 dark:text-gray-300 hidden md:block">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          variants={fadeIn("up", "spring", 0.9, 1)}
          className="px-2 md:px-0"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 dark:text-white">
            {t("about_exp")}
          </h2>
          <div className="relative flex flex-col items-center">
            {/* Central vertical line */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1 bg-gray-200 dark:bg-gray-700 h-full z-0" style={{ minHeight: experiences.length * 180 }} />
            <div className="w-full flex flex-col">
              {experiences.map((exp, index) => {
                const isLeft = index % 2 === 0;
                // Calculate dynamic minHeight based on points length (if available)
                // Use 120px as base, add 24px per point if points exist, else 120px
                const pointsLength = Array.isArray(exp.points) ? exp.points.length : 0;
                const minHeight = 120 + (pointsLength > 0 ? pointsLength * 24 : 0);
                return (
                  <div
                    key={exp.id || index}
                    className={`relative flex w-full items-center z-10
                      ${
                        // On md+ screens, alternate left/right. On small screens, always center.
                        'justify-center md:justify-' + (isLeft ? 'start' : 'end')
                      }
                    `}
                    style={{ minHeight }}
                  >
                    {/* Timeline dot and year */}
                    {/* On mobile, place dot/year inline with card; on md+, keep absolute center */}
                    <div
                      className={
                        `flex flex-col items-center z-20
                        md:absolute md:left-1/2 md:-translate-x-1/2
                        ${
                          // On mobile, put dot to the left of the card
                          'mr-4 md:mr-0'
                        }
                        `
                      }
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center border-2 border-blue-400 shadow-md relative">
                        <img
                          src={`/images/${exp.logo}`}
                          alt={exp.company}
                          className="w-8 h-8 md:w-10 md:h-10 object-contain"
                          loading="lazy"
                        />
                        <img
                          src={`/icons/${exp.country}`}
                          alt="Country flag"
                          className="w-4 h-4 md:w-5 md:h-5 absolute -top-1 -right-1"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-sm md:text-md font-semibold dark:text-white mt-2">
                        {exp.year}
                      </span>
                    </div>
                    {/* Experience card */}
                    <div
                      className={`w-full max-w-xl flex
                        md:w-1/2
                        ${
                          // On md+ screens, alternate left/right. On small screens, always center and row with dot
                          'justify-center items-center flex-row ' +
                          (isLeft ? 'md:pr-16 md:pr-24 md:justify-end' : 'md:pl-16 md:pl-24 md:justify-start')
                        }
                      `}
                    >
                      {/* On mobile, dot/year is already rendered inline; on md+, it's absolutely centered */}
                      <div className="bg-white dark:bg-gray-700 p-3 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full">
                        <div className="flex flex-col">
                          <h3 className="text-lg md:text-xl font-semibold dark:text-white">
                            {t(exp.role)}
                          </h3>
                          <h4 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                            @ {t(exp.company)}
                          </h4>
                        </div>
                        {/* <ul className="list-disc pl-4 md:pl-5 space-y-1 md:space-y-2 mt-2">
                          {exp.points.map((point, pointIndex) => (
                            <li
                              key={pointIndex}
                              className="text-xs md:text-base text-gray-600 dark:text-gray-400"
                            >
                              {t(point)}
                            </li>
                          ))}
                        </ul> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.section>
      <footer className="py-4 text-center text-gray-500 text-sm">
        © 2025 Viet Hung Pham. All rights reserved.
      </footer>
    </>
  );
};

export default About;
