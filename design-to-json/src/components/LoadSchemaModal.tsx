import React, { useState, useEffect } from 'react';

interface LoadSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (name: string) => void;
  savedSchemas: string[];
}

export default function LoadSchemaModal({ isOpen, onClose, onLoad, savedSchemas }: LoadSchemaModalProps) {
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setSelectedSchema(null);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSchema) {
      onLoad(selectedSchema);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 transform transition-all duration-300 ease-out ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Load Component</h2>
          <p className="text-gray-500 mt-2 text-sm">Select a saved component to continue editing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {savedSchemas.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No saved components found.
              </div>
            ) : (
              savedSchemas.map((name) => (
                <label
                  key={name}
                  className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedSchema === name
                      ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500'
                      : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="schema"
                    value={name}
                    checked={selectedSchema === name}
                    onChange={() => setSelectedSchema(name)}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">{name}</span>
                </label>
              ))
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedSchema}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Load Component
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
