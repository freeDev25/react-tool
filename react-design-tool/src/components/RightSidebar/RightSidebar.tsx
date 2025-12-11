export const RightSidebar = () => {
  return (
    <aside className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <h2 className="font-semibold text-gray-700">Properties</h2>
      </div>
      <div className="flex-1 p-3">
        {/* Property controls will go here */}
        <div className="text-sm text-gray-500">Right Sidebar Content</div>
      </div>
    </aside>
  );
};
