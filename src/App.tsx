import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import portfolioData from './data/portfolio.json';
import { PortfolioData } from './types/portfolio';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TerminalButton from './components/Terminal/TerminalButton';
import TerminalModal from './components/Terminal/TerminalModal';
import { useTerminal } from './components/Terminal/useTerminal';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});

  const data = portfolioData as PortfolioData;
  const terminal = useTerminal(data);

  const navigationSections = useMemo(() => data.navigation.sections, [data.navigation.sections]);

  // Throttle function for scroll handler
  const throttleRef = useRef<number | null>(null);
  const lastScrollTime = useRef<number>(0);
  const visibleSectionsRef = useRef<Set<string>>(new Set());
  const throttleDelay = 100;

  const performScrollCheck = useCallback(() => {
    const scrollPosition = window.scrollY + 100;
    for (const section of navigationSections) {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetBottom = offsetTop + element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          setActiveSection((prev) => (prev === section ? prev : section));
          break;
        }
      }
    }
  }, [navigationSections]);

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

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const sectionId = entry.target.id;
      if (visibleSectionsRef.current.has(sectionId)) {
        return;
      }

      visibleSectionsRef.current.add(sectionId);
      setIsVisible((prev) => {
        if (prev[sectionId]) return prev;
        return {
          ...prev,
          [sectionId]: true
        };
      });
    });
  }, []);

  const observerOptions = useMemo(() => ({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }), []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    navigationSections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    performScrollCheck();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleRef.current) {
        cancelAnimationFrame(throttleRef.current);
      }
      observer.disconnect();
    };
  }, [navigationSections, handleScroll, handleIntersection, observerOptions, performScrollCheck]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (window.location.hash !== `#${sectionId}`) {
        window.history.replaceState(null, '', `#${sectionId}`);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden pb-24 lg:pb-0">
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
        onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
      >
        Skip to content
      </a>

      <Navbar
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        navigationSections={navigationSections}
        homeLabel={data.navigation.homeLabel}
        name={data.personal.name}
      />

      <Hero
        isVisible={!!isVisible.hero}
        personal={data.personal}
        resume={data.contact.resume}
        scrollToSection={scrollToSection}
      />

      <About isVisible={!!isVisible.about} about={data.about} />
      <Experience isVisible={!!isVisible.experience} experience={data.experience} />
      <Skills isVisible={!!isVisible.skills} skills={data.skills} />
      <Projects isVisible={!!isVisible.projects} projects={data.projects} />
      <Contact isVisible={!!isVisible.contact} contact={data.contact} />
      <Footer footer={data.footer} />

      <TerminalButton onClick={terminal.open} />
      <TerminalModal
        isOpen={terminal.isOpen}
        onClose={terminal.close}
        lines={terminal.lines}
        inputValue={terminal.inputValue}
        onInputChange={terminal.setInputValue}
        onKeyDown={terminal.handleKeyDown}
      />
    </div>
  );
}

export default App;
