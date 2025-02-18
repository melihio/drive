import Link from "next/link";
import { ChevronLeft, Folder, ImageIcon, Upload } from "lucide-react";
import { Button } from "../../components/ui/button";

type Item = {
  id: string;
  name: string;
  type: "folder" | "file";
  fileType?: "image";
};

const imagesData: Item[] = [
  { id: "5", name: "Vacation.jpg", type: "file", fileType: "image" },
  { id: "6", name: "Family.png", type: "file", fileType: "image" },
];

export default function Images() {
  const renderItem = (item: Item) => {
    const Icon = item.type === "folder" ? Folder : ImageIcon;

    return (
      <div key={item.id} className="mb-2">
        <Button variant="ghost" className="w-full justify-start">
          <Icon className="mr-2 h-5 w-5 text-gray-400" />
          <span>{item.name}</span>
        </Button>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-4 flex items-center">
        <Link href="/" passHref>
          <Button variant="ghost" className="mr-2">
            <ChevronLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Images</h1>
      </div>
      <div className="mb-4">
        <Button>
          <Upload className="mr-2 h-5 w-5" />
          Upload
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border p-4">
        {imagesData.map(renderItem)}
      </div>
    </div>
  );
}
