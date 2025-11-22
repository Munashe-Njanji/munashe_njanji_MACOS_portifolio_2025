import React, { useState } from 'react'

interface CalendarProps {
  currentDate: Date
}

export const Calendar: React.FC<CalendarProps> = ({ currentDate }) => {
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth())
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear)
    const days: (number | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    // Fill remaining cells to always have 6 rows (42 cells total)
    const totalCells = 42
    while (days.length < totalCells) {
      days.push(null)
    }

    return days
  }

  const isToday = (day: number | null) => {
    if (!day) return false
    return (
      day === currentDate.getDate() &&
      selectedMonth === currentDate.getMonth() &&
      selectedYear === currentDate.getFullYear()
    )
  }

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  const goToToday = () => {
    setSelectedMonth(currentDate.getMonth())
    setSelectedYear(currentDate.getFullYear())
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="px-4">
      {/* Current Date Display */}
      <div className="mb-4 text-center">
        <div className="text-2xl font-semibold text-gray-900">
          {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
        </div>
        <div className="text-sm text-gray-600">
          {currentDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
        <div className="text-lg font-medium text-gray-800 mt-1">
          {currentDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
          })}
        </div>
      </div>

      <div className="h-px bg-gray-200 my-3" />

      {/* Month/Year Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goToPreviousMonth}
          className="p-1 rounded hover:bg-gray-200 transition-colors"
          title="Previous Month"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="text-sm font-semibold text-gray-900">
          {monthNames[selectedMonth]} {selectedYear}
        </div>

        <button
          onClick={goToNextMonth}
          className="p-1 rounded hover:bg-gray-200 transition-colors"
          title="Next Month"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid - Fixed 6 rows */}
      <div className="grid grid-cols-7 gap-1 mb-3 h-48">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`
              text-center flex items-center justify-center text-sm rounded
              ${day ? 'hover:bg-gray-100 cursor-pointer' : ''}
              ${
                isToday(day)
                  ? 'bg-blue-500 text-white font-semibold hover:bg-blue-600'
                  : 'text-gray-800'
              }
            `}
          >
            {day || ''}
          </div>
        ))}
      </div>

      {/* Today Button */}
      <button
        onClick={goToToday}
        className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors font-medium"
      >
        Go to Today
      </button>
    </div>
  )
}
