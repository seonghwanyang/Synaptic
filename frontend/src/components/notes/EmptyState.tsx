export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="mb-6">
          <svg className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24">
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
            <path 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5}
              d="M13 3v5a2 2 0 002 2h4"
            />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No notes yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Start capturing your thoughts and ideas. They'll appear here automatically.
        </p>

        {/* CTA Button */}
        <button
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all shadow-sm hover:shadow-md"
          onClick={() => {
            // Trigger quick capture
            const event = new KeyboardEvent('keydown', {
              key: 'N',
              shiftKey: true,
              ctrlKey: true,
              bubbles: true
            })
            window.dispatchEvent(event)
          }}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create your first note
        </button>

        {/* Tips */}
        <div className="mt-8 space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 dark:bg-cyan-900/20 rounded-full flex items-center justify-center">
              <span className="text-cyan-600 dark:text-cyan-400 text-xs font-semibold">1</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Quick Capture</p>
              <p>Press Ctrl+Shift+N anywhere to quickly capture a thought</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center">
              <span className="text-rose-600 dark:text-rose-400 text-xs font-semibold">2</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">AI Organization</p>
              <p>Your notes will be automatically categorized and tagged</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 dark:bg-cyan-900/20 rounded-full flex items-center justify-center">
              <span className="text-cyan-600 dark:text-cyan-400 text-xs font-semibold">3</span>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Smart Connections</p>
              <p>Discover relationships between your ideas automatically</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}