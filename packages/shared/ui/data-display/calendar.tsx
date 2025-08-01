"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@shared/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/forms/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// Кастомный компонент для заголовка с dropdown'ами
function CustomCaption({ displayMonth, onMonthChange }: {
  displayMonth: Date;
  onMonthChange: (month: Date) => void;
}) {
  const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const currentYear = displayMonth.getFullYear();
  const currentMonth = displayMonth.getMonth();

  // Генерируем годы от 1950 до текущего года + 10
  const startYear = 1950;
  const endYear = new Date().getFullYear() + 10;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentYear, parseInt(monthIndex, 10), 1);

    onMonthChange(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(parseInt(year, 10), currentMonth, 1);

    onMonthChange(newDate);
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-full h-8 px-3 text-sm border border-input bg-background">
          <SelectValue>{months[currentMonth]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={index} value={index.toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentYear.toString()} onValueChange={handleYearChange}>
        <SelectTrigger className="w-auto h-8 px-3 text-sm border border-input bg-background">
          <SelectValue>{currentYear}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [month, setMonth] = useState<Date>(() => {
    if (props.defaultMonth) return props.defaultMonth;
    if ('selected' in props && props.selected instanceof Date) return props.selected;

    return new Date();
  });

  return (
    <div className={cn("p-3", className)}>
      <CustomCaption displayMonth={month} onMonthChange={setMonth} />
      <DayPicker
        month={month}
        onMonthChange={setMonth}
        showOutsideDays={showOutsideDays}
        className=""
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "hidden", // Скрываем стандартный заголовок
          caption_dropdowns: "hidden", // Скрываем стандартные dropdown'ы
          dropdown: "hidden", // Скрываем dropdown'ы
          dropdown_month: "hidden", // Скрываем dropdown месяца
          dropdown_year: "hidden", // Скрываем dropdown года
          nav: "hidden", // Скрываем стандартную навигацию
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 h-9 font-normal text-[0.8rem] flex items-center justify-center",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
          day: "h-9 w-9 p-0 font-normal rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors cursor-pointer",
          day_button: "h-full w-full rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors cursor-pointer",
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-bold scale-110 shadow-xl ring-4 ring-primary/50 ring-offset-2 border-2 border-white/30",
          day_today: "bg-accent text-accent-foreground font-semibold hover:bg-accent/80 hover:scale-105 hover:shadow-md transition-all duration-200",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        {...props}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
