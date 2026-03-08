import { Mail, Download, ChevronDown, Cloud, Server, Terminal } from 'lucide-react';
import { PersonalInfo, Resume } from '../types/portfolio';

interface HeroProps {
  isVisible: boolean;
  personal: PersonalInfo;
  resume: Resume;
  scrollToSection: (sectionId: string) => void;
}

function Hero({ isVisible, personal, resume, scrollToSection }: HeroProps) {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10 w-full">
        <div className="mb-6 sm:mb-8">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>
            <div className="relative mx-auto mb-6 sm:mb-8 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full animate-gradient-x p-0.5 sm:p-1">
                <div className="w-full h-full bg-gray-900 rounded-full p-1 sm:p-2">
                  <picture>
                    <source srcSet={personal.profileImage} type="image/webp" />
                    <img
                      src="/photo.JPG"
                      alt={personal.altText}
                      width="224"
                      height="224"
                      className="w-full h-full object-cover rounded-full transition-all duration-500 hover:scale-105"
                      loading="eager"
                      fetchpriority="high"
                      decoding="async"
                    />
                  </picture>
                </div>
              </div>

              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 md:-top-4 md:-right-4 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-blue-600/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-float border border-blue-500/30">
                <Cloud className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-blue-400" />
              </div>

              <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 md:-bottom-4 md:-left-4 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-purple-600/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-float border border-purple-500/30" style={{animationDelay: '1s'}}>
                <Server className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-purple-400" />
              </div>

              <div className="absolute top-1/2 -left-3 sm:-left-4 md:-left-5 lg:-left-6 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-green-600/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-float border border-green-500/30" style={{animationDelay: '2s'}}>
                <Terminal className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-green-400" />
              </div>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent animate-gradient-x leading-tight">
              {personal.name}
            </h1>
          </div>
          <div className={`transition-all duration-1000 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mb-3 sm:mb-4 text-gray-300 leading-tight">
              {personal.title}
            </h2>
          </div>
          <div className={`transition-all duration-1000 delay-600 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              {personal.tagline}
            </p>
          </div>
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center transition-all duration-1000 delay-800 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} px-4 sm:px-0`}>
            <button
              onClick={() => scrollToSection('contact')}
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 text-sm sm:text-base"
            >
              <span className="flex items-center justify-center gap-2">
                Get In Touch
                <Mail size={18} className="sm:w-5 sm:h-5 group-hover:animate-bounce" />
              </span>
            </button>
            <a
              href={resume.href}
              download
              className="group px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 text-sm sm:text-base"
            >
              <span className="flex items-center justify-center gap-2">
                <Download size={18} className="sm:w-5 sm:h-5 group-hover:animate-bounce" />
                {resume.label}
              </span>
            </a>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Scroll to About section"
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={() => scrollToSection('about')}
      >
        <ChevronDown size={28} className="sm:w-8 sm:h-8 text-gray-400 hover:text-blue-400 transition-colors duration-300" />
      </button>
    </section>
  );
}

export default Hero;
