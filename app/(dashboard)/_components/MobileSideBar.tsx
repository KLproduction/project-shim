"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import SideBarNavigation from "./SideBarNavigation";
import DashboardSidebar from "./DashboardSidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Props = {};

const MobileSideBar = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  return (
    <div>
      <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant={"outline"}
            size={"icon"}
            className="z-[99999] size-10 lg:hidden"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="m-0 p-0">
          <SheetTitle></SheetTitle>

          <DashboardSidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSideBar;
