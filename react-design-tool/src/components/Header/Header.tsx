export const Header = () => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-2 justify-between">
      <div className="flex items-center gap-4">
        <h1 className="font-bold text-lg text-gray-800">React Design Tool</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Publish
        </button>
      </div>
    </header>
  );
};
