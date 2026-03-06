import { Github, ExternalLink, Shield } from 'lucide-react';
import { Projects as ProjectsType } from '../types/portfolio';

interface ProjectsProps {
  isVisible: boolean;
  projects: ProjectsType;
}

function Projects({ isVisible, projects }: ProjectsProps) {
  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {projects.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-400 text-center mb-8 sm:mb-12 lg:mb-16 max-w-3xl mx-auto">
            {projects.description}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {projects.items.map((project, index) => (
            <div key={index} className={`group bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl transition-all duration-1000 transform hover:scale-[1.03] hover:shadow-2xl border border-gray-600/30 hover:border-blue-600/50 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{transitionDelay: `${index * 200}ms`}}>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-300 leading-tight">{project.title}</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{project.description}</p>
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className={`bg-gray-700/50 text-gray-300 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm border border-gray-600/30 hover:bg-gray-600/50 hover:scale-105 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: `${index * 200 + techIndex * 50}ms`}}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div className={`text-green-400 font-semibold text-xs sm:text-sm bg-green-900/20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-green-800/30 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: `${index * 200 + 300}ms`}}>
                  Impact: {project.impact}
                </div>
              </div>
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-semibold transition-all duration-300 hover:gap-3 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{transitionDelay: `${index * 200 + 400}ms`}}
                >
                  <Github size={16} className="sm:w-5 sm:h-5" />
                  View Repository
                  <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                </a>
              )}
              {project.internal && !project.repo && (
                <div className={`inline-flex items-center gap-2 text-gray-400 text-xs sm:text-sm font-semibold ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: `${index * 200 + 400}ms`}}>
                  <Shield size={16} className="sm:w-5 sm:h-5" />
                  Internal/Proprietary
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
