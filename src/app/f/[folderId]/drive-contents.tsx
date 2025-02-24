"use client";

import { ChevronRight, PlusIcon, Upload, X } from "lucide-react";
import { FileRow } from "./file-row";
import type { files_table, folders_table } from "../../../server/db/schema";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { UploadButton } from "~/components/upload-thing";
import { createFolder } from "~/server/actions";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { FolderRow } from "./folder-row";

export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolder: number;
}) {
  const navigate = useRouter();
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    await createFolder({
      folder: {
        name: folderName.trim(),
        parent: props.currentFolder,
        ownerId: user!.id,
      },
    });
    setIsDialogOpen(false);
    setFolderName("");
    navigate.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="sticky top-0 z-20 border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex min-w-0 items-center gap-1 overflow-hidden">
              <Link
                href={`/f/${props.parents[0]?.id}`}
                className="flex-shrink-0 text-gray-400 hover:text-white"
              >
                My Drive
              </Link>
              {props.parents.length > 1 && (
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-600" />
              )}
              {props.parents.slice(1).map((parent, i, arr) => (
                <div key={parent.id} className="flex items-center">
                  <Link
                    href={`/f/${parent.id}`}
                    className="truncate text-gray-400 hover:text-white"
                  >
                    {parent.name}
                  </Link>
                  {i !== arr.length - 1 && (
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              className="h-9 w-9 bg-gray-700 hover:bg-gray-600"
              variant="outline"
              size="icon"
              onClick={() => setIsDialogOpen(true)}
            >
              <PlusIcon />
            </Button>
            <UploadButton
              className="ut-button:h-9 ut-button:w-9 ut-button:rounded-md ut-button:border ut-button:bg-gray-700 ut-button:hover:bg-gray-600 ut-allowed-content:hidden"
              endpoint="driveUploader"
              onClientUploadComplete={() => navigate.refresh()}
              input={{ folderId: props.currentFolder }}
              content={{
                button: ({ isUploading }) => (
                  <Upload
                    size={15}
                    className={isUploading ? "animate-bounce" : ""}
                  />
                ),
              }}
            />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl p-4">
        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="flex w-full flex-row items-center gap-4 text-sm font-medium text-gray-400">
              <div className="w-1/2">Name</div>
              <div className="hidden w-1/6 sm:block">Type</div>
              <div className="hidden w-1/4 sm:block">Size</div>
              <div className="w-[40px]"></div>
            </div>
          </div>
          <ul className="divide-y divide-gray-700">
            {props.folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button
          variant="ghost"
          className="fixed right-2 top-2 bg-gray-700"
          onClick={() => setIsDialogOpen(false)}
        >
          Close
        </Button>
        <DialogContent className="bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateFolder} className="space-y-4">
            <Input
              placeholder="Folder name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="border-gray-600 bg-gray-700"
              autoFocus
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!folderName.trim()}>
                Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
