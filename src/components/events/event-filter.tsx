
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EVENT_CATEGORIES } from "@/lib/constants";
import { EventFilter } from "@/lib/types";

interface EventFilterProps {
  filter: EventFilter;
  onChange: (filter: Partial<EventFilter>) => void;
}

export function EventFilterBar({ filter, onChange }: EventFilterProps) {
  return (
    <div className="p-4 space-y-4 border rounded-lg bg-background shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={filter.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <div className="flex-1">
          <Select
            value={filter.category}
            onValueChange={(value) => onChange({ category: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select
            value={filter.date}
            onValueChange={(value) => onChange({ date: value as any })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="soonest">Soonest First</SelectItem>
              <SelectItem value="farthest">Farthest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            onChange({
              search: "",
              category: "All",
              date: "all",
            })
          }
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
