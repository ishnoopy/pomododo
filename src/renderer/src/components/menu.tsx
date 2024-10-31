import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '@renderer/ThemeContext'

interface MenuProps {
  onSessionTimeChange: (sessionTime: number) => void
  onBreakTimeChange: (breakTime: number) => void
  sessionTime: number
  breakTime: number
  isRunning: boolean
}

function Menu({
  onSessionTimeChange,
  onBreakTimeChange,
  sessionTime,
  breakTime,
  isRunning,
}: MenuProps): JSX.Element {
  const { darkMode, toggleDarkMode } = useTheme()

  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [inputSessionTime, setInputSessionTime] = useState(sessionTime / 60)
  const [inputBreakTime, setInputBreakTime] = useState(breakTime / 60)

  const handleSessionTimeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0.5
    const minutesValue = value * 60
    onSessionTimeChange(minutesValue)
  }

  const handleBreakTimeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0.5
    const minutesValue = value * 60
    onBreakTimeChange(minutesValue)
  }

  const handleSessionTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setInputSessionTime(isNaN(value) ? 0.5 : value)
  }

  const handleBreakTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setInputBreakTime(isNaN(value) ? 0.5 : value)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isInsideMenuClicked = menuRef.current?.contains(event.target as Node)
      const isInsideButtonClicked = buttonRef.current?.contains(event.target as Node)

      if (menuRef.current && !isInsideMenuClicked && !isInsideButtonClicked) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <button
        ref={buttonRef}
        className="text-white text-sm hover:text-white/50 transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreVertRoundedIcon />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            className={`absolute right-1 top-8 bg-emerald-600 border border-emerald-700 rounded-lg shadow-lg p-2 z-50
            ${darkMode ? 'bg-slate-600 border-slate-700' : ''}
            `}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="min-w-[200px] p-4">
              <ul className="space-y-4">
                <li>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="sessionTime" className="text-sm font-medium text-white/90">
                      Flow Duration
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        name="sessionTime"
                        id="sessionTime"
                        value={inputSessionTime}
                        onChange={(e) => handleSessionTimeChange(e)}
                        onBlur={(e) => handleSessionTimeBlur(e)}
                        disabled={isRunning}
                        className={`w-16 px-2 py-1 text-center bg-white/10 text-white rounded-md 
                     border border-white/20 focus:outline-none focus:border-white/40
                     transition-colors ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                      <span className="text-sm text-white/70">minutes</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="breakTime" className="text-sm font-medium text-white/90">
                      Break Duration
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        name="breakTime"
                        id="breakTime"
                        value={inputBreakTime}
                        onChange={(e) => handleBreakTimeChange(e)}
                        onBlur={(e) => handleBreakTimeBlur(e)}
                        disabled={isRunning}
                        className={`w-16 px-2 py-1 text-center bg-white/10 text-white rounded-md 
                     border border-white/20 focus:outline-none focus:border-white/40
                     transition-colors ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                      <span className="text-sm text-white/70">minutes</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-white/90">Theme</p>
                    <button
                      onClick={toggleDarkMode}
                      className={`
            px-3 py-1.5 rounded-md text-sm
            transition-colors duration-200
            ${
              darkMode
                ? 'bg-white/10 hover:bg-white/20'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30'
            }
          `}
                    >
                      {darkMode ? '🌙 Dark' : '☀️ Light'}
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Menu
