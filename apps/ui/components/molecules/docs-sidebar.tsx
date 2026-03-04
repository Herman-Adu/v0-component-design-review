"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, User, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useHydration } from "@/hooks/use-hydration"
import { SidebarSkeleton } from "@/components/molecules/sidebar-skeleton"

import type { NavItem, NavSection } from "@/data/nav-data"
import {
  adminSection,
  digitalMarketingSection,
  documentAdministrationSection,
  emailAdministrationSection,
  strategicOverviewSection,
  cmsReferenceSection,
  appReferenceSection,
  infrastructureOpsSection,
  learningHubSection,
} from "@/data/nav-data"

function NavItemWithChildren({ item, pathname, depth = 0 }: { item: NavItem; pathname: string; depth?: number }) {
  const isActive = pathname === item.href
  const hasActiveChild = item.children?.some(
    (child) => pathname === child.href || child.children?.some((c) => pathname === c.href)
  )
  const shouldBeOpen = isActive || hasActiveChild
  const [isOpen, setIsOpen] = React.useState(shouldBeOpen)
  const Icon = item.icon

  if (!item.children || item.children.length === 0) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={isActive}>
          <Link href={item.href}>
            <Icon className={depth > 0 ? "h-2 w-2" : "h-3.5 w-3.5"} />
            <span className={depth > 0 ? "text-xs truncate" : "truncate"}>{item.label}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton className="w-full cursor-pointer" isActive={isActive}>
            <Icon className={depth > 0 ? "h-2 w-2" : "h-3.5 w-3.5"} />
            <span className="flex-1 truncate">{item.label}</span>
            <ChevronRight className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-90" />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="ml-2 border-l border-border/50 pl-2">
            {item.children.map((child) => (
              <NavItemWithChildren key={`${child.href}-${child.label}`} item={child} pathname={pathname} depth={depth + 1} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  )
}

function NavCollapsible({ section, pathname }: { section: NavSection; pathname: string }) {
  const hasActiveItem = section.items.some(
    (item) =>
      pathname === item.href ||
      item.children?.some((child) => pathname === child.href || child.children?.some((c) => pathname === c.href))
  )
  const [isOpen, setIsOpen] = React.useState(hasActiveItem)
  const Icon = section.icon

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-full">
            <Icon className="h-4 w-4" />
            <span className="flex-1">{section.title}</span>
            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {section.items.map((item) => (
              <NavItemWithChildren key={item.href} item={item} pathname={pathname} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function DocsSidebar() {
  const hydrated = useHydration()
  const pathname = usePathname()

  if (!hydrated) {
    return <SidebarSkeleton />
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-accent" />
          <div>
            <h2 className="font-semibold text-foreground text-sm">Dashboard</h2>
            <p className="text-xs text-muted-foreground">Manage your project</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavCollapsible section={adminSection} pathname={pathname} />
              <NavCollapsible section={digitalMarketingSection} pathname={pathname} />
              <NavCollapsible section={documentAdministrationSection} pathname={pathname} />
              <NavCollapsible section={emailAdministrationSection} pathname={pathname} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Documentation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavCollapsible section={strategicOverviewSection} pathname={pathname} />
              <NavCollapsible section={cmsReferenceSection} pathname={pathname} />
              <NavCollapsible section={appReferenceSection} pathname={pathname} />
              <NavCollapsible section={infrastructureOpsSection} pathname={pathname} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Learn & Grow
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavCollapsible section={learningHubSection} pathname={pathname} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-2 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/30 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
            <User className="h-4 w-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium text-foreground truncate">Guest User</p>
            <p className="text-xs text-muted-foreground">Sign in for more</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
