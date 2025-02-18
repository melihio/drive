"use client";

import { useState } from "react";
import {
  Folder,
  File,
  FileText,
  Image,
  Video,
  Music,
  Upload,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/button";

type Item = {
  id: string;
  name: string;
  type: "folder" | "file";
  fileType?: "document" | "image" | "video" | "audio" | "other";
  children?: Item[];
};

const mockData: Item[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    children: [
      { id: "2", name: "Report.docx", type: "file", fileType: "document" },
      {
        id: "3",
        name: "Presentation.pptx",
        type: "file",
        fileType: "document",
      },
    ],
  },
  {
    id: "4",
    name: "Images",
    type: "folder",
    children: [
      { id: "5", name: "Vacation.jpg", type: "file", fileType: "image" },
      { id: "6", name: "Family.png", type: "file", fileType: "image" },
    ],
  },
  { id: "7", name: "Video.mp4", type: "file", fileType: "video" },
  { id: "8", name: "Song.mp3", type: "file", fileType: "audio" },
  { id: "9", name: "Archive.zip", type: "file", fileType: "other" },
];

export default function DriveClone() {
  const [currentFolder, setCurrentFolder] = useState<Item[]>([
    { id: "root", name: "My Drive", type: "folder" },
  ]);
  const [currentItems, setCurrentItems] = useState<Item[]>(mockData);

  const navigateToFolder = (folder: Item) => {
    setCurrentFolder([...currentFolder, folder]);
    setCurrentItems(folder.children || []);
  };

  const navigateToBreadcrumb = (index: number) => {
    const newPath = currentFolder.slice(0, index + 1);
    setCurrentFolder(newPath);
    if (index === 0) {
      setCurrentItems(mockData);
    } else {
      const lastFolder = newPath[newPath.length - 1];
      setCurrentItems(lastFolder.children || []);
    }
  };

  const renderItem = (item: Item) => {
    let Icon = File;
    if (item.type === "folder") {
      Icon = Folder;
    } else {
      switch (item.fileType) {
        case "document":
          Icon = FileText;
          break;
        case "image":
          Icon = Image;
          break;
        case "video":
          Icon = Video;
          break;
        case "audio":
          Icon = Music;
          break;
      }
    }

    return (
      <Button
        key={item.id}
        variant="ghost"
        className="mb-2 w-full justify-start"
        onClick={() => item.type === "folder" && navigateToFolder(item)}
      >
        <Icon className="mr-2 h-5 w-5 text-gray-400" />
        <span>{item.name}</span>
      </Button>
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-4 flex items-center space-x-2">
        {currentFolder.map((folder, index) => (
          <div key={folder.id} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
            )}
            <Button
              variant="link"
              onClick={() => navigateToBreadcrumb(index)}
              className="h-auto p-0"
            >
              {folder.name}
            </Button>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <Button>
          <Upload className="mr-2 h-5 w-5" />
          Upload
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border p-4">
        {currentItems.map(renderItem)}
      </div>
    </div>
  );
}
