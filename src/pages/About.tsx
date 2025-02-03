/* eslint-disable @typescript-eslint/naming-convention */
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { useState, useEffect } from "react";
import { getExperiences, getSkills } from "../services/supabaseService";
import type { experience, skill } from "../services/supabaseService";

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
          <img
            src="/images/profile.jpg"
            alt="Profile"
            className="w-44 h-44 rounded-full border-4 border-gray-300 mb-4"
          />
          <h1 className="text-2xl md:text-4xl font-bold dark:text-white">
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
                className="flex flex-col md:flex-row items-center p-2 md:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={`/icons/${skill.icon}`}
                  alt={skill.name}
                  className="w-6 h-6 md:w-7 md:h-7 md:mr-3 mb-1 md:mb-0"
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
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
            {experiences.map((exp, index) => (
              <div
                key={exp.id || index}
                className="relative pl-16 md:pl-20 group"
              >
                <div className="absolute -left-5 top-0 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center relative">
                    <img
                      src={`/images/${exp.logo}`}
                      alt={exp.company}
                      className="w-8 h-8 md:w-10 md:h-10 object-contain"
                    />
                    <img
                      src={`/icons/${exp.country}`}
                      alt="Country flag"
                      className="w-4 h-4 md:w-5 md:h-5 absolute -top-1 -right-1"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs md:text-sm font-medium dark:text-white">
                      {exp.year}
                    </span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex flex-col mb-4">
                    <h3 className="text-lg md:text-xl font-semibold dark:text-white">
                      {t(exp.role)}
                    </h3>
                    <h4 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      @ {t(exp.company)}
                    </h4>
                  </div>
                  <ul className="list-disc pl-4 md:pl-5 space-y-1 md:space-y-2">
                    {exp.points.map((point, pointIndex) => (
                      <li
                        key={pointIndex}
                        className="text-xs md:text-base text-gray-600 dark:text-gray-400"
                      >
                        {t(point)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
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
