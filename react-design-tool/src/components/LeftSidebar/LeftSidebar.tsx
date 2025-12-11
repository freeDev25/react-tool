import { useEditor, Element } from '@craftjs/core';
import { Layers } from '@craftjs/layers';
import { Container } from '../../user/Container';
import { Text } from '../../user/Text';
import { Button } from '../../user/Button';
import { useState } from 'react';

export const LeftSidebar = () => {
  const { connectors } = useEditor();
  const [activeTab, setActiveTab] = useState<'layers' | 'assets'>('assets');

  return (
    <aside className="w-64 bg-[#2c2c2c] border-r border-black flex flex-col h-full text-white">
      <div className="flex border-b border-black">
        <button 
            onClick={() => setActiveTab('layers')}
            className={`flex-1 py-3 text-xs font-medium ${activeTab === 'layers' ? 'text-white border-b border-white' : 'text-[#a0a0a0] hover:text-white'}`}
        >
            Layers
        </button>
        <button 
            onClick={() => setActiveTab('assets')}
            className={`flex-1 py-3 text-xs font-medium ${activeTab === 'assets' ? 'text-white border-b border-white' : 'text-[#a0a0a0] hover:text-white'}`}
        >
            Assets
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'layers' ? (
            <div className="pt-2 px-2">
                <Layers expandRootOnLoad={true} />
            </div>
        ) : (
            <div className="p-3">
                <div className="text-[11px] font-bold text-[#a0a0a0] mb-3 uppercase tracking-wider">Basic</div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        ref={(ref: HTMLButtonElement | null) => {
                        if (ref) {
                            connectors.create(ref, <Element is={Container} canvas />);
                        }
                        }}
                        className="aspect-square bg-[#383838] rounded hover:bg-[#444] transition-all flex flex-col items-center justify-center gap-2 cursor-move group"
                    >
                        <div className="w-6 h-6 border-2 border-gray-500 rounded-sm group-hover:border-white transition-colors" />
                        <span className="text-xs text-gray-300 group-hover:text-white">Container</span>
                    </button>
                    <button
                        ref={(ref: HTMLButtonElement | null) => {
                        if (ref) {
                            connectors.create(ref, <Text text="Hi world" />);
                        }
                        }}
                        className="aspect-square bg-[#383838] rounded hover:bg-[#444] transition-all flex flex-col items-center justify-center gap-2 cursor-move group"
                    >
                        <span className="text-gray-500 font-serif font-bold text-lg group-hover:text-white transition-colors">T</span>
                        <span className="text-xs text-gray-300 group-hover:text-white">Text</span>
                    </button>
                    <button
                        ref={(ref: HTMLButtonElement | null) => {
                        if (ref) {
                            connectors.create(ref, <Button text="Click me" />);
                        }
                        }}
                        className="aspect-square bg-[#383838] rounded hover:bg-[#444] transition-all flex flex-col items-center justify-center gap-2 cursor-move group"
                    >
                        <div className="w-6 h-4 bg-blue-600 rounded-sm" />
                        <span className="text-xs text-gray-300 group-hover:text-white">Button</span>
                    </button>
                </div>
            </div>
        )}
      </div>
    </aside>
  );
};
