import { useTheme } from "@renderer/ThemeContext"

interface DotsProps {
  numberOfDots: number,
  orientation: 'horizontal' | 'vertical',
  currentDot: number,
  isRunning: boolean
}


function Dots({ numberOfDots, orientation, currentDot, isRunning }: DotsProps): JSX.Element {
  const { darkMode } = useTheme()
  
  return (
    <>
      {orientation === 'horizontal' && (
        <div className="flex items-center gap-2">
          {[...Array(numberOfDots)].map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 ${darkMode ? 'bg-slate-600' : 'bg-emerald-600'} rounded-full 
                ${currentDot === index ? 'current-dot' : ''}
                ${isRunning ? 'animate-pulse' : ''}
                `}
            ></div>
          ))}
        </div>
      )}
    </>
  )
}

export default Dots
