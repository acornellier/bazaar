import { useCallback } from 'react'
import type { IconComponent } from '../data/types.ts'

interface Props<T extends string> {
  checked: boolean
  label: T
  toggle: (label: T) => void
  Icon?: IconComponent
  color?: string
}

export function Checkbox<T extends string>({ checked, label, toggle, Icon, color }: Props<T>) {
  const onChange = useCallback(() => {
    toggle(label)
  }, [label, toggle])

  const id = `checkbox-${label}`

  return (
    <div
      role="button"
      className={`fancy [&]:p-0 [&]:min-h-0 transition-all 
                hover:bg-amber-800 focus:bg-amber-800 active:bg-amber-800 
                ${checked ? '[&]:bg-amber-700' : ''}`}
    >
      <label htmlFor={id} className="flex w-full cursor-pointer items-center px-2 py-1.5">
        <div className="inline-flex items-center">
          <label className="flex items-center cursor-pointer relative" htmlFor={id}>
            <input
              type="checkbox"
              className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
              id={id}
              checked={checked}
              onChange={onChange}
            />
            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
          </label>
          <div className={`flex items-center ml-1.5 gap-0.5`}>
            {Icon && <Icon size={16} className={color} />}
            <label className="cursor-pointer text-sm select-none" htmlFor={id}>
              {label}
            </label>
          </div>
        </div>
      </label>
    </div>
  )
}
