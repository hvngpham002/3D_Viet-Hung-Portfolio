/* eslint-disable @typescript-eslint/naming-convention */
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";

const skills = [
  { name: "TypeScript", icon: "typescript.svg" },
  { name: "JavaScript", icon: "javascript.svg" },
  { name: "React", icon: "react.svg" },
  { name: "Redux", icon: "redux.svg" },
  { name: "SASS", icon: "sass.svg" },
  { name: "Tailwind", icon: "tailwindcss.svg" },
  { name: "Node.js", icon: "nodejs.svg" },
  { name: "Git", icon: "git.svg" },
];

const experiences = [
  {
    year: "2024-Present",
    company: "NVIDIA",
    role: "Systems Software Engineering Intern",
    country: "usa-flag.png",
    points: [
      "Contributed to NVIDIA Drive OS, NVIDIA’s autonomous vehicles operating system solution, display architecture by integrating host-side tool support for unreleased Tegra system-on-chip (SoC).",
      "Collaborated on updating build profile variants to optimize display performance and expand error reporting.",
    ],
  },
  {
    year: "2023-2024",
    company: "Worcester Polytechnic Institute",
    role: "Student Assistant",
    country: "usa-flag.png",
    points: [
      "Holding regular office hours and grading for programming assignments and exams in courses on algorithms, systems & object-oriented, software engineering courses in Java, C/C++, and the Python Flask framework.",
      "Provide mentorship for teams of four software engineers to build feature-complete applications.",
    ],
  },
  {
    year: "2022-2023",
    company: "New England Clean Energy",
    role: "Technical & Marketing Intern",
    country: "usa-flag.png",
    points: [
      "Maintain social media accounts and website to maximize traffic by complying with best SEO practices.",
      "Aid the technical team with leading-edge AI mapping technology such as Aurora Solar and Google Project Sunroof.",
    ],
  },
  {
    year: "2020-2022",
    company: "Minh Hung Investment & Development JSC",
    role: "Freelance Web Developer",
    country: "vietnam-flag.png",
    points: [
      "Developed an enterprise-grade web-app using CMS-based Laravel framework, and front-end development using Bootstrap.",
      "Collaborate with the marketing team to implement intuitive design & centralized content management.",
    ],
  },
];

const About = () => {
  const { t } = useTranslation();

  return (
    <motion.section
      initial="hidden"
      animate="show"
      className="max-container min-h-screen py-32 px-4 sm:px-6 lg:px-8"
    >
      {/* Hero Section */}
      <motion.div variants={textVariant()} className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold dark:text-white">
          {t("Hello, I'm")}{" "}
          <span className="blue-gradient_text drop-shadow">{t("Hung")}.</span>
        </h1>
      </motion.div>

      {/* Bio Section */}
      <motion.div variants={fadeIn("up", "spring", 0.5, 1)} className="mb-24">
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          {t("about_bio")}
        </p>
      </motion.div>

      {/* Skills Grid */}
      <motion.div variants={fadeIn("up", "spring", 0.7, 1)} className="mb-24">
        <h2 className="text-3xl font-bold mb-8 dark:text-white">
          {t("Skills")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={`/src/assets/icons/${skill.icon}`}
                alt={skill.name}
                className="w-8 h-8 mr-3"
              />
              <span className="text-gray-700 dark:text-gray-300">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Experience Timeline */}
      <motion.div variants={fadeIn("up", "spring", 0.9, 1)}>
        <h2 className="text-3xl font-bold mb-8 dark:text-white">
          {t("Experiences")}
        </h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-16 group">
              <div className="absolute left-0 top-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {exp.year.split("-")[0]}
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-2 justify-between">
                  <h3 className="text-md sm:text-xl font-semibold dark:text-white">
                    {t(exp.role)} @ {t(exp.company)}
                  </h3>
                  <div className="flex items-center gap-1">
                    <img
                      src="/src/assets/icons/gps.png"
                      alt="Location"
                      className="w-5 h-5"
                    />
                    <img
                      src={`/src/assets/icons/${exp.country}`}
                      alt="Country flag"
                      className="w-7 h-7"
                    />
                  </div>
                </div>
                <ul className="list-disc pl-5 space-y-2">
                  {exp.points.map((point, i) => (
                    <li key={i} className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
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
  );
};

export default About;
