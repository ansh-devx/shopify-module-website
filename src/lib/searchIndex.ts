import { LucideIcon } from "lucide-react";

export interface SearchableItem {
  id: string;
  title: string;
  href: string;
  category: string;
  breadcrumb: string[];
  keywords: string[];
  content?: string;
  icon?: LucideIcon;
  isExternal?: boolean;
}

export interface SearchResult extends SearchableItem {
  score?: number;
  matches?: string[];
}

export interface GroupedResults {
  category: string;
  items: SearchResult[];
}
