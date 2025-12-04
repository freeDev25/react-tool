import { useState } from 'react';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import Canvas from '../components/Canvas';

export default function Home() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen">
      <Header
        onLeftToggle={() => setLeftOpen(!leftOpen)}
        onRightToggle={() => setRightOpen(!rightOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar isOpen={leftOpen} />
        <Canvas />
        <RightSidebar isOpen={rightOpen} />
      </div>
    </div>
  );
}
