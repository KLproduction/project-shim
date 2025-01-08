"use client";
import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

type Props = {
  value: Date | undefined;
  onChange: (date: Date) => void;
  className?: string;
  placeholder?: string;
};

const DatePicker = ({
  value,
  onChange,
  className,
  placeholder = "Select Date",
}: Props) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTitle>
        <SheetDescription></SheetDescription>
      </SheetTitle>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn(
            "flex w-full justify-start px-3 text-left font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex min-w-[320px] justify-center">
        <div className="mt-12">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => onChange(date as Date)}
            onDayClick={() => setOpen(false)}
            initialFocus
            className="bg-zinc-50 shadow-lg"
          />
          {!value ? (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {placeholder}
            </p>
          ) : (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {format(value, "PPP")}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DatePicker;
