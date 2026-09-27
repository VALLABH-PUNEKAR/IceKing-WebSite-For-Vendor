import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  BarChart3,
  Users,
  Settings,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import type { NavKey } from "./NavKey";
type NavItem = {
    key: NavKey;
    label: string;
    icon: LucideIcon;
    path:string;
    };
    const NAV_ITEMS: NavItem[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard ,path:"/dashboard/PDashboard"},
    { key: "orders", label: "Orders", icon: ShoppingBag,path:"/dashboard/Cs" },
    { key: "products", label: "Products", icon: Package ,path:"/dashboard/Products"},
    { key: "inventory", label: "Inventory", icon: Boxes ,path:"/dashboard/Cs"},
    { key: "analytics", label: "Analytics", icon: BarChart3,path:"/dashboard/Cs" },
    { key: "team", label: "Team", icon: Users,path:"/dashboard/Cs" },
    { key: "settings", label: "Settings", icon: Settings,path:"/dashboard/Cs" },
    ]
export default NAV_ITEMS