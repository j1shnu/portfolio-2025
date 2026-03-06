import { useMemo } from 'react';
import { Home, User, Briefcase, Wrench, FolderKanban, Mail } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
  navigationSections: string[];
  homeLabel: string;
  name: string;
}

function Navbar({ activeSection, scrollToSection, navigationSections, homeLabel, name }: NavbarProps) {
  const mobileDockItems = useMemo(() => ([
    { section: 'hero', label: homeLabel, icon: Home },
    { section: 'about', label: 'About', icon: User },
    { section: 'experience', label: 'Experience', icon: Briefcase },
    { section: 'skills', label: 'Skills', icon: Wrench },
    { section: 'projects', label: 'Projects', icon: FolderKanban },
    { section: 'contact', label: 'Contact', icon: Mail }
  ]), [homeLabel]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-center lg:justify-between items-center">
            <div className="text-lg sm:text-xl font-bold text-blue-400 animate-pulse">{name}</div>

            <div className="hidden lg:flex space-x-6 xl:space-x-8">
              {navigationSections.map((section, index) => (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(section);
                  }}
                  className={`capitalize transition-all duration-300 transform hover:scale-110 animate-fade-in-up text-sm xl:text-base ${
                    activeSection === section
                      ? 'text-blue-400 font-semibold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {section === 'hero' ? homeLabel : section}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-gray-700/60 bg-gray-900/90 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
        style={{ paddingBottom: 'calc(0.4rem + env(safe-area-inset-bottom))' }}
        aria-label="Mobile section navigation"
      >
        <div className="mx-auto grid max-w-3xl grid-cols-6 px-2 pt-2">
          {mobileDockItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.section;
            return (
              <a
                key={item.section}
                href={`#${item.section}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(item.section);
                }}
                className={`mx-0.5 flex min-h-14 flex-col items-center justify-center rounded-lg px-1 py-1.5 text-[10px] leading-none transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.25)]'
                    : 'text-gray-400 hover:bg-gray-800/80 hover:text-gray-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={16} />
                <span className="mt-1 whitespace-nowrap font-semibold">{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
