import { Mail, Linkedin, Github, Download } from 'lucide-react';
import { Contact as ContactType } from '../types/portfolio';

const contactIconMap: Record<string, typeof Mail> = {
  mail: Mail,
  linkedin: Linkedin,
  github: Github,
};

interface ContactProps {
  isVisible: boolean;
  contact: ContactType;
}

function Contact({ isVisible, contact }: ContactProps) {
  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-900 to-gray-800 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {contact.title}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <div className={`transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 leading-relaxed">
              {contact.description}
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 transition-all duration-1000 delay-400 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {contact.links.map((link, index) => {
              const IconComponent = contactIconMap[link.icon] || Mail;
              return (
                <a
                  key={index}
                  href={link.href}
                  target={link.label !== "Email" ? "_blank" : undefined}
                  rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
                  className={`group flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r ${link.color} px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl transition-all duration-1000 transform hover:scale-105 hover:shadow-2xl ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} text-sm sm:text-base`}
                  style={{transitionDelay: `${600 + index * 100}ms`}}
                >
                  <IconComponent size={20} className="sm:w-6 sm:h-6 group-hover:animate-bounce" />
                  <span className="font-semibold">{link.label}</span>
                </a>
              );
            })}
          </div>

          <div className={`transition-all duration-1000 delay-800 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <a
              href={contact.resume.href}
              download
              className="group inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 text-sm sm:text-base"
            >
              <Download size={20} className="sm:w-6 sm:h-6 group-hover:animate-bounce" />
              <span>{contact.resume.label}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
