"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Home, LineChart, Package, Settings, ShoppingCart, Users, ListTodo } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/orders",
      icon: ShoppingCart,
      label: "Orders",
      badge: 6,
      active: pathname.startsWith("/dashboard/orders"),
    },
    {
      href: "/dashboard/products",
      icon: Package,
      label: "Products",
      active: pathname.startsWith("/dashboard/products"),
    },
    {
      href: "/dashboard/customers",
      icon: Users,
      label: "Customers",
      active: pathname.startsWith("/dashboard/customers"),
    },
    {
      href: "/dashboard/analytics",
      icon: LineChart,
      label: "Analytics",
      active: pathname.startsWith("/dashboard/analytics"),
    },
    {
      href: "/dashboard/todos",
      icon: ListTodo,
      label: "Todos",
      active: pathname.startsWith("/dashboard/todos"),
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      label: "Settings",
      active: pathname.startsWith("/dashboard/settings"),
    },
    {
      href: "/dashboard/notifications",
      icon: Bell,
      label: "Notifications",
      active: pathname.startsWith("/dashboard/notifications"),
    },
  ]

  return (
    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
      {navItems.map((item) => (
        <TooltipProvider key={item.href}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                  item.active && "bg-accent text-accent-foreground",
                )}
              >
                <item.icon className="size-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {item.label}
              {item.badge && (
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {item.badge}
                </Badge>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </nav>
  )
}
