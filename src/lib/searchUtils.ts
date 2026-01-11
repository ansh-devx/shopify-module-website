import Fuse from "fuse.js";
import { SearchableItem, SearchResult, GroupedResults } from "./searchIndex";
import { buildSearchIndex } from "./buildSearchIndex";

// Build the search index once
const searchIndex = buildSearchIndex();

// Configure Fuse.js for fuzzy search
const fuse = new Fuse(searchIndex, {
  keys: [
    { name: "title", weight: 3 },
    { name: "keywords", weight: 2 },
    { name: "content", weight: 1 },
    { name: "category", weight: 1.5 },
  ],
  threshold: 0.4, // 0 = perfect match, 1 = match anything
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
});

/**
 * Search for pages matching the query
 */
export function searchPages(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const results = fuse.search(query);

  return results.map((result) => ({
    ...result.item,
    score: result.score,
    matches:
      result.matches
        ?.map((match) => match.key)
        .filter((key): key is string => key !== undefined) || [],
  }));
}

/**
 * Group search results by category
 */
export function groupResultsByCategory(
  results: SearchResult[]
): GroupedResults[] {
  const grouped = new Map<string, SearchResult[]>();

  results.forEach((result) => {
    const category = result.category;
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(result);
  });

  // Convert to array and sort by category
  return Array.from(grouped.entries())
    .map(([category, items]) => ({
      category,
      items,
    }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

/**
 * Search and return grouped results
 */
export function searchAndGroup(query: string): GroupedResults[] {
  const results = searchPages(query);
  return groupResultsByCategory(results);
}
