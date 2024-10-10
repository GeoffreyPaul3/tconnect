"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useCallback } from "react";

const filters = [
  {
    id: "categories",
    name: "Categories",
    options: [
      { value: "retail", label: "Retail" },
      { value: "tech", label: "Tech" },
      { value: "gaming", label: "Gaming" },
      { value: "entertainment", label: "Entertainment" },
      { value: "fashion", label: "Fashion" },
    ],
  },
  {
    id: "availability",
    name: "Availability",
    options: [
      { value: "inStock", label: "In Stock" },
      { value: "outOfStock", label: "Out of Stock" },
      { value: "limited", label: "Limited" },
    ],
  },
  {
    id: "priceRange",
    name: "Price Range",
    options: [
      { value: "0-500", label: "$0 - $500" },
      { value: "501-1000", label: "$501 - $1000" },
      { value: "1001-2000", label: "$1011 - $2000" },
      { value: "2001+", label: "$2001 and above" },
    ],
  },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Helper function to get the current filters from URLSearchParams
  const getSelectedFilters = useCallback((paramId: string) => {
    const params = searchParams.get(paramId);
    return params ? params.split(",") : [];
  }, [searchParams]);

  const handleFilterChange = useCallback(
    (sectionId: string, optionValue: string, isChecked: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentFilters = getSelectedFilters(sectionId);

      if (isChecked) {
        // Remove the value from the filter
        const updatedFilters = currentFilters.filter((value) => value !== optionValue);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        updatedFilters.length > 0
          ? params.set(sectionId, updatedFilters.join(","))
          : params.delete(sectionId);
      } else {
        // Add the value to the filter
        params.set(sectionId, [...currentFilters, optionValue].join(","));
      }

      router.replace(`/?${params.toString()}`);
    },
    [searchParams, router, getSelectedFilters]
  );

  return (
    <form className="sticky top-20" onSubmit={(e) => e.preventDefault()}>
      <h3 className="sr-only">Filters</h3>

      {filters.map((section, i) => (
        <Accordion key={i} type="single" collapsible>
          <AccordionItem value={`item-${i}`}>
            <AccordionTrigger>
              <span>
                {section.name}
                <span className="ml-1 text-xs font-extrabold uppercase text-gray-400">
                  {getSelectedFilters(section.id).length > 0
                    ? `(${getSelectedFilters(section.id).join(", ")})`
                    : ""}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {section.options.map((option, optionIdx) => {
                  const isChecked = getSelectedFilters(section.id).includes(
                    option.value
                  );

                  return (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`filter-${section.id}-${optionIdx}`}
                        checked={isChecked}
                        onChange={() =>
                          handleFilterChange(section.id, option.value, isChecked)
                        }
                      />
                      <label
                        htmlFor={`filter-${section.id}-${optionIdx}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </form>
  );
}
