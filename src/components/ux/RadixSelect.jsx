// components/ui/RadixSelect.js

import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

export default function RadixSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  label = "",
}) {
  return (
    <div className="w-full">
      {label && <label className="mb-1 block text-gray-600">{label}</label>}
      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger
          className="inline-flex items-center justify-between w-full rounded border border-gray-300 px-3 py-2 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={label}
        >
          <Select.Value placeholder={placeholder}>
            {options.find((opt) => opt.value === value)?.label}
          </Select.Value>
          <Select.Icon className="ml-2">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="overflow-hidden bg-white border border-gray-200 rounded shadow-lg max-h-60"
            position="popper"
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-gray-100 text-gray-600">
              ↑
            </Select.ScrollUpButton>

            <Select.Viewport className="p-1">
              {options.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value.toString()}
                  className={clsx(
                    "text-sm px-3 py-2 rounded cursor-pointer flex items-center justify-between text-gray-800",
                    "hover:bg-blue-100 focus:bg-blue-100 radix-disabled:opacity-50"
                  )}
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <CheckIcon className="w-4 h-4 text-blue-600" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>

            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-100 text-gray-600">
              ↓
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
