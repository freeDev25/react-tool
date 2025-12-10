import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';
import type { CanvasElement } from '../types/schema.types';
import { useToast } from '../context/ToastContext';

interface SchemaEditorProps {
  elements: CanvasElement[];
  onElementsChange: (elements: CanvasElement[]) => void;
}

export default function SchemaEditor({ elements, onElementsChange }: SchemaEditorProps) {
  const { showToast } = useToast();
  const [jsonString, setJsonString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

  // Update local state when elements prop changes externally
  useEffect(() => {
    // Only update if the editor content is significantly different to avoid cursor jumping
    // or if we are not currently editing (which is hard to track perfectly, but this helps on initial load)
    const newString = JSON.stringify(elements, null, 2);
    if (editorRef.current) {
      const currentModel = editorRef.current.getModel();
      if (currentModel) {
        const currentValue = currentModel.getValue();
        // Simple check to avoid overwriting work in progress if it parses to the same object
        // But here we trust the prop source of truth if it changes.
        // To avoid loops, we might need to compare parsed objects, but string comparison is safer for now
        // if we assume elements prop only changes when valid.
        if (currentValue !== newString) {
           // Check if the current value is invalid JSON, if so, maybe don't overwrite? 
           // But usually props change means external update.
           // For now, we'll just update local state which feeds the editor default value or value
        }
      }
    }
    setJsonString(newString);
  }, [elements]);

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return;
    setJsonString(value);
    
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        onElementsChange(parsed);
        setError(null);
      } else {
        setError('Root must be an array of elements');
      }
    } catch (err) {
      // Don't update parent state if JSON is invalid, just show error
      setError((err as Error).message);
    }
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure JSON defaults
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      schemas: [],
      enableSchemaRequest: false
    });
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    showToast('JSON copied to clipboard', 'success');
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 border-l border-gray-200">
      <div className="flex justify-between items-center px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-700">Schema Editor</h2>
          {error ? (
            <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Invalid JSON
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Valid
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleFormat}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Format JSON"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Copy to Clipboard"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="json"
          value={jsonString}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            formatOnPaste: true,
            formatOnType: true,
            renderValidationDecorations: 'on'
          }}
        />
      </div>
      {error && (
        <div className="bg-red-50 border-t border-red-100 p-2 text-xs text-red-600 font-mono truncate">
          Error: {error}
        </div>
      )}
    </div>
  );
}
