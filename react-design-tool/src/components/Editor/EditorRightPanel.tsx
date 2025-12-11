export const EditorRightPanel = () => {
  return (
    <>
      <div className="px-4 py-3 border-b border-black flex items-center justify-end gap-2">
        <button className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Publish
        </button>
        <button className="px-3 py-1.5 text-xs font-medium bg-[#444] text-white rounded hover:bg-[#555] transition-colors">
          Share
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 border-b border-black">
            <h2 className="text-xs font-bold text-[#a0a0a0] uppercase tracking-wider">Properties</h2>
        </div>
        <div className="p-3">
            <div className="flex flex-col items-center justify-center h-40 text-center opacity-50">
                <div className="w-8 h-8 border-2 border-dashed border-gray-400 rounded mb-2"></div>
                <div className="text-xs text-gray-400">Select a layer to edit properties</div>
            </div>
        </div>
      </div>
    </>
  );
};
