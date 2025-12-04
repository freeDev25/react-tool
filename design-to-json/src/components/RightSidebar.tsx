interface RightSidebarProps {
  isOpen: boolean;
}

export default function RightSidebar({ isOpen }: RightSidebarProps) {
  return (
    <aside
      className={`bg-gray-50 border-l border-gray-200 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-80' : 'w-0'
      } overflow-hidden`}
    >
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Properties</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Width</label>
              <input
                type="text"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="auto"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Height</label>
              <input
                type="text"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="auto"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Background</label>
              <input
                type="color"
                className="w-full h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
