/* eslint-disable @typescript-eslint/naming-convention */
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { useEffect, useMemo, useState } from "react";
import { getExperiences, getSkills } from "../services/supabaseService";
import type { experience, skill } from "../types/supabase";

type SkillGroupDefinition = {
  label: string;
  names: string[];
};

type SkillGroup = {
  label: string;
  skills: skill[];
};

const skillGroupDefinitions: SkillGroupDefinition[] = [
  {
    label: "Languages",
    names: ["TypeScript", "JavaScript", "Python", "Java", "C", "C++"],
  },
  {
    label: "Frontend",
    names: ["React", "Redux", "Tailwind", "SASS"],
  },
  {
    label: "Backend & Tools",
    names: ["Node.js", "Git"],
  },
];

const normalizeSkillName = (name: string) => name.trim().toLowerCase();

const groupSkills = (skills: skill[]): SkillGroup[] => {
  const skillsByName = new Map(
    skills.map((currentSkill) => [
      normalizeSkillName(currentSkill.name),
      currentSkill,
    ])
  );
  const matchedSkillNames = new Set<string>();

  const groupedSkills = skillGroupDefinitions
    .map(({ label, names }) => {
      const matchedSkills = names.flatMap((name) => {
        const normalizedName = normalizeSkillName(name);
        const matchedSkill = skillsByName.get(normalizedName);

        if (!matchedSkill) {
          return [];
        }

        matchedSkillNames.add(normalizedName);
        return [matchedSkill];
      });

      return { label, skills: matchedSkills };
    })
    .filter((group) => group.skills.length > 0);

  const additionalSkills = skills.filter(
    (currentSkill) => !matchedSkillNames.has(normalizeSkillName(currentSkill.name))
  );

  if (additionalSkills.length > 0) {
    groupedSkills.push({
      label: "Additional",
      skills: additionalSkills,
    });
  }

  return groupedSkills;
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

  const skillGroups = useMemo(() => groupSkills(skills), [skills]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-16">
        <div className="plate w-full max-w-sm text-center">
          <p className="t-eyebrow mb-3">Chapter I</p>
          <p className="t-display-italic text-2xl text-ink-900">
            {t("Loading assets...")}
          </p>
          <div className="loading-bar mx-auto mt-6 h-2 w-full max-w-[220px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-16">
        <div className="card-paper w-full max-w-md p-6 text-center">
          <p className="t-eyebrow mb-3">Chapter Interrupted</p>
          <h1 className="t-display-italic text-3xl text-accent">
            Error Loading Data
          </h1>
          <p className="t-ui mt-4 text-sm leading-6 text-ink-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.section
        initial="hidden"
        animate="show"
        className="mx-auto min-h-screen max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={textVariant()}
          className="mb-12 grid items-center gap-8 md:mb-14 lg:grid-cols-[220px_1fr] lg:gap-10"
        >
          <div className="relative justify-self-center lg:justify-self-start">
            <div
              className="w-[196px] p-1.5"
              style={{
                background: "var(--paper-2)",
                border: "1px solid var(--rule-strong)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <img
                src="/images/profile.webp"
                alt={t("about_name")}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 flex gap-2">
              <a
                href="https://linkedin.com/in/vhungpham"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open LinkedIn profile"
                className="seal h-8 w-8 text-[11px] no-underline"
              >
                in
              </a>
              <a
                href="https://github.com/hvngpham002"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open GitHub profile"
                className="seal h-8 w-8 text-[11px] no-underline"
              >
                gh
              </a>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="t-eyebrow">Chapter I · Of the Author</p>
            <h1 className="t-display mt-3 text-[clamp(3.25rem,10vw,5.75rem)] text-ink-900">
              {t("about_greeting")}{" "}
              <em className="text-accent">{t("about_name")}.</em>
            </h1>
            <p className="t-display-italic mx-auto mt-4 max-w-xl text-lg leading-7 text-ink-700 lg:mx-0">
              {t("Welcome to My Journey")}
            </p>
            <div className="hairline fancy mt-8" aria-hidden="true" />
          </div>
        </motion.div>

        <motion.div
          variants={fadeIn("up", "spring", 0.2, 1)}
          className="plate mb-14"
        >
          <p className="t-drop t-ui m-0 text-base leading-8 text-ink-900">
            {t("about_bio")}
          </p>
        </motion.div>

        <motion.section
          variants={fadeIn("up", "spring", 0.35, 1)}
          className="mb-14"
          aria-labelledby="about-skills-heading"
        >
          <div className="rule-double mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="t-eyebrow">Chapter II</span>
            <h2
              id="about-skills-heading"
              className="t-display-italic text-2xl text-ink-900"
            >
              {t("about_skills")}
            </h2>
            <span className="t-eyebrow">{skills.length}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((group) => (
              <article key={group.label} className="plate">
                <p className="t-eyebrow mb-4">{group.label}</p>
                <ul className="grid gap-3">
                  {group.skills.map((currentSkill, index) => (
                    <li
                      key={currentSkill.id ?? `${group.label}-${currentSkill.name}`}
                      className="flex items-center gap-3"
                    >
                      <span
                        className="t-mono grid h-7 w-7 shrink-0 place-items-center border text-[10px] text-ink-500"
                        style={{
                          background: index % 2 === 0 ? "var(--paper-1)" : "var(--paper-0)",
                          borderColor: "var(--rule-strong)",
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="t-display-italic text-lg leading-6 text-ink-900">
                        {currentSkill.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={fadeIn("up", "spring", 0.5, 1)}
          aria-labelledby="about-experience-heading"
        >
          <div className="rule-double mb-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="t-eyebrow">Chapter III</span>
            <h2
              id="about-experience-heading"
              className="t-display-italic text-2xl text-ink-900"
            >
              {t("about_exp")}
            </h2>
            <span className="t-eyebrow">{experiences.length}</span>
          </div>

          <div className="relative">
            <div
              className="absolute bottom-0 left-[18px] top-0 w-px bg-rule-strong md:left-1/2"
              aria-hidden="true"
            />
            <ol className="space-y-7 md:space-y-8">
              {experiences.map((exp, index) => {
                const isLeft = index % 2 === 0;
                const company = t(exp.company);
                const role = t(exp.role);

                return (
                  <li
                    key={exp.id ?? `${exp.year}-${exp.company}`}
                    className="relative pl-14 md:grid md:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] md:items-start md:pl-0"
                  >
                    <div className="absolute left-0 top-4 z-20 md:static md:col-start-2 md:row-start-1 md:flex md:justify-center md:pt-3">
                      <span className="seal h-9 w-9 text-xs">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <article
                      className={`card-paper z-10 p-5 md:row-start-1 md:p-6 ${
                        isLeft
                          ? "md:col-start-1 md:mr-7"
                          : "md:col-start-3 md:ml-7"
                      }`}
                    >
                      <div className="mb-4 flex items-start gap-4">
                        <div
                          className="grid h-11 w-11 shrink-0 place-items-center border p-1.5"
                          style={{
                            background: "var(--paper-2)",
                            borderColor: "var(--rule-strong)",
                          }}
                        >
                          <img
                            src={`/images/${exp.logo}`}
                            alt={company}
                            className="max-h-full max-w-full object-contain"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="t-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                              {exp.year}
                            </span>
                            <img
                              src={`/icons/${exp.country}`}
                              alt=""
                              className="h-4 w-5 object-cover"
                              loading="lazy"
                            />
                          </div>
                          <h3 className="t-display-italic text-2xl leading-7 text-ink-900">
                            {role}
                          </h3>
                          <p className="t-ui mt-1 text-sm font-semibold text-accent">
                            {company}
                          </p>
                        </div>
                      </div>

                      <ul className="t-ui list-disc space-y-2 pl-5 text-sm leading-6 text-ink-500 marker:text-accent">
                        {exp.points.map((point) => (
                          <li key={point}>{t(point)}</li>
                        ))}
                      </ul>
                    </article>
                  </li>
                );
              })}
            </ol>
          </div>
        </motion.section>
      </motion.section>
      <footer className="t-eyebrow px-4 pb-8 text-center text-ink-300">
        © 2025 Viet Hung Pham. All rights reserved.
      </footer>
    </>
  );
};

export default About;
