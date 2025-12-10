import { Link, useLocation } from 'react-router-dom';

export type ViewMode = 'design' | 'preview' | 'json';

interface HeaderProps {
  onLeftToggle: () => void;
  onRightToggle: () => void;
  componentName: string | null;
  onNewComponent: () => void;
  onSaveSchema: () => void;
  onLoadSchema: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function Header({ 
  onLeftToggle, 
  onRightToggle, 
  componentName, 
  onNewComponent, 
  onSaveSchema,
  onLoadSchema,
  viewMode,
  onViewModeChange
}: HeaderProps) {
  const location = useLocation();
  const isCraft = location.pathname === '/craft';

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onLeftToggle}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Design to JSON</h1>
        
        <div className="flex bg-gray-100 rounded-lg p-1 ml-2">
            <Link 
            to="/" 
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${!isCraft ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
            Standard
            </Link>
            <Link 
            to="/craft" 
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${isCraft ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
            Craft POC
            </Link>
        </div>

        {componentName && (
          <span className="ml-4 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
            {componentName}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {componentName && (
          <div className="flex bg-gray-100 p-1 rounded-lg mr-2">
            <button
              onClick={() => onViewModeChange('design')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                viewMode === 'design'
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Design
            </button>
            <button
              onClick={() => onViewModeChange('preview')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                viewMode === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => onViewModeChange('json')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                viewMode === 'json'
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              JSON
            </button>
          </div>
        )}

        <button
          onClick={onLoadSchema}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Load Schema
        </button>

        <button
          onClick={onNewComponent}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Component
        </button>
        
        <button
          onClick={onSaveSchema}
          disabled={!componentName}
          className={`px-3 py-1.5 text-sm font-medium text-white rounded transition-colors flex items-center gap-2 ${
            componentName 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save Schema
        </button>

        <div className="w-px h-6 bg-gray-200 mx-2"></div>

        <button
          onClick={onRightToggle}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
