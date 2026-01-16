/**
 * Chat Page
 * Main chat interface for product recommendations
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
// import { useSettings } from '@/contexts/SettingsContext'
import { Send, Settings, LogOut, Sparkles, AlertCircle } from 'lucide-react'
import { askAgent } from '../actions';

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const messagesEndRef = useRef(null)
  const router = useRouter()
//   const { apiUrl, apiKey, isConfigured, isLoaded } = useSettings()

  // Check authentication
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }
    checkUser()
  }, [router])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {

      const response = await askAgent(userMessage);

      // const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.text },
      ])
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error.message}. Please check your Agent settings.`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!user ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-pink-400 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Gifts For Her</h1>
            <p className="text-xs text-gray-500">Beauty AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* <button
            onClick={() => router.push('/settings')}
            className="p-2 hover:bg-pink-100 rounded-lg transition"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button> */}
          <button
            onClick={handleSignOut}
            className="p-2 hover:bg-pink-100 rounded-lg transition"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <Sparkles className="w-16 h-16 text-pink-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome! How can I help you today?
            </h2>
            <p className="text-gray-600 mb-6">
              I'm your personal beauty consultant. Ask me about products, recommendations, or specific beauty needs!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
              {[
                'Looking for a moisturizer for dry skin',
                'Best anti-aging serums',
                'Natural makeup for everyday use',
                'Gift ideas under $50',
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="p-3 bg-white/80 border border-pink-200 rounded-lg hover:border-pink-300 hover:bg-white transition text-sm text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white'
                  : 'bg-white/80 backdrop-blur-sm border border-pink-100 text-gray-800'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-2xl px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-pink-100">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-pink-100 bg-white/80 backdrop-blur-sm p-4">
        {/* {!isConfigured() && (
          <div className="max-w-2xl mx-auto mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2 text-sm text-amber-800">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Configuration needed:</strong> Please set your API URL and API Key in{' '}
              <button
                onClick={() => router.push('/settings')}
                className="underline hover:text-amber-900"
              >
                Settings
              </button>
            </div>
          </div>
        )} */}
        <form onSubmit={sendMessage} className="max-w-2xl mx-auto flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about beauty products..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-full border border-pink-200 focus:border-pink-400 focus:ring focus:ring-pink-200 focus:ring-opacity-50 disabled:opacity-50 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full hover:from-pink-500 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}