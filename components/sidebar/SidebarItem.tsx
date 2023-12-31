import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "../ui/button";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  href,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = pathname === href;
  
  const onClick = () => {
    router.push(href);
  };

  return (
    <Button
      onClick={onClick}
      type="button"
      variant="ghost"
      className={`font-normal flex justify-start gap-x-4 p-6 mx-3 hover:bg-temple/10 hover:text-temple ${isActive ? "bg-temple/10 text-temple" : ""}`}
    >
      <Icon size={20} />
      {label}
    </Button>
  );
}
 
export default SidebarItem;