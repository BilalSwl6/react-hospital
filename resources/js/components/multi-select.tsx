import * as React from "react";
import { X, Loader2 } from "lucide-react";
import { router } from "@inertiajs/react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type SelectValue = string | number;

interface Item {
  [key: string]: any;
}

interface InertiaMultiSelectProps {
  apiEndpoint?: string | null;
  staticOptions?: Item[];
  placeholder?: string;
  defaultValue?: Item[] | Item | string | number; // Updated to allow string or number
  valueKey?: string;
  labelKey?: string;
  dataParser?: (data: any) => Item[];
  onSelectionChange?: (selected?: Item | Item[]) => void; // Changed order for clarity
  className?: string;
  debounceMs?: number;
  limit?: number;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  maxItems?: number;
  allowClear?: boolean;
  loadingText?: string;
  noResultsText?: string;
  errorText?: string;
  creatable?: boolean;
  createItemRenderer?: (query: string) => string;
  createItemFn?: (query: string) => Item;
  renderOption?: (item: Item) => React.ReactNode;
  renderBadge?: (item: Item) => React.ReactNode;
}

// Native debounce implementation
function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  return React.useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

export function InertiaMultiSelect({
  apiEndpoint = null,
  staticOptions = [],
  placeholder = "Select items...",
  defaultValue = [],
  valueKey = "value",
  labelKey = "label",
  dataParser = (data: any) => data,
  onSelectionChange = () => {},
  className = "",
  debounceMs = 500,
  limit = 10,
  id = "",
  name = "",
  required = false,
  disabled = false,
  multiple = true,
  maxItems,
  allowClear = true,
  loadingText = "Loading...",
  noResultsText = "No results found",
  errorText = "Error loading data",
  creatable = false,
  createItemRenderer = (query) => `Create "${query}"`,
  createItemFn = (query) => ({ [valueKey]: query, [labelKey]: query }),
  renderOption,
  renderBadge,
}: InertiaMultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<Item[]>(staticOptions);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Handle single or multiple selection mode
  const [selected, setSelected] = React.useState<Item[]>(() => {
    if (Array.isArray(defaultValue)) {
      return defaultValue;
    } else if (defaultValue && typeof defaultValue === "object") {
      return [defaultValue];
    } else if (defaultValue && (typeof defaultValue === "string" || typeof defaultValue === "number")) {
      // Handle string or number ID as defaultValue
      const matchingOption = staticOptions.find(option => option[valueKey] == defaultValue);
      if (matchingOption) {
        return [matchingOption];
      }
      // If no matching option is found but we have a string/number value,
      // create a placeholder item that will be replaced when options load
      if (defaultValue) {
        return [{ [valueKey]: defaultValue, [labelKey]: "Loading..." }];
      }
    }
    return [];
  });

  // Update selected items if options change and we have placeholder items
  React.useEffect(() => {
    if (options.length > 0 && selected.length > 0) {
      setSelected(prev => {
        return prev.map(item => {
          // If this is likely a placeholder item (checking for "Loading..." label)
          if (item[labelKey] === "Loading..." || Object.keys(item).length === 2) {
            // Try to find the real option
            const realOption = options.find(opt => String(opt[valueKey]) === String(item[valueKey]));
            if (realOption) {
              return realOption;
            }
          }
          return item;
        });
      });
    }
  }, [options, valueKey, labelKey]);

  // Handle clicking outside to close dropdown
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Fetch options function
  const fetchOptionsFunc = React.useCallback(async (query: string) => {
    if (!apiEndpoint) return;

    setLoading(true);
    setError(null);

    try {
      // Using Inertia.js router.get for API requests
      router.get(
        apiEndpoint,
        { query, limit },
        {
          preserveState: true,
          preserveScroll: true,
          onSuccess: (page: any) => {
            // Parse the data using the provided dataParser function
            const parsedData = dataParser(page.props.data || []);
            setOptions(parsedData);
            setLoading(false);
          },
          onError: (errors: any) => {
            console.error("Error fetching options:", errors);
            setError(errorText);
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error("Error fetching options:", error);
      setError(errorText);
      setLoading(false);
    }
  }, [apiEndpoint, dataParser, limit, errorText]);

  // Create a debounced function for API requests using our custom hook
  const fetchOptions = useDebounce(fetchOptionsFunc, debounceMs);

  // Update options when staticOptions change
  React.useEffect(() => {
    if (!apiEndpoint) {
      setOptions(staticOptions);
    }
  }, [staticOptions, apiEndpoint]);

  // Handle input value changes
  React.useEffect(() => {
    if (apiEndpoint && inputValue) {
      fetchOptions(inputValue);
    } else if (apiEndpoint && !inputValue && open) {
      // Reset to empty or fetch initial items when dropdown is opened
      fetchOptions("");
    }
  }, [inputValue, apiEndpoint, fetchOptions, open]);

  // Notify parent component when selection changes
  React.useEffect(() => {
    if (multiple) {
      onSelectionChange(selected);
    } else {
      onSelectionChange(selected.length > 0 ? selected[0] : undefined);
    }
  }, [selected, onSelectionChange, multiple]);

  const handleUnselect = React.useCallback((item: Item) => {
    setSelected((prev) => prev.filter((s) => s[valueKey] !== item[valueKey]));
  }, [valueKey]);

  const handleSelect = React.useCallback((option: Item) => {
    setInputValue("");
    if (!multiple) {
      setSelected([option]);
      setOpen(false);
    } else if (!maxItems || selected.length < maxItems) {
      setSelected((prev) => [...prev, option]);
    }
  }, [multiple, maxItems, selected.length]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if ((e.key === "Delete" || e.key === "Backspace") && inputValue === "" && selected.length > 0 && allowClear) {
        setSelected((prev) => {
          const newSelected = [...prev];
          newSelected.pop();
          return newSelected;
        });
        // Keep dropdown open after removing selection
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        input.blur();
      }
    }
  }, [inputValue, selected.length, allowClear]);

  const clearAll = React.useCallback(() => {
    if (allowClear) {
      setSelected([]);
      // Keep dropdown open after clearing selection
      setOpen(true);
      // Focus the input after clearing
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  }, [allowClear]);

  // Filter out already selected items
  const selectableOptions = React.useMemo(() => {
    let filteredOptions = options.filter(
      (option) => !selected.some((item) => item[valueKey] === option[valueKey])
    );

    // Add "create" option if enabled and there's input text that doesn't match existing options
    if (creatable && inputValue && !options.some(option =>
      option[labelKey].toLowerCase() === inputValue.toLowerCase())
    ) {
      // Add "create new item" option
      const createItem = createItemFn(inputValue);
      filteredOptions = [...filteredOptions, createItem];
    }

    return filteredOptions;
  }, [options, selected, valueKey, creatable, inputValue, createItemFn, labelKey]);

  // Determine if an option is the "create" option
  const isCreateOption = React.useCallback((option: Item) => {
    return creatable && option[valueKey] === inputValue && option[labelKey] === inputValue;
  }, [creatable, inputValue, valueKey, labelKey]);

  // Create a hidden input field for form submission
  const formValue = React.useMemo(() => {
    if (multiple) {
      return selected.map(item => item[valueKey]);
    }
    return selected.length > 0 ? selected[0][valueKey] : '';
  }, [selected, valueKey, multiple]);

  return (
    <div ref={containerRef} className={`relative ${disabled ? 'opacity-70 pointer-events-none' : ''}`}>
      <Command
        onKeyDown={handleKeyDown}
        className={`overflow-visible bg-transparent ${className}`}
      >
        <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1">
            {selected.map((item) => (
              <Badge key={item[valueKey]} variant="secondary">
                {renderBadge ? renderBadge(item) : item[labelKey]}
                {allowClear && (
                  <button
                    type="button"
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </Badge>
            ))}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={(value) => {
                setInputValue(value);
                // Always open dropdown when typing
                if (!open) setOpen(true);
              }}
              onBlur={() => setTimeout(() => setOpen(false), 200)}
              onFocus={() => setOpen(true)}
              placeholder={selected.length === 0 ? placeholder : ""}
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              disabled={disabled}
            />
            {selected.length > 0 && allowClear && (
              <button
                type="button"
                onClick={clearAll}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="relative mt-2">
          <CommandList>
            {open ? (
              <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                <CommandGroup className="h-full max-h-64 overflow-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm text-muted-foreground">{loadingText}</span>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center py-4">
                      <span className="text-sm text-destructive">{error}</span>
                    </div>
                  ) : selectableOptions.length > 0 ? (
                    selectableOptions.map((option) => (
                      <CommandItem
                        key={option[valueKey]}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => handleSelect(option)}
                        className="cursor-pointer"
                      >
                        {isCreateOption(option)
                          ? createItemRenderer(inputValue)
                          : renderOption
                            ? renderOption(option)
                            : option[labelKey]}
                      </CommandItem>
                    ))
                  ) : (
                    <CommandEmpty className="py-4 text-center">
                      <span className="text-sm text-muted-foreground">{noResultsText}</span>
                    </CommandEmpty>
                  )}
                </CommandGroup>
              </div>
            ) : null}
          </CommandList>
        </div>
      </Command>

      {/* Hidden input field for form submission */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={Array.isArray(formValue) ? JSON.stringify(formValue) : formValue}
        required={required}
      />
    </div>
  );
}
