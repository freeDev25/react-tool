import { useState } from 'react';
import StylePanel from './StylePanel';

interface RightSidebarProps {
  isOpen: boolean;
}

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ title, children, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{title}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[65vh] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function RightSidebar({ isOpen }: RightSidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>('style');

  const toggleSection = (section: string) => {
    setActiveSection(prev => (prev === section ? null : section));
  };

  return (
    <aside
      className={`bg-white border-l border-gray-200 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-80' : 'w-0'
      } overflow-hidden flex flex-col h-full`}
    >
      <div className="flex-1 overflow-y-auto">
        <AccordionItem
          title="Layout & Style"
          isOpen={activeSection === 'style'}
          onToggle={() => toggleSection('style')}
        >
          <StylePanel />
        </AccordionItem>

        <AccordionItem
          title="Typography"
          isOpen={activeSection === 'typography'}
          onToggle={() => toggleSection('typography')}
        >
          <div className="p-2 text-xs text-gray-400 text-center">
            Typography settings coming soon
          </div>
        </AccordionItem>

        <AccordionItem
          title="Effects"
          isOpen={activeSection === 'effects'}
          onToggle={() => toggleSection('effects')}
        >
          <div className="p-2 text-xs text-gray-400 text-center">
            Effects settings coming soon
          </div>
        </AccordionItem>
      </div>
    </aside>
  );
}
