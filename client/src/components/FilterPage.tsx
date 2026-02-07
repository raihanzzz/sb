import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export type FilterOptionsState = {
  id: string;
  label: string;
};

const filterOptions: FilterOptionsState[] = [
  { id: "burger", label: "Burger" },
  { id: "thali", label: "Thali" },
  { id: "biriyani", label: "Biriyani" },
  { id: "momos", label: "Momos" },
];

const FilterPage = () => {
  const { setAppliedFilter, resetAppliedFilter, appliedFilter } =
    useRestaurantStore();

  return (
    <div className="md:w-72">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-lg">Filter by cuisines</h1>
        <Button variant={"link"} onClick={() => resetAppliedFilter()}>
          Reset
        </Button>
      </div>
      {filterOptions.map((option) => {
        const isChecked = appliedFilter.includes(option.label);
        return (
          <div key={option.id} className="flex items-center space-x-2 my-5">
            <Checkbox
              id={option.id}
              checked={isChecked}
              onCheckedChange={() => setAppliedFilter(option.label)}
            />
            <Label
              htmlFor={option.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option.label}
            </Label>
          </div>
        );
      })}
    </div>
  );
};
export default FilterPage;
