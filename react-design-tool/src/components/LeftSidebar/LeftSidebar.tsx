export const LeftSidebar = () => {
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-2 border-b border-gray-200">
        <h2 className="font-semibold text-gray-700">Components</h2>
      </div>
      <div className="flex-1 p-2">
        {/* Draggable items will go here */}
        <div className="text-sm text-gray-500">Left Sidebar Content</div>
      </div>
    </aside>
  );
};
