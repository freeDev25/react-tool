import { Header } from '../components/Header';
import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';
import { Canvas } from '../components/Canvas';

export const Home = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar />
        <Canvas />
        <RightSidebar />
      </div>
    </div>
  );
};
