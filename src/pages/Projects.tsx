/* eslint-disable @typescript-eslint/naming-convention */
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { fadeIn } from "../utils/motion";
import { getProjects } from "../services/supabaseService";
import type { project as Project } from "../types/supabase";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const formatFolioNumber = (value: number) => String(value).padStart(2, "0");

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [[currentImageIndex, direction], setPage] = useState([0, 0]);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useTranslation();

  const paginate = useCallback(
    (newDirection: number) => {
      if (!isTransitioning && project.images.length > 1) {
        setIsTransitioning(true);
        const nextIndex =
          (currentImageIndex + newDirection + project.images.length) %
          project.images.length;
        setPage([nextIndex, newDirection]);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    },
    [currentImageIndex, isTransitioning, project.images.length]
  );

  // Manual image change
  const changeImage = useCallback(
    (index: number) => {
      if (!isTransitioning && index !== currentImageIndex) {
        setIsTransitioning(true);
        const newDirection = index > currentImageIndex ? 1 : -1;
        setPage([index, newDirection]);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    },
    [currentImageIndex, isTransitioning]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Start automatic slideshow if not hovered
    if (!isHovered && project.images.length > 1) {
      interval = setInterval(() => paginate(1), 4500);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isHovered, paginate, project.images.length]);

  return (
    <motion.article
      variants={fadeIn("up", "spring", index * 0.2, 1)}
      className="card-paper flex h-full flex-col overflow-hidden transition-transform duration-150 hover:-translate-y-0.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsTransitioning(false);
      }}
    >
      {/* Image Slideshow */}
      <div className="relative bg-paper-2 p-3">
        <span
          className="tape left-6 top-1 z-30 -rotate-3"
          aria-hidden="true"
        />
        <span
          className="tape right-6 top-1 z-30 rotate-3"
          aria-hidden="true"
        />

        <div className="relative aspect-[16/10] overflow-hidden border border-rule-strong bg-paper-2">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentImageIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 30 },
                opacity: { duration: 0.3 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(_: never, info: PanInfo) => {
                const swipe = swipePower(info.offset.x, info.velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <motion.img
                src={project.images[currentImageIndex]}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                className="h-full w-full object-cover"
                draggable="false"
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>

          {/* Dots Navigation */}
          {project.images.length > 1 && (
            <div
              className="absolute bottom-3 left-1/2 z-40 flex -translate-x-1/2 gap-2 border border-rule px-3 py-2 backdrop-blur-sm"
              style={{
                background:
                  "color-mix(in srgb, var(--paper-0) 82%, transparent)",
              }}
            >
              {project.images.map((_, idx) => (
                <button
                  key={idx}
                  className={`group grid h-8 w-8 place-items-center ${
                    isTransitioning
                      ? "pointer-events-none"
                      : "hover:[&>span]:border-accent hover:[&>span]:bg-accent-soft"
                  }`}
                  onClick={() => changeImage(idx)}
                  disabled={isTransitioning}
                  aria-label={`View image ${idx + 1}`}
                >
                  <span
                    className="h-2 w-2 rounded-full border border-rule-strong transition-colors"
                    style={{
                      background:
                        currentImageIndex === idx
                          ? "var(--accent)"
                          : "var(--ink-300)",
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="t-eyebrow mb-2">
          FOLIO {formatFolioNumber(index + 1)}
        </p>
        <h3 className="t-display-italic text-[28px] leading-tight text-ink-900 sm:text-[32px]">
          {t(project.title)}
        </h3>
        <p className="t-ui mt-3 text-sm leading-6 text-ink-700 sm:text-[15px]">
          {t(project.description)}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="t-mono border border-rule-strong bg-paper-2 px-2.5 py-1 text-[10px] uppercase text-ink-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-3 border-t border-rule pt-5">
          {project.demo ? (
            <a
              href={project.demo}
              className="btn-quill text-accent no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("projects_live_demo")} -&gt;
            </a>
          ) : (
            <span className="t-mono inline-flex items-center border border-rule px-3 py-2 text-[10px] uppercase text-ink-300">
              {t("projects_not_deployed")}
            </span>
          )}
          {project.sourceCode ? (
            <a
              href={project.sourceCode}
              className="btn-quill no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("projects_source_code")}
            </a>
          ) : (
            <span className="t-mono inline-flex items-center border border-rule px-3 py-2 text-[10px] uppercase text-ink-300">
              {t("projects_private")}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const Projects = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch projects"
        );
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-16">
        <div className="plate w-full max-w-sm text-center">
          <p className="t-eyebrow mb-3">Cabinet</p>
          <p className="t-display-italic text-2xl text-ink-900">
            {t("Loading assets...")}
          </p>
          <div className="loading-bar mx-auto mt-6 h-2 w-full max-w-[240px]" />
          <div className="loading-bar mx-auto mt-3 h-2 w-full max-w-[180px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-16">
        <div className="card-paper w-full max-w-md p-6 text-center">
          <p className="t-eyebrow mb-3">Cabinet Interrupted</p>
          <h1 className="t-display-italic text-3xl text-accent">
            Error Loading Projects
          </h1>
          <p className="t-ui mt-4 text-sm leading-6 text-ink-700">{error}</p>
        </div>
      </div>
    );
  }

  const projectCount = formatFolioNumber(projects.length);

  return (
    <>
      <motion.section
        initial="hidden"
        animate="show"
        className="mx-auto min-h-screen max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8"
        aria-labelledby="projects-heading"
      >
        <motion.div variants={fadeIn("up", "spring", 0.5, 1)} className="mb-16">
          <div className="rule-double mb-9 flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-left">
            <span className="t-eyebrow">Cabinet</span>
            <h1
              id="projects-heading"
              className="t-display-italic text-3xl text-ink-900"
            >
              {t("Projects")}
            </h1>
            <span className="t-eyebrow">
              {projectCount} of {projectCount}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id || index}
                project={project}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </motion.section>
      <footer className="t-eyebrow px-4 pb-8 text-center text-ink-300">
        © 2025 Viet Hung Pham. All rights reserved.
      </footer>
    </>
  );
};

export default Projects;
