import { Frame, Element } from '@craftjs/core';
import { Container } from '../user/Container';

export const Canvas = () => {
    return (
        <main className="flex-1 bg-gray-100 h-full overflow-auto">
            <div className="min-h-full w-full flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-4xl h-[800px] shadow-sm rounded-lg border border-gray-200 p-2 overflow-hidden">
                    <Frame>
                        <Element is={Container} canvas />
                    </Frame>
                </div>
            </div>
        </main>
    );
};
