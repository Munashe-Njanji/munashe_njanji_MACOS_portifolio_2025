import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { TerminalStore, TerminalSession } from '@/types'

export const useTerminalStore = create<TerminalStore>()(
  immer((set, get) => ({
    sessions: {},

    createSession: (windowId: string) => {
      const session: TerminalSession = {
        id: windowId,
        cwd: '', // Start in root
        history: [],
        historyIndex: -1,
        output: [
          {
            type: 'output',
            content: 'Welcome to Munashe Njanji macOS Portfolio Terminal',
            timestamp: Date.now(),
          },
          {
            type: 'output',
            content: 'Type "help" for available commands',
            timestamp: Date.now(),
          },
        ],
      }

      set(state => {
        state.sessions[windowId] = session
      })
    },

    executeCommand: (sessionId: string, command: string) => {
      const session = get().sessions[sessionId]
      if (!session) return

      const timestamp = Date.now()

      set(state => {
        const session = state.sessions[sessionId]
        if (!session) return

        // Add command to output
        session.output.push({
          type: 'command',
          content: command,
          timestamp,
        })

        // Parse and execute command
        const parts = command.trim().split(/\s+/)
        const cmd = parts[0]
        const args = parts.slice(1)

        let output = ''
        let isError = false

        switch (cmd) {
          case 'help':
            output = `Available commands:
  ls              List files in current directory
  cd <dir>        Change directory
  pwd             Print working directory
  echo <text>     Display a line of text
  whoami          Print current user
  date            Display current date and time
  history         Show command history
  uname           Print system information
  hostname        Print system hostname
  uptime          Show system uptime
  env             Display environment variables
  which <cmd>     Show command location
  man <cmd>       Show manual page
  clear           Clear terminal output
  help            Show this help message
  
Note: File operations (cat, touch, mkdir, rm) will be integrated with the file system in a future update.`
            break

          case 'clear':
            session.output = []
            return

          case 'pwd':
            output = session.cwd ? `/${session.cwd}` : '/'
            break

          case 'ls':
            // Simulated file listing
            if (session.cwd === '') {
              output = 'Documents/  Desktop/  Downloads/  Pictures/  Music/  Videos/'
            } else if (session.cwd === 'Documents') {
              output = 'README.md  Projects/  Notes.txt'
            } else if (session.cwd === 'Desktop') {
              output = 'Finder.app  Safari.app  Terminal.app'
            } else {
              output = '(empty)'
            }
            break

          case 'cd':
            if (args.length === 0) {
              session.cwd = ''
              output = ''
            } else if (args[0] === '..') {
              // Go up one directory
              const parts = session.cwd.split('/').filter(Boolean)
              parts.pop()
              session.cwd = parts.join('/')
              output = ''
            } else if (args[0] === '/') {
              session.cwd = ''
              output = ''
            } else if (args[0] === '~') {
              session.cwd = ''
              output = ''
            } else {
              // Simple directory navigation
              const validDirs = ['Documents', 'Desktop', 'Downloads', 'Pictures', 'Music', 'Videos', 'Projects']
              if (validDirs.includes(args[0])) {
                session.cwd = session.cwd ? `${session.cwd}/${args[0]}` : args[0]
                output = ''
              } else {
                output = `cd: ${args[0]}: No such file or directory`
                isError = true
              }
            }
            break

          case 'echo':
            output = args.join(' ')
            break

          case 'whoami':
            output = 'user'
            break

          case 'date':
            output = new Date().toString()
            break

          case 'history':
            output = session.history.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n')
            break

          case 'uname':
            if (args.includes('-a')) {
              output = 'macOS Portfolio 1.0.0 Darwin Kernel Version x86_64'
            } else {
              output = 'Darwin'
            }
            break

          case 'hostname':
            output = 'macos-portfolio.local'
            break

          case 'uptime':
            output = 'up 1 day, 2:34, 1 user, load averages: 1.23 1.45 1.67'
            break

          case 'env':
          case 'printenv':
            output = `HOME=/Users/user
PATH=/usr/local/bin:/usr/bin:/bin
SHELL=/bin/zsh
USER=user
TERM=xterm-256color`
            break

          case 'which':
            if (args.length === 0) {
              output = 'which: missing operand'
              isError = true
            } else {
              const commands = ['ls', 'cd', 'pwd', 'cat', 'touch', 'mkdir', 'rm', 'clear', 'echo', 'whoami', 'date', 'help']
              if (commands.includes(args[0])) {
                output = `/usr/bin/${args[0]}`
              } else {
                output = `${args[0]} not found`
                isError = true
              }
            }
            break

          case 'man':
            if (args.length === 0) {
              output = 'What manual page do you want?'
              isError = true
            } else {
              output = `Manual page for ${args[0]} - Use 'help' for available commands`
            }
            break

          case 'cat':
            if (args.length === 0) {
              output = 'cat: missing file operand'
              isError = true
            } else {
              output = `cat: ${args[0]}: File reading will be integrated with file system`
            }
            break

          case 'touch':
            if (args.length === 0) {
              output = 'touch: missing file operand'
              isError = true
            } else {
              output = `touch: ${args[0]}: File creation will be integrated with file system`
            }
            break

          case 'mkdir':
            if (args.length === 0) {
              output = 'mkdir: missing operand'
              isError = true
            } else {
              output = `mkdir: ${args[0]}: Directory creation will be integrated with file system`
            }
            break

          case 'rm':
            if (args.length === 0) {
              output = 'rm: missing operand'
              isError = true
            } else {
              output = `rm: ${args[0]}: File deletion will be integrated with file system`
            }
            break

          case '':
            // Empty command, do nothing
            return

          default:
            output = `${cmd}: command not found`
            isError = true
        }

        // Add output
        if (output) {
          session.output.push({
            type: isError ? 'error' : 'output',
            content: output,
            timestamp: timestamp + 1,
          })
        }

        // Limit output to last 1000 entries
        if (session.output.length > 1000) {
          session.output = session.output.slice(-1000)
        }
      })
    },

    addToHistory: (sessionId: string, command: string) => {
      set(state => {
        const session = state.sessions[sessionId]
        if (!session) return

        // Don't add empty commands or duplicates of the last command
        if (command.trim() && command !== session.history[session.history.length - 1]) {
          session.history.push(command)

          // Limit history to 100 commands
          if (session.history.length > 100) {
            session.history = session.history.slice(-100)
          }
        }

        // Reset history index
        session.historyIndex = session.history.length
      })
    },

    clearSession: (sessionId: string) => {
      set(state => {
        const session = state.sessions[sessionId]
        if (session) {
          session.output = []
        }
      })
    },
  }))
)
