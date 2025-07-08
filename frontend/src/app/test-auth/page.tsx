'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { api } from '@/lib/api/client'

export default function TestAuthPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [testResult, setTestResult] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      console.log('Session:', session)
    } catch (error) {
      console.error('Session check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testApiCall = async () => {
    try {
      setTestResult('Testing...')
      const result = await api.notes.getAll({ limit: 1 })
      setTestResult({ success: true, data: result })
    } catch (error: any) {
      setTestResult({ success: false, error: error.message })
    }
  }

  const testDirectApiCall = async () => {
    try {
      setTestResult('Testing direct API call...')
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('http://localhost:5000/api/notes?limit=1', {
        headers: {
          'Authorization': session ? `Bearer ${session.access_token}` : '',
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      setTestResult({ 
        success: response.ok, 
        status: response.status,
        data,
        token: session?.access_token ? 'Token exists' : 'No token'
      })
    } catch (error: any) {
      setTestResult({ success: false, error: error.message })
    }
  }

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      if (error) throw error
      setSession(session)
      setTestResult({ success: true, message: 'Session refreshed' })
    } catch (error: any) {
      setTestResult({ success: false, error: error.message })
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Current Session:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="space-x-4 mb-4">
        <button 
          onClick={checkSession}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Check Session
        </button>
        <button 
          onClick={testApiCall}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test API Call
        </button>
        <button 
          onClick={testDirectApiCall}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test Direct API Call
        </button>
        <button 
          onClick={refreshSession}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Refresh Session
        </button>
      </div>

      {testResult && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h2 className="font-bold mb-2">Test Result:</h2>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}