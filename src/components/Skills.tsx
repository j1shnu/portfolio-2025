import { Skills as SkillsType } from '../types/portfolio';

interface SkillsProps {
  isVisible: boolean;
  skills: SkillsType;
}

function Skills({ isVisible, skills }: SkillsProps) {
  return (
    <section id="skills" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-gray-800 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {skills.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-400 text-center mb-8 sm:mb-12 lg:mb-16 max-w-3xl mx-auto">
            {skills.description}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {Object.entries(skills.categories).map(([category, skillList], index) => (
            <div key={index} className={`group bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl transition-all duration-1000 transform hover:scale-105 hover:shadow-2xl border border-gray-600/30 hover:border-gray-500/50 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{transitionDelay: `${index * 150}ms`}}>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">{category}</h3>
              <div className="space-y-2 sm:space-y-3">
                {skillList.map((skill, skillIndex) => (
                  <div key={skillIndex} className={`flex items-center space-x-2 sm:space-x-3 group/skill transition-all duration-500 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} style={{transitionDelay: `${index * 150 + skillIndex * 50}ms`}}>
                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full group-hover/skill:animate-pulse"></div>
                    <span className="text-sm sm:text-base text-gray-300 group-hover/skill:text-white transition-colors duration-300 group-hover/skill:translate-x-1 transform">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
