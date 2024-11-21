﻿import { useCallback } from 'react'

interface Props<T extends string> {
  checked: boolean
  label: T
  toggle: (label: T) => void
}

export function Checkbox<T extends string>({ checked, label, toggle }: Props<T>) {
  const onChange = useCallback(() => {
    toggle(label)
  }, [label, toggle])

  const id = `checkbox-${label}`

  return (
    <div
      role="button"
      className="flex items-center rounded-lg p-0 transition-all bg-amber-800 hover:bg-amber-600 focus:bg-amber-600 active:bg-amber-600"
    >
      <label htmlFor={id} className="flex w-full cursor-pointer items-center px-3 py-2">
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
          <label className="cursor-pointer ml-2 text-white text-sm select-none" htmlFor={id}>
            {label}
          </label>
        </div>
      </label>
    </div>
  )
}
