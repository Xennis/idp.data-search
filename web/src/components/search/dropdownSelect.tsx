import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDownIcon } from "lucide-react"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useState } from "react"

export const DropdownSelect = ({
  items,
  placeholder,
  defaultText,
  query,
  setQuery,
}: {
  items: Array<string>
  placeholder: string
  defaultText: string
  query: string
  setQuery: (value: string) => void
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[300px] justify-between">
          {query ? query : defaultText}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={query}
            onValueChange={(val) => {
              setQuery(val)
              //setSelected(null) // reset selection, falls man tippt
            }}
          />
          <CommandList>
            <CommandEmpty>No results. Press Enter for free text.</CommandEmpty>
            {query && (
              <CommandItem
                key={`free-text-${query}`}
                value={query}
                onSelect={(currentValue) => {
                  setQuery(currentValue)
                  setOpen(false)
                }}
              >
                {query} (free text)
              </CommandItem>
            )}
            {items.map((opt) => (
              <CommandItem
                key={`${opt}`}
                value={opt}
                onSelect={(currentValue) => {
                  setQuery(currentValue === query ? "" : currentValue)
                  setOpen(false)
                }}
              >
                {opt}
                <Check className={cn("ml-auto", query === opt ? "opacity-100" : "opacity-0")} />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
