import {UserPlus,TrendingUp,Boxes,type LucideIcon} from "lucide-react";
type ProfileMenuItem = {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
};
const PROFILE_MENU: ProfileMenuItem[] = [
  {
    key: "add-members",
    label: "Add Members",
    description: "Invite staff to help manage your store",
    icon: UserPlus,
  },
  {
    key: "product-analytics",
    label: "Product Analytics",
    description: "See which flavors are performing best",
    icon: TrendingUp,
  },
  {
    key: "inventory-management",
    label: "Inventory Management",
    description: "Track and update stock levels",
    icon: Boxes,
  },
];
export default PROFILE_MENU