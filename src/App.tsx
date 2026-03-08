import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
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
import { useTerminal } from './components/Terminal/useTerminal';

const TerminalModal = lazy(() => import('./components/Terminal/TerminalModal'));

const data = portfolioData as PortfolioData;
const navigationSections = data.navigation.sections;

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const visibleSectionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Single observer for fade-in animations (fires once per section)
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const sectionId = entry.target.id;
          if (visibleSectionsRef.current.has(sectionId)) continue;
          visibleSectionsRef.current.add(sectionId);
          setIsVisible((prev) => (prev[sectionId] ? prev : { ...prev, [sectionId]: true }));
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Single observer for active section tracking (fires continuously)
    const navObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection((prev) => (prev === entry.target.id ? prev : entry.target.id));
          }
        }
      },
      { threshold: 0.3 }
    );

    for (const section of navigationSections) {
      const element = document.getElementById(section);
      if (element) {
        visibilityObserver.observe(element);
        navObserver.observe(element);
      }
    }

    return () => {
      visibilityObserver.disconnect();
      navObserver.disconnect();
    };
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (window.location.hash !== `#${sectionId}`) {
        window.history.replaceState(null, '', `#${sectionId}`);
      }
    }
  }, []);

  const terminal = useTerminal(data, scrollToSection);

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

      <main>
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
      </main>
      <Footer footer={data.footer} />

      <TerminalButton onClick={terminal.open} />
      {terminal.isOpen && (
        <Suspense fallback={null}>
          <TerminalModal
            isOpen={terminal.isOpen}
            onClose={terminal.close}
            lines={terminal.lines}
            inputValue={terminal.inputValue}
            onInputChange={terminal.setInputValue}
            onKeyDown={terminal.handleKeyDown}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
