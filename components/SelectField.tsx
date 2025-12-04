'use client'

import { useState, useEffect } from 'react'

interface SelectFieldProps {
  label: string
  value: any
  onChange: (value: any) => void
  options: any[]
  loading?: boolean
  error?: string
  getOptionLabel: (option: any) => string
  getOptionValue: (option: any) => any
  placeholder?: string
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  loading = false,
  error,
  getOptionLabel,
  getOptionValue,
  placeholder = 'Выберите...',
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedLabel = value ? getOptionLabel(value) : placeholder

  const handleSelect = (option: any) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading}
          className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
        >
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {loading ? 'Загрузка...' : (options.length > 0 ? selectedLabel : `${placeholder} (${options.length} доступно)`)}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && !loading && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {options.length === 0 ? (
                <div className="px-4 py-2 text-gray-500 text-sm">Нет данных</div>
              ) : (
                options.map((option) => (
                  <button
                    key={getOptionValue(option)}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      value && getOptionValue(value) === getOptionValue(option)
                        ? 'bg-blue-50 text-blue-900'
                        : ''
                    }`}
                  >
                    {getOptionLabel(option)}
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
    </div>
  )
}

