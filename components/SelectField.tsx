'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

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
      <label className="flex items-center gap-2 text-sm leading-none font-medium select-none">
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !loading && setIsOpen(!isOpen)}
          disabled={loading}
          className="flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground data-[size=default]:h-8 w-full"
        >
          <span className={value ? '' : 'text-muted-foreground'}>
            {loading ? 'Загрузка...' : selectedLabel}
          </span>
          <ChevronDown className="size-4 text-muted-foreground pointer-events-none" />
        </button>

        {isOpen && !loading && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {options.length === 0 ? (
                <div className="px-4 py-2 text-muted-foreground text-sm">Нет данных</div>
              ) : (
                options.map((option) => (
                  <button
                    key={getOptionValue(option)}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-2 hover:bg-accent ${
                      value && getOptionValue(value) === getOptionValue(option)
                        ? 'bg-accent'
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
        <div className="text-destructive text-sm">{error}</div>
      )}
    </div>
  )
}