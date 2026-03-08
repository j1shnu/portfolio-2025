import { memo } from 'react';
import { Experience as ExperienceType } from '../types/portfolio';

interface ExperienceProps {
  isVisible: boolean;
  experience: ExperienceType;
}

function Experience({ isVisible, experience }: ExperienceProps) {
  return (
    <section id="experience" className="py-12 sm:py-16 lg:py-20 relative px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {experience.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-400 text-center mb-8 sm:mb-12 lg:mb-16 max-w-3xl mx-auto">
            {experience.description}
          </p>
        </div>

        <div className="relative">
          <div className={`absolute left-4 sm:left-6 lg:left-8 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-green-600 rounded-full transition-all duration-1000 transform ${isVisible ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`} style={{transformOrigin: 'top'}}></div>
          {experience.jobs.map((exp, index) => (
            <div key={index} className={`relative flex items-start mb-8 sm:mb-10 lg:mb-12 transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`} style={{transitionDelay: `${200 + index * 200}ms`}}>
              <div className={`absolute left-2.5 sm:left-4 lg:left-6 w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-2 sm:border-4 border-gray-900 transition-all duration-1000 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} style={{transitionDelay: `${400 + index * 200}ms`}}></div>
              <div className="ml-10 sm:ml-16 lg:ml-20 bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl flex-1 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl border border-gray-600/30 hover:border-gray-500/50 group">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors duration-300 leading-tight">{exp.title}</h3>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-300 group-hover:text-white transition-colors duration-300">{exp.company}</p>
                  </div>
                  <span className="text-gray-400 bg-gray-700/50 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm mt-2 lg:mt-0 border border-gray-600/30 inline-block">
                    {exp.period}
                  </span>
                </div>
                {Array.isArray(exp.description) ? (
                  <ul className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300 list-disc list-inside space-y-1">
                    {exp.description.map((item, descIndex) => (
                      <li key={descIndex}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{exp.description}</p>
                )}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {exp.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-blue-900/30 text-blue-300 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm border border-blue-800/30 hover:bg-blue-800/40 hover:scale-105 transition-all duration-300 cursor-default">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Experience);
