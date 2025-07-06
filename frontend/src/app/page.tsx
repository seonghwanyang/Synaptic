export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to <span className="text-coral-500">Synaptic</span>
        </h1>
        <p className="text-center text-lg text-gray-600 dark:text-gray-400">
          Your AI-powered second brain is being set up...
        </p>
      </div>
    </main>
  )
}