import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Download, 
  ChevronDown,
  Cloud,
  Server,
  Shield,
  Activity,
  Terminal,
  Menu,
  X
} from 'lucide-react';
import portfolioData from './data/portfolio.json';
import { PortfolioData } from './types/portfolio';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState<{[key: string]: boolean}>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const data = portfolioData as PortfolioData;

  // Memoize navigation sections to avoid recreating on each render
  const navigationSections = useMemo(() => data.navigation.sections, [data.navigation.sections]);

  // Memoize icon mapping to avoid recreating object on each render
  const iconMap = useMemo(() => ({
    "Cloud Architecture": Cloud,
    "Infrastructure": Server,
    "Security": Shield,
    "Monitoring": Activity
  }), []);

  // Memoize contact icon mapping
  const contactIconMap = useMemo(() => ({
    "Email": Mail,
    "LinkedIn": Linkedin,
    "GitHub": Github
  }), []);

  // Throttle function for scroll handler
  const throttleRef = useRef<number | null>(null);
  const lastScrollTime = useRef<number>(0);
  const throttleDelay = 100; // 100ms throttle

  // Extracted scroll check logic
  const performScrollCheck = useCallback(() => {
    const scrollPosition = window.scrollY + 100;
    for (const section of navigationSections) {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;
        
        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          setActiveSection(section);
          break;
        }
      }
    }
  }, [navigationSections]);

  // Memoized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollTime.current < throttleDelay) {
      if (throttleRef.current) {
        cancelAnimationFrame(throttleRef.current);
      }
      throttleRef.current = requestAnimationFrame(() => {
        if (Date.now() - lastScrollTime.current >= throttleDelay) {
          performScrollCheck();
        }
      });
      return;
    }
    lastScrollTime.current = now;
    performScrollCheck();
  }, [performScrollCheck]);

  // Memoized Intersection Observer callback
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const sectionId = entry.target.id;
      if (entry.isIntersecting) {
        setIsVisible(prev => ({
          ...prev,
          [sectionId]: true
        }));
      } else {
        // Reset animation when section leaves viewport
        setIsVisible(prev => ({
          ...prev,
          [sectionId]: false
        }));
      }
    });
  }, []);

  // Memoized observer options
  const observerOptions = useMemo(() => ({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }), []);

  useEffect(() => {
    // Intersection Observer for persistent animations
    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // Observe all sections
    navigationSections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    // Initial scroll check
    performScrollCheck();
    
    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleRef.current) {
        cancelAnimationFrame(throttleRef.current);
      }
      observer.disconnect();
    };
  }, [navigationSections, handleScroll, handleIntersection, observerOptions, performScrollCheck]);

  // Memoized scroll to section handler
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="text-lg sm:text-xl font-bold text-blue-400 animate-pulse">{data.personal.name}</div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-6 xl:space-x-8">
              {navigationSections.map((section, index) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-all duration-300 transform hover:scale-110 animate-fade-in-up text-sm xl:text-base ${
                    activeSection === section 
                      ? 'text-blue-400 font-semibold' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {section === 'hero' ? data.navigation.homeLabel : section}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors duration-300"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-gray-900/98 backdrop-blur-md border-b border-gray-800/50 py-4">
              <div className="flex flex-col space-y-3 px-4">
                {navigationSections.map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`capitalize text-left py-3.5 px-5 rounded-lg transition-all duration-300 font-bold text-base ${
                      activeSection === section 
                        ? 'text-blue-300 bg-blue-900/50 border-2 border-blue-500/60 shadow-xl shadow-blue-900/30' 
                        : 'text-white bg-gray-700/90 hover:text-blue-200 hover:bg-gray-600/90 border-2 border-gray-500/60 shadow-lg'
                    }`}
                  >
                    {section === 'hero' ? data.navigation.homeLabel : section}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10 w-full">
          <div className="mb-6 sm:mb-8">
            {/* Profile Picture */}
            <div className={`transition-all duration-1000 transform ${isVisible.hero ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>
              <div className="relative mx-auto mb-6 sm:mb-8 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full animate-gradient-x p-0.5 sm:p-1">
                  <div className="w-full h-full bg-gray-900 rounded-full p-1 sm:p-2">
                    <picture>
                      <source srcSet={data.personal.profileImage} type="image/webp" />
                      <img
                        src="/photo.JPG"
                        alt={data.personal.altText}
                        width="224"
                        height="224"
                        className="w-full h-full object-cover rounded-full transition-all duration-500 hover:scale-105"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                      />
                    </picture>
                  </div>
                </div>
                
                {/* Floating icons around profile - Only Cloud, Terminal, and Server */}
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

            <div className={`transition-all duration-1000 delay-200 transform ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent animate-gradient-x leading-tight">
                {data.personal.name}
              </h1>
            </div>
            <div className={`transition-all duration-1000 delay-400 transform ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mb-3 sm:mb-4 text-gray-300 leading-tight">
                {data.personal.title}
              </h2>
            </div>
            <div className={`transition-all duration-1000 delay-600 transform ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
                {data.personal.tagline}
              </p>
            </div>
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center transition-all duration-1000 delay-800 transform ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} px-4 sm:px-0`}>
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
                href={data.contact.resume.href}
                download
                className="group px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 text-sm sm:text-base"
              >
                <span className="flex items-center justify-center gap-2">
                  <Download size={18} className="sm:w-5 sm:h-5 group-hover:animate-bounce" />
                  {data.contact.resume.label}
                </span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => scrollToSection('about')}>
          <ChevronDown size={28} className="sm:w-8 sm:h-8 text-gray-400 hover:text-blue-400 transition-colors duration-300" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-gray-800 relative px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 transform ${isVisible.about ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {data.about.title}
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className={`transition-all duration-1000 delay-200 transform ${isVisible.about ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              {data.about.description.map((paragraph, index) => (
                <p key={index} className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                  {paragraph}
                </p>
              ))}
              
              <div className="flex flex-col sm:flex-row sm:space-x-6 lg:space-x-8 space-y-4 sm:space-y-0">
                {data.about.stats.map((stat, index) => (
                  <div key={index} className={`text-center group transition-all duration-1000 transform ${isVisible.about ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: `${400 + index * 100}ms`}}>
                    <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-400 transform ${isVisible.about ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {data.about.expertise.map((item, index) => {
                  const IconComponent = iconMap[item.title as keyof typeof iconMap] || Cloud;
                  return (
                    <div key={index} className={`group bg-gray-700/50 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-xl text-center transition-all duration-1000 transform hover:scale-105 hover:bg-gray-700/70 hover:shadow-2xl border border-gray-600/30 hover:border-gray-500/50 ${isVisible.about ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{transitionDelay: `${600 + index * 100}ms`}}>
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

      {/* Experience Section */}
      <section id="experience" className="py-12 sm:py-16 lg:py-20 relative px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 transform ${isVisible.experience ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {data.experience.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-400 text-center mb-8 sm:mb-12 lg:mb-16 max-w-3xl mx-auto">
              {data.experience.description}
            </p>
          </div>
          
          <div className="relative">
            <div className={`absolute left-4 sm:left-6 lg:left-8 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-green-600 rounded-full transition-all duration-1000 transform ${isVisible.experience ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`} style={{transformOrigin: 'top'}}></div>
            {data.experience.jobs.map((exp, index) => (
              <div key={index} className={`relative flex items-start mb-8 sm:mb-10 lg:mb-12 transition-all duration-1000 transform ${isVisible.experience ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`} style={{transitionDelay: `${200 + index * 200}ms`}}>
                <div className={`absolute left-2.5 sm:left-4 lg:left-6 w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse border-2 sm:border-4 border-gray-900 transition-all duration-1000 transform ${isVisible.experience ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} style={{transitionDelay: `${400 + index * 200}ms`}}></div>
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

      {/* Skills Section */}
      <section id="skills" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-gray-800 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 transform ${isVisible.skills ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {data.skills.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-400 text-center mb-8 sm:mb-12 lg:mb-16 max-w-3xl mx-auto">
              {data.skills.description}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {Object.entries(data.skills.categories).map(([category, skillList], index) => (
              <div key={index} className={`group bg-gradient-to-br from-gray-700/50 to-gray-800/50 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl transition-all duration-1000 transform hover:scale-105 hover:shadow-2xl border border-gray-600/30 hover:border-gray-500/50 ${isVisible.skills ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{transitionDelay: `${index * 150}ms`}}>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">{category}</h3>
                <div className="space-y-2 sm:space-y-3">
                  {skillList.map((skill, skillIndex) => (
                    <div key={skillIndex} className={`flex items-center space-x-2 sm:space-x-3 group/skill transition-all duration-500 transform ${isVisible.skills ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} style={{transitionDelay: `${index * 150 + skillIndex * 50}ms`}}>
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

      {/* Projects Section */}
      <section id="projects" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 transform ${isVisible.projects ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {data.projects.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-400 text-center mb-8 sm:mb-12 lg:mb-16 max-w-3xl mx-auto">
              {data.projects.description}
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {data.projects.items.map((project, index) => (
              <div key={index} className={`group bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl transition-all duration-1000 transform hover:scale-[1.03] hover:shadow-2xl border border-gray-600/30 hover:border-blue-600/50 ${isVisible.projects ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{transitionDelay: `${index * 200}ms`}}>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-300 leading-tight">{project.title}</h3>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{project.description}</p>
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className={`bg-gray-700/50 text-gray-300 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm border border-gray-600/30 hover:bg-gray-600/50 hover:scale-105 transition-all duration-500 transform ${isVisible.projects ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: `${index * 200 + techIndex * 50}ms`}}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className={`text-green-400 font-semibold text-xs sm:text-sm bg-green-900/20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-green-800/30 transition-all duration-1000 transform ${isVisible.projects ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{transitionDelay: `${index * 200 + 300}ms`}}>
                    💡 Impact: {project.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-gray-800 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 transform ${isVisible.contact ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {data.contact.title}
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto text-center">
            <div className={`transition-all duration-1000 delay-200 transform ${isVisible.contact ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 leading-relaxed">
                {data.contact.description}
              </p>
            </div>
            
            <div className={`flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 transition-all duration-1000 delay-400 transform ${isVisible.contact ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              {data.contact.links.map((contact, index) => {
                const IconComponent = contactIconMap[contact.label as keyof typeof contactIconMap] || Mail;
                return (
                  <a
                    key={index}
                    href={contact.href}
                    target={contact.label !== "Email" ? "_blank" : undefined}
                    rel={contact.label !== "Email" ? "noopener noreferrer" : undefined}
                    className={`group flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r ${contact.color} px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl transition-all duration-1000 transform hover:scale-105 hover:shadow-2xl ${isVisible.contact ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} text-sm sm:text-base`}
                    style={{transitionDelay: `${600 + index * 100}ms`}}
                  >
                    <IconComponent size={20} className="sm:w-6 sm:h-6 group-hover:animate-bounce" />
                    <span className="font-semibold">{contact.label}</span>
                  </a>
                );
              })}
            </div>
            
            <div className={`transition-all duration-1000 delay-800 transform ${isVisible.contact ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <a
                href={data.contact.resume.href}
                download
                className="group inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 text-sm sm:text-base"
              >
                <Download size={20} className="sm:w-6 sm:h-6 group-hover:animate-bounce" />
                <span>{data.contact.resume.label}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 sm:py-12 border-t border-gray-800/50 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-blue-400 mb-1 sm:mb-2">{data.footer.name}</h3>
            <p className="text-sm sm:text-base text-gray-400">{data.footer.title}</p>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
            {data.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;