export default function Canvas() {
  return (
    <main className="flex-1 bg-gray-100 overflow-auto p-2">
      <div className="h-full bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Drop elements here to start designing</p>
        </div>
      </div>
    </main>
  );
}
