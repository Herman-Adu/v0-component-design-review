import type React from "react";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  icon: React.ElementType;
  items: NavItem[];
}
