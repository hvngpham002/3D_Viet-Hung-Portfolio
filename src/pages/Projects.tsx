/* eslint-disable @typescript-eslint/naming-convention */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "../utils/motion";
import { getProjects } from "../services/supabaseService";
import type { project as Project } from "../services/supabaseService";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === project.images.length - 1 ? 0 : prev + 1
        );
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [project.images.length, isHovered]);

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.2, 1)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Slideshow */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <AnimatePresence initial={false}>
          {project.images.map(
            (image, idx) =>
              currentImageIndex === idx && (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <motion.img
                    src={`/projects/${image}`}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {project.images.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentImageIndex === idx
                  ? "bg-blue-500 dark:bg-blue-400"
                  : "bg-gray-300/80 dark:bg-gray-300/40"
              }`}
              onClick={() => setCurrentImageIndex(idx)}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-3 dark:text-white">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
          {project.description}
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
          <a
            href={project.demo}
            className="text-sm blue-gradient_text font-medium hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Live Demo
          </a>
          <a
            href={project.sourceCode}
            className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source Code
          </a>
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
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
        console.error('Error fetching projects:', err);
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
            <ProjectCard key={project.id || index} project={project} index={index} />
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Projects;
