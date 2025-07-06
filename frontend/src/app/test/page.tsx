'use client'

export default function TestPage() {
  return (
    <div className="p-8 bg-blue-500 text-white">
      <h1 className="text-4xl font-bold">Tailwind Test</h1>
      <button 
        className="mt-4 px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100"
        onClick={() => alert('JavaScript works!')}
      >
        Click to test JS
      </button>
    </div>
  )
}