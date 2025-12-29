import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { VENUE_TYPES, getVenueTypeLabel } from '@/lib/constants/venue-types';

interface VenueTypeSelectorProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function VenueTypeSelector({
    value,
    onChange,
    placeholder = "Select venue type...",
    disabled = false
}: VenueTypeSelectorProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {value ? getVenueTypeLabel(value) : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search venue types..." />
                    <CommandEmpty>No venue type found.</CommandEmpty>
                    <div className="max-h-[300px] overflow-y-auto">
                        {VENUE_TYPES.map((category) => (
                            <CommandGroup key={category.category} heading={category.category}>
                                {category.types.map((type) => (
                                    <CommandItem
                                        key={type.value}
                                        value={type.value}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue === value ? "" : currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === type.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium">{type.label}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {type.description}
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </div>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
