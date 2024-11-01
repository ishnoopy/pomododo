import { useEffect, useState } from 'react'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import StopRoundedIcon from '@mui/icons-material/StopRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import useSound from 'use-sound'
import bubbleSound from './assets/bubble-sound.mp3'
import timesUpSound from './assets/level-up.mp3'
import Menu from './components/menu'
import Dots from './components/dots'
import { ThemeProvider } from './ThemeContext'

function App(): JSX.Element {
  const [maxSessionTime, setMaxSessionTime] = useState(25 * 60) // 25 minutes
  const [sessionTime, setSessionTime] = useState(maxSessionTime)
  const [maxBreakTime, setMaxBreakTime] = useState(5 * 60) // 5 minutes
  const [breakTime, setBreakTime] = useState(maxBreakTime)
  const [isBreak, setIsBreak] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [currentDot, setCurrentDot] = useState(0)
  const [numberOfSessions] = useState(4)
  const [playSound] = useSound(bubbleSound)
  const [playTimesUpSound] = useSound(timesUpSound)
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode)
  }

  const timerFunctions = {
    reset: () => {
      setSessionTime(maxSessionTime)
      setBreakTime(maxBreakTime)
      setIsRunning(false)
      setIsBreak(false)
      setSessions(0)
      setCurrentDot(0)
    },

    updateDot: () => {
      // Dot is placed at the start when the session is divisible by the number of sessions
      if (sessions % numberOfSessions === 0) {
        setCurrentDot(0)
      } else {
        // Otherwise, increment the dot
        setCurrentDot((prevDot) => prevDot + 1)
      }
    },

    incrementSession: () => {
      setSessions((prevSessions) => prevSessions + 1)
    },

    handleTimerComplete: () => {
      timerFunctions.incrementSession()
      setSessionTime(maxSessionTime)
      setIsRunning(false)
      playTimesUpSound()
      setIsBreak(true)
      setBreakTime(maxBreakTime)
    },

    handleBreakComplete: () => {
      setIsBreak(false)
      setSessionTime(maxSessionTime)
      setIsRunning(false)
      playSound()
    },

    playSound: () => {
      playSound()
    },

    playTimesUpSound: () => {
      playTimesUpSound()
    }
  }

  const handleReset = () => {
    timerFunctions.reset()
  }

  // Run the timer when the app is running
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      if (isBreak) {
        setBreakTime((prevTime) => prevTime - 1)
      } else {
        setSessionTime((prevTime) => prevTime - 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  // Handle the timer completion for break and session
  useEffect(() => {
    const isBreakTimeOver = isBreak && breakTime === 0
    const isSessionTimeOver = !isBreak && sessionTime === 0

    if (isBreakTimeOver) {
      timerFunctions.handleBreakComplete()
    } else if (isSessionTimeOver) {
      timerFunctions.handleTimerComplete()
    }
  }, [sessionTime, breakTime])

  // Reset the timer when flow duration is changed in the menu
  useEffect(() => {
    timerFunctions.reset()
  }, [maxSessionTime])

  // Reset the break timer when break duration is changed in the menu
  useEffect(() => {
    setBreakTime(maxBreakTime)
  }, [maxBreakTime])

  // Update the dot when the session is incremented
  useEffect(() => {
    timerFunctions.updateDot()
  }, [sessions])

  const formattedTime = `${Math.floor(sessionTime / 60)
    .toString()
    .padStart(2, '0')}:${(sessionTime % 60).toString().padStart(2, '0')}`
  const formattedBreakTime = `${Math.floor(breakTime / 60)
    .toString()
    .padStart(2, '0')}:${(breakTime % 60).toString().padStart(2, '0')}`

  return (
    <>
      <ThemeProvider darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        <div
          className={`${darkMode ? 'bg-slate-800' : 'bg-emerald-800'} flex flex-col items-center justify-center h-screen`}
        >
          <div
            className={`titlebar draggable absolute top-0 left-0 right-0 h-8 ${darkMode ? 'bg-slate-800' : 'bg-emerald-800'}`}
          ></div>
          <div className="toolbar absolute right-1 top-1 flex items-center gap-2 z-50">
            <div className="toolbar-item">
              <button
                className="text-white text-sm hover:text-white/50 transition-colors duration-300"
                onClick={handleReset}
              >
                <RestartAltRoundedIcon />
              </button>
              <Menu
                onSessionTimeChange={setMaxSessionTime}
                onBreakTimeChange={setMaxBreakTime}
                sessionTime={maxSessionTime}
                breakTime={maxBreakTime}
                isRunning={isRunning}
              />
            </div>
          </div>

          <h1 className="text-white text-sm">{isBreak ? 'Break' : 'Session'}</h1>

          <div className="container flex flex-col items-center">
            <h1 className="text-8xl font-bold text-white">
              {isBreak ? formattedBreakTime : formattedTime}
            </h1>
            <div className="">
              <Dots
                numberOfDots={numberOfSessions}
                orientation="horizontal"
                currentDot={currentDot}
                isRunning={isRunning}
              />
            </div>
            <div className="mt-4">
              {isRunning && (
                <button
                  className="bg-rose-600 text-white px-4 py-2 rounded-full hover:bg-rose-700 transition-colors duration-300"
                  onClick={() => {
                    setIsRunning(false)
                    playSound()
                  }}
                >
                  <StopRoundedIcon />
                </button>
              )}
              {!isRunning && (
                <button
                  className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors duration-300"
                  onClick={() => {
                    setIsRunning(true)
                    playSound()
                  }}
                >
                  <PlayArrowRoundedIcon />
                </button>
              )}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
