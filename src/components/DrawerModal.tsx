import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { ReactNode } from "react";
  
  interface DrawerModalProps {
    title: string;
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
  }
  
const DrawerModal: React.FC<DrawerModalProps> =  ({ title, children, isOpen, onClose })  => {
    return (
        <Sheet  open={isOpen} onOpenChange={onClose}>
        <SheetContent className="h-[50vh] rounded-xl flex border-2 mr-10 mt-auto mb-20">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <div>
              {children}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      
    );
}

export default DrawerModal;
