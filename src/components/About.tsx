import { Cloud, Server, Shield, Activity } from 'lucide-react';
import { About as AboutType } from '../types/portfolio';

const iconMap: Record<string, typeof Cloud> = {
  cloud: Cloud,
  server: Server,
  shield: Shield,
  activity: Activity,
};

interface AboutProps {
  isVisible: boolean;
  about: AboutType;
}

function About({ isVisible, about }: AboutProps) {
  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {about.title}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className={`transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            {about.description.map((paragraph, index) => (
              <p key={index} className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                {paragraph}
              </p>
            ))}

            <div className="flex flex-col sm:flex-row sm:space-x-6 lg:space-x-8 space-y-4 sm:space-y-0">
              {about.stats.map((stat, index) => (
                <div key={index} className={`text-center group transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: `${400 + index * 100}ms`}}>
                  <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-400 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {about.expertise.map((item, index) => {
                const IconComponent = iconMap[item.icon] || Cloud;
                return (
                  <div key={index} className={`group bg-gray-700/50 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-xl text-center transition-all duration-1000 transform hover:scale-105 hover:bg-gray-700/70 hover:shadow-2xl border border-gray-600/30 hover:border-gray-500/50 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{transitionDelay: `${600 + index * 100}ms`}}>
                    <IconComponent size={32} className={`sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-3 lg:mb-4 ${item.color} group-hover:animate-pulse transition-all duration-300`} />
                    <h3 className="font-semibold mb-1 sm:mb-2 text-white group-hover:text-gray-100 text-sm sm:text-base">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 leading-tight">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
