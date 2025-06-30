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
    <motion.div
      variants={fadeIn("up", "spring", index * 0.2, 1)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsTransitioning(false);
      }}
    >
      {/* Image Slideshow */}
      <div className="relative h-72 bg-gray-100 dark:bg-gray-700 overflow-hidden">
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
            className="absolute inset-0"
          >
            <motion.img
              src={project.images[currentImageIndex]}
              alt={`${project.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              draggable="false"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dots Navigation */}
        {project.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-40 bg-white/50 backdrop-blur-lg rounded-full p-1">
            {project.images.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentImageIndex === idx
                    ? "bg-blue-500"
                    : "bg-gray-300"
                } ${
                  isTransitioning ? "pointer-events-none" : "hover:bg-blue-400"
                }`}
                onClick={() => changeImage(idx)}
                disabled={isTransitioning}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3 dark:text-white">
          {t(project.title)}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
          {t(project.description)}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4 mt-4">
          {project.demo ? (
            <a
              href={project.demo}
              className="text-sm blue-gradient_text font-medium hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("projects_live_demo")}
            </a>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("projects_not_deployed")}
            </span>
          )}
          {project.sourceCode ? (
            <a
              href={project.sourceCode}
              className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("projects_source_code")}
            </a>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("projects_private")}
            </span>
          )}
        </div>
      </div>
    </motion.div>
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h3 className="text-xl font-bold mb-2">Error Loading Projects</h3>
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
        <motion.div variants={fadeIn("up", "spring", 0.5, 1)} className="mb-16">
          <h2 className="text-3xl font-bold mb-8 dark:text-white">
            {t("Projects")}
          </h2>
          <div className="border-b-2 border-gray-200 dark:border-gray-700 w-20 my-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
      <footer className="py-4 text-center text-gray-500 text-sm">
        © 2025 Viet Hung Pham. All rights reserved.
      </footer>
    </>
  );
};

export default Projects;
