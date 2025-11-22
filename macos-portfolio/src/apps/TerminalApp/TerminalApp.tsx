import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTerminalStore, useUIStore } from '@/store'
import type { AppInstance, MenuItem } from '@/types'

interface TerminalAppProps {
  appInstance: AppInstance
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ appInstance }) => {
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const { sessions, createSession, executeCommand, addToHistory, clearSession } =
    useTerminalStore()
  const { showContextMenu } = useUIStore()
  const session = sessions[appInstance.id]

  // Create session on mount
  useEffect(() => {
    if (!session) {
      createSession(appInstance.id)
    }
  }, [appInstance.id, session, createSession])

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [session?.output])

  // Focus input on mount and when clicking terminal
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || !session) return

    // Add to history
    addToHistory(appInstance.id, input)

    // Execute command
    executeCommand(appInstance.id, input)

    // Clear input and reset history index
    setInput('')
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!session) return

    if (e.key === 'Tab') {
      e.preventDefault()
      // Auto-complete command or path
      const parts = input.trim().split(/\s+/)
      const commands = [
        'help', 'ls', 'cd', 'pwd', 'cat', 'touch', 'mkdir', 'rm', 'clear', 
        'echo', 'whoami', 'date', 'history', 'uname', 'hostname', 'uptime', 
        'env', 'printenv', 'which', 'man'
      ].sort()
      
      if (parts.length === 1 && input.trim()) {
        // Complete command name
        const matches = commands.filter(cmd => cmd.startsWith(parts[0]))
        if (matches.length === 1) {
          setInput(matches[0] + ' ')
        } else if (matches.length > 1) {
          // Show available completions
          executeCommand(appInstance.id, `echo ${matches.join('  ')}`)
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (session.history.length > 0) {
        const newIndex =
          historyIndex === -1 ? session.history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(session.history[newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = Math.min(session.history.length - 1, historyIndex + 1)
        if (newIndex === session.history.length - 1 && historyIndex === newIndex) {
          setHistoryIndex(-1)
          setInput('')
        } else {
          setHistoryIndex(newIndex)
          setInput(session.history[newIndex] || '')
        }
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault()
      setInput('')
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      executeCommand(appInstance.id, 'clear')
    }
  }

  const handleTerminalClick = () => {
    inputRef.current?.focus()
  }

  // Handle context menu
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation() // Prevent event from bubbling to desktop

      if (!session) return

      const menuItems: MenuItem[] = [
        {
          id: 'terminal-info',
          label: 'Terminal Information',
          icon: 'ℹ️',
          action: () => {
            alert(
              `Terminal Session\n` +
                `Current Directory: ~/${session.cwd || ''}\n` +
                `History: ${session.history.length} commands\n` +
                `Output Lines: ${session.output.length}`
            )
          },
        },
        {
          id: 'separator-1',
          label: '',
          separator: true,
          action: () => {},
        },
        {
          id: 'clear',
          label: 'Clear Terminal',
          icon: '🧹',
          action: () => clearSession(appInstance.id),
        },
        {
          id: 'copy',
          label: 'Copy Selected Text',
          icon: '📋',
          action: () => {
            const selection = window.getSelection()?.toString()
            if (selection) {
              navigator.clipboard.writeText(selection)
            }
          },
        },
        {
          id: 'separator-2',
          label: '',
          separator: true,
          action: () => {},
        },
        {
          id: 'help',
          label: 'Show Help',
          icon: '❓',
          action: () => executeCommand(appInstance.id, 'help'),
        },
      ]

      showContextMenu(e.clientX, e.clientY, menuItems)
    },
    [session, appInstance.id, clearSession, executeCommand, showContextMenu]
  )

  if (!session) {
    return (
      <div className="w-full h-full bg-black text-white flex items-center justify-center">
        <div className="text-gray-400">Initializing terminal...</div>
      </div>
    )
  }

  const getPrompt = () => {
    return (
      <span>
        <span className="text-green-400">user@macos</span>
        <span className="text-white">:</span>
        <span className="text-blue-400">~/{session.cwd}</span>
        <span className="text-white">$ </span>
      </span>
    )
  }

  return (
    <div
      className="w-full h-full bg-black text-white font-mono text-sm p-4 overflow-hidden flex flex-col"
      onClick={handleTerminalClick}
      onContextMenu={handleContextMenu}
    >
      {/* Output area */}
      <div ref={outputRef} className="flex-1 overflow-y-auto mb-2 space-y-1">
        {session.output.map((line, index) => (
          <div key={`${line.timestamp}-${index}`} className="whitespace-pre-wrap">
            {line.type === 'command' ? (
              <div>
                {getPrompt()}
                <span className="text-white">{line.content}</span>
              </div>
            ) : (
              <div
                className={
                  line.type === 'error'
                    ? 'text-red-400'
                    : line.type === 'output'
                      ? 'text-gray-300'
                      : 'text-white'
                }
              >
                {line.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="flex-shrink-0">{getPrompt()}</div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white outline-none border-none font-mono focus:outline-none focus:ring-0 focus-visible:outline-none"
          style={{ border: 'none', boxShadow: 'none', outline: 'none' }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </form>
    </div>
  )
}
