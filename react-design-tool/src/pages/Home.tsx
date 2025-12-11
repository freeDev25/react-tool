import { Editor } from '@craftjs/core';
import { Header } from '../components/Header';
import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';
import { Canvas } from '../components/Canvas';
import { Container } from '../components/user/Container';
import { Text } from '../components/user/Text';
import { Button } from '../components/user/Button';

export const Home = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <Editor resolver={{ Container, Text, Button }}>
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <LeftSidebar />
          <Canvas />
          <RightSidebar />
        </div>
      </Editor>
    </div>
  );
};
