import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative px-6 py-24 sm:px-12 sm:py-32 lg:px-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              Your AI-Powered
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-rose-600">
                Second Brain
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Capture thoughts in 2 seconds, let AI organize them instantly
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link
                href="/signup"
                className="rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 px-8 py-3 text-lg font-semibold text-white shadow-sm hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-white dark:bg-gray-800 px-8 py-3 text-lg font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to augment your thinking
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Designed for the way your mind works, powered by AI
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="rounded-lg bg-cyan-100 dark:bg-cyan-900/20 p-4 mb-4">
                  <span className="text-4xl">⚡</span>
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">
                  2-Second Quick Capture
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">
                    Capture any thought instantly with keyboard shortcuts. Never lose an idea again.
                  </p>
                </dd>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="rounded-lg bg-rose-100 dark:bg-rose-900/20 p-4 mb-4">
                  <span className="text-4xl">🤖</span>
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">
                  AI Auto-Organization
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">
                    AI automatically categorizes, tags, and connects your thoughts. Zero manual effort.
                  </p>
                </dd>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="rounded-lg bg-cyan-100 dark:bg-cyan-900/20 p-4 mb-4">
                  <span className="text-4xl">🌐</span>
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900 dark:text-white">
                  3D Knowledge Network
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">
                    Visualize connections between your thoughts in an interactive 3D network.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </main>
  )
}