import { Button } from "@/src/components/ui/button";
import { deleteFile } from "@/src/server/actions";
import { Folder as FolderIcon, FileIcon, Trash2Icon, Eye } from "lucide-react";
import Link from "next/link";
import type { folders_table, files_table } from "~/server/db/schema";
import { useState } from "react";

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
  const { file } = props;
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getFileType = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension;
  };

  const renderPreview = () => {
    if (!showPreview) return null;

    const fileType = file.name.split(".").pop()?.toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "gif"].includes(fileType || "");

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="h-[80vh] w-[80vw]">
          <Button
            variant="ghost"
            className="absolute right-2 top-2"
            onClick={() => setShowPreview(false)}
          >
            Close
          </Button>
          <div className="flex h-full w-full items-center justify-center">
            {isImage ? (
              <img
                src={file.url}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <iframe src={file.url} className="h-full w-full" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <li
      key={file.id}
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
    >
      <div className="flex w-full flex-row items-center justify-between gap-4">
        <div className="flex w-1/2 min-w-0">
          <button
            onClick={() => setShowPreview(true)}
            className="flex min-w-0 items-center text-gray-100 hover:text-blue-400"
          >
            <FileIcon className="mr-3 min-w-[20px]" size={20} />
            <span className="truncate">{file.name}</span>
          </button>
        </div>
        <div className="hidden w-1/6 text-sm text-gray-400 sm:block">
          {"file"}
        </div>
        <div className="hidden w-1/4 text-sm text-gray-400 sm:block">
          {file.size}
        </div>
        <div className="flex w-[40px] justify-end text-gray-400">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={async () => {
              if (
                window.confirm(
                  `Are you sure you want to delete "${file.name}"?`,
                )
              ) {
                const btn = document.activeElement as HTMLButtonElement;
                btn.innerHTML =
                  '<svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
                btn.disabled = true;
                await deleteFile(file.id);
              }
            }}
          >
            <Trash2Icon size={20} />
          </Button>
        </div>
      </div>
      {renderPreview()}
    </li>
  );
}

export function FolderRow(props: {
  folder: typeof folders_table.$inferSelect;
}) {
  const { folder } = props;
  return (
    <li
      key={folder.id}
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center overflow-hidden">
          <Link
            href={`/f/${folder.id}`}
            className="flex items-center text-gray-100 hover:text-blue-400"
          >
            <FolderIcon className="mr-3 flex-shrink-0" size={20} />
            <span className="truncate">{folder.name}</span>
          </Link>
        </div>
        <div className="col-span-3 text-gray-400"></div>
        <div className="col-span-3 text-gray-400"></div>
      </div>
    </li>
  );
}
