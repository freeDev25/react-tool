import React from 'react';

interface RightSidebarProps {
  children?: React.ReactNode;
}

export const RightSidebar = ({ children }: RightSidebarProps) => {
  return (
    <aside className="w-64 bg-[#2c2c2c] border-l border-black flex flex-col h-full text-white">
      {children}
    </aside>
  );
};
