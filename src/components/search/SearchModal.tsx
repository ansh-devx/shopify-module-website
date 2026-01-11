"use client";

import { Fragment, useState, useEffect, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";
import { searchAndGroup } from "@/lib/searchUtils";
import { getPopularPages } from "@/lib/buildSearchIndex";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Get search results
  const results = useMemo(() => {
    if (!query) return [];
    return searchAndGroup(query);
  }, [query]);

  // Get popular pages
  const popularPages = useMemo(() => getPopularPages(), []);

  // Calculate total number of results for keyboard navigation
  const totalResults = useMemo(() => {
    if (!query && popularPages) {
      return popularPages.length;
    }
    return results.reduce((sum, group) => sum + group.items.length, 0);
  }, [query, results, popularPages]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % totalResults);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + totalResults) % totalResults);
          break;
        case "Enter":
          e.preventDefault();
          handleSelect();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, totalResults, query, results, popularPages]);

  const handleSelect = (href?: string) => {
    let targetHref = href;

    if (!targetHref) {
      // Get the selected item based on index
      if (!query && popularPages) {
        targetHref = popularPages[selectedIndex]?.href;
      } else {
        let currentIndex = 0;
        for (const group of results) {
          for (const item of group.items) {
            if (currentIndex === selectedIndex) {
              targetHref = item.href;
              break;
            }
            currentIndex++;
          }
          if (targetHref) break;
        }
      }
    }

    if (targetHref) {
      router.push(targetHref);
      onClose();
      setQuery("");
    }
  };

  const handleClear = () => {
    setQuery("");
    setSelectedIndex(0);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-[10vh]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-xl border border-gray-700/50 bg-[#151d1e] p-6 shadow-2xl transition-all">
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  onClear={handleClear}
                />
                <SearchResults
                  results={results}
                  popularPages={!query ? popularPages : undefined}
                  query={query}
                  selectedIndex={selectedIndex}
                  onSelect={handleSelect}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

