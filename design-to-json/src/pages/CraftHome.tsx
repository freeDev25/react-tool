import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { Container } from '../components/user/Container';
import { Text } from '../components/user/Text';
import { Button } from '../components/user/Button';
import { Image } from '../components/user/Image';
import { Input } from '../components/user/Input';
import { Link } from '../components/user/Link';
import { List, ListItem } from '../components/user/List';
import { Accordion, AccordionItem } from '../craft/utils/Acordian';
import CraftLeftSidebar from '../components/CraftLeftSidebar';
import CraftRightSidebar from '../components/CraftRightSidebar';
import Header from '../components/Header';
import { useState } from 'react';
import { convertCraftToSchema } from '../utils/craft-adapter';

const CraftEditorContent = () => {
  const { query } = useEditor();
  const [viewMode, setViewMode] = useState<'design' | 'preview' | 'json'>('design');

  const handleSave = () => {
    const json = query.serialize();
    const nodes = JSON.parse(json);
    const componentSchema = convertCraftToSchema(nodes);
    
    console.log('Converted Schema:', componentSchema);
    alert(JSON.stringify(componentSchema, null, 2));
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
                  <Element is={Container} canvas background="#ffffff" padding="40px" style={{ minHeight: '800px' }}>
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
    <Editor resolver={{ Container, Text, Button, Image, Input, Link, List, ListItem, Accordion, AccordionItem }}>
      <CraftEditorContent />
    </Editor>
  );
}
