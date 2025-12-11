import { Frame, Element } from '@craftjs/core';
import { Container } from '../../user/Container';

export const Canvas = () => {
    return (
        <main className="flex-1 bg-[#1e1e1e] h-full overflow-auto relative">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{
                    backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />
            
            <div className="min-h-full w-full flex items-center justify-center p-8 relative z-10">
                <div className="bg-white w-full min-h-[600px] shadow-2xl shadow-black/50 overflow-hidden transition-all">
                    <Frame>
                        <Element is={Container} canvas />
                    </Frame>
                </div>
            </div>
        </main>
    );
};
