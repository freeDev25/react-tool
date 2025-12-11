export const Header = () => {
  return (
    <header className="h-12 bg-[#2c2c2c] border-b border-black flex items-center px-4 justify-between text-white">
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
           <span className="text-black font-bold text-xs">F</span>
        </div>
        <div className="flex flex-col">
            <h1 className="font-medium text-sm">Untitled Design</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-[#2c2c2c]"></div>
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-[#2c2c2c]"></div>
        </div>
        <button className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Share
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6L9 6" stroke="currentColor" strokeLinecap="round"/>
            </svg>
        </button>
      </div>
    </header>
  );
};
