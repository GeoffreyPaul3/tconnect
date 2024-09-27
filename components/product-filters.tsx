"use client"

import { useRouter, useSearchParams } from "next/navigation"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"

const filters = [
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
    id: "validityPeriod",
    name: "Validity Period",
    options: [
      { value: "1-month", label: "1 Month" },
      { value: "3-months", label: "3 Months" },
      { value: "6-months", label: "6 Months" },
      { value: "1-year", label: "1 Year" },
    ],
  },
  {
    id: "priceRange",
    name: "Price Range",
    options: [
      { value: "0-10", label: "$0 - $10" },
      { value: "10-50", label: "$10 - $50" },
      { value: "50-100", label: "$50 - $100" },
      { value: "100-500", label: "$100 - $500" },
    ],
  },
];

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchValues = Array.from(searchParams.entries())

  return (
    <form className="sticky top-20">
      <h3 className="sr-only">Categories</h3>

      {filters.map((section, i) => (
        <Accordion key={i} type="single" collapsible>
          <AccordionItem value={`item-${i}`}>
            <AccordionTrigger>
              <span>
                {section.name}{" "}
                <span className="ml-1 text-xs font-extrabold uppercase text-gray-400">
                  {searchParams.get(section.id)
                    ? `(${searchParams.get(section.id)})`
                    : ""}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {section.options.map((option, optionIdx) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`filter-${section.id}-${optionIdx}`}
                      checked={searchValues.some(
                        ([key, value]) =>
                          key === section.id && value === option.value
                      )}
                      onClick={(event) => {
                        const params = new URLSearchParams(searchParams)
                        const checked =
                          event.currentTarget.dataset.state === "checked"
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        checked
                          ? params.delete(section.id)
                          : params.set(section.id, option.value)
                        router.replace(`/?${params.toString()}`)
                      }}
                    />
                    <label
                      htmlFor={`filter-${section.id}-${optionIdx}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </form>
  )
}

