"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@shared/lib/utils";
import { Calendar } from "@shared/ui/data-display";
import { Button } from "@shared/ui/forms/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/ui/layout";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Выберите дату",
  disabled = false,
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {value ? format(value, "dd.MM.yyyy", { locale: ru }) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          defaultMonth={value || new Date()}
          selected={value}
          onSelect={(date: Date | undefined) => {
            onChange?.(date);
            setOpen(false);
          }}
          className="rounded-md border-0"
        />
      </PopoverContent>
    </Popover>
  );
}
