import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';
import { Canvas } from '../components/Canvas';
import { EditorLeftPanel } from '../components/Editor/EditorLeftPanel';
import { EditorRightPanel } from '../components/Editor/EditorRightPanel';
import { EditorCanvasArea } from '../components/Editor/EditorCanvasArea';

export const Home = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#1e1e1e]">
        <div className="flex-1 flex overflow-hidden">
          <LeftSidebar>
            <EditorLeftPanel />
          </LeftSidebar>
          <Canvas>
            <EditorCanvasArea />
          </Canvas>
          <RightSidebar>
            <EditorRightPanel />
          </RightSidebar>
        </div>
    </div>
  );
};
