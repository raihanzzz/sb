import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import React, { useState, type FormEvent } from "react";
import EditMenu from "./EditMenu";
import { menuSchema, type MenuFormSchema } from "@/schema/menuSchema";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";


const AddMenu = () => {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<any>();
  const [error, setError] = useState<Partial<MenuFormSchema>>({});
  const { loading, createMenu } = useMenuStore();
  const {restaurant} = useRestaurantStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type == "number" ? Number(value) : value });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = menuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setError(fieldErrors as Partial<MenuFormSchema>);
      return;
    }

    //api start here
    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      if (input.image) {
        // multer expects the field name `imageFile`
        formData.append("imageFile", input.image);
      }
      await createMenu(formData);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="flex justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
          Available Menus
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="bg-[var(--orange)] hover:bg-[var(--hoverOrange)]">
              <Plus className="mr-2" />
              Add Menus
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add A New Menu</DialogTitle>
              <DialogDescription>
                Create a menu that will make your restaurant stand out.
              </DialogDescription>
              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={changeEventHandler}
                    placeholder="Enter menu name"
                  />
                  {error && (
                    <span className="text-xs font-medium text-red-600">
                      {error.name}
                    </span>
                  )}
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    type="text"
                    name="description"
                    value={input.description}
                    onChange={changeEventHandler}
                    placeholder="Enter menu description"
                  />
                  {error && (
                    <span className="text-xs font-medium text-red-600">
                      {error.description}
                    </span>
                  )}
                </div>
                <div>
                  <Label>Price in (Rupees)</Label>
                  <Input
                    type="number"
                    name="price"
                    value={input.price}
                    onChange={changeEventHandler}
                    placeholder="Enter menu price"
                  />
                </div>
                <div>
                  <Label>Upload Menu Image</Label>
                  <Input
                    type="file"
                    name="image"
                    onChange={(e) =>
                      setInput({
                        ...input,
                        image: e.target.files?.[0] || undefined,
                      })
                    }
                  />
                  {error && (
                    <span className="text-xs font-medium text-red-600">
                      {error.image?.name}
                    </span>
                  )}
                </div>
                <DialogFooter className="mt-5">
                  {loading ? (
                    <Button
                      disabled
                      className="bg-[var(--orange)] hover:bg-[var(--hoverOrange)]"
                    >
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : (
                    <Button className="bg-[var(--orange)] hover:bg-[var(--hoverOrange)]">
                      Submit
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {restaurant?.menus?.map((menu: any, idx: number) => (
        <div key={idx} className="mt-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border bg-white dark:bg-gray-800 group">
            <div className="w-full md:w-24 md:h-24 shrink-0 overflow-hidden rounded-lg">
               <img
                 src={menu.image}
                 alt={menu.name}
                 className="w-full h-44 md:h-full object-cover"
               />
            </div>
            <div className="flex-1 pt-2 md:pt-0">
              <div className="flex justify-between items-center">
                 <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                   {menu.name}
                 </h1>
                 {/* Mobile Price Display */}
                 <span className="md:hidden font-bold text-[#D19254] text-lg">₹{menu.price}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 dark:text-gray-300 line-clamp-2 md:line-clamp-none">
                {menu.description}
              </p>
              <h2 className="text-md font-semibold mt-2 hidden md:block">
                Price: <span className="text-[#D19254]">{menu.price}</span>
              </h2>
            </div>
            <Button
              onClick={() => {
                setSelectedMenu(menu);
                setEditOpen(true);
              }}
              size={"sm"}
              className="bg-[var(--orange)] hover:bg-[var(--hoverOrange)] mt-4 md:mt-0 w-full md:w-auto"
            >
              Edit
            </Button>
          </div>
        </div>
      ))}

      <EditMenu
        selectedMenu={selectedMenu}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
      />
    </div>
  );
};

export default AddMenu;
