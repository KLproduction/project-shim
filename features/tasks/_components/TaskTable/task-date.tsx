import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";
import React from "react";

type Props = {
  value: string;
  className?: string;
};

const TaskDate = ({ value, className }: Props) => {
  const today = new Date();
  const endDate = new Date(value);
  const differInDays = differenceInDays(endDate, today);

  let textColor = "text-muted-foreground";

  if (differInDays <= 3) {
    textColor = "text-red-500";
  } else if (differInDays <= 7) {
    textColor = "text-yellow-500";
  } else if (differInDays <= 14) {
    textColor = "text-green-500";
  }
  return (
    <div className={textColor}>
      <span className={cn("truncate font-semibold", className)}>
        {format(new Date(value), "PPP")}
      </span>
    </div>
  );
};

export default TaskDate;
