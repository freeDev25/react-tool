import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { Container } from '../components/user/Container';
import { Text } from '../components/user/Text';
import { Button } from '../components/user/Button';
import CraftLeftSidebar from '../components/CraftLeftSidebar';
import CraftRightSidebar from '../components/CraftRightSidebar';
import Header from '../components/Header';
import { useState } from 'react';

const CraftEditorContent = () => {
  const { query } = useEditor();
  const [viewMode, setViewMode] = useState<'design' | 'preview' | 'json'>('design');

  const handleSave = () => {
    const json = query.serialize();
    console.log('Craft.js JSON Output:', json);
    const parsedJson = JSON.stringify(JSON.parse(json), null, 2)
    console.log(parsedJson);
    alert(parsedJson);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header 
        onLeftToggle={() => {}}
        onRightToggle={() => {}}
        componentName="Craft POC"
        onNewComponent={() => {}}
        onSaveSchema={handleSave}
        onLoadSchema={() => {}}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <CraftLeftSidebar />
        
        <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
          <div className="bg-white min-h-[800px] shadow-sm rounded-lg overflow-hidden">
              <Frame>
                  <Element is={Container} canvas background="#ffffff" padding="40px">
                      <Text text="Welcome to the new builder!" fontSize="24px" />
                      <Element is={Container} canvas background="#f3f4f6" padding="20px">
                          <Text text="Drag items here..." fontSize="14px" color="#666" />
                      </Element>
                  </Element>
              </Frame>
          </div>
        </div>

        <CraftRightSidebar />
      </div>
    </div>
  );
};

export default function CraftHome() {
  return (
    <Editor resolver={{ Container, Text, Button }}>
      <CraftEditorContent />
    </Editor>
  );
}
