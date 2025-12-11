import React from 'react';

interface LeftSidebarProps {
  children?: React.ReactNode;
}

export const LeftSidebar = ({ children }: LeftSidebarProps) => {
  return (
    <aside className="w-64 bg-[#2c2c2c] border-r border-black flex flex-col h-full text-white">
      {children}
    </aside>
  );
};
