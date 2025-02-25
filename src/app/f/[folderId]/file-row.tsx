import { Button } from "@/src/components/ui/button";
import { deleteFile } from "@/src/server/actions";
import { FileIcon, Trash2Icon, X, Download } from "lucide-react";
import type { files_table } from "~/server/db/schema";
import { useState } from "react";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
  const { file } = props;
  const [showPreview, setShowPreview] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getFileType = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension;
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const renderPreview = () => {
    if (!showPreview) return null;

    const fileType = file.name.split(".").pop()?.toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "gif"].includes(fileType || "");

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="fixed right-4 top-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
            onClick={handleDownload}
          >
            <Download className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
            onClick={() => setShowPreview(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="h-[80vh] w-[80vw]">
          <div className="flex h-full w-full items-center justify-center">
            {isImage ? (
              <img
                src={file.url}
                alt={file.name}
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
    <li className="hover:bg-gray-750 relative border-b border-gray-700 px-6 py-4">
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
          {file.name.split(".").pop()?.toLowerCase() ?? "unknown"}
        </div>
        <div className="w-1/4 text-sm text-gray-400 sm:block">
          {formatFileSize(file.size)}
        </div>
        <div className="flex w-[40px] justify-end text-gray-400">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            onClick={async () => {
              if (
                window.confirm(
                  `Are you sure you want to delete "${file.name}"?`,
                )
              ) {
                setIsDeleting(true);
                await deleteFile(file.id);
              }
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            ) : (
              <Trash2Icon size={20} />
            )}
          </Button>
        </div>
      </div>
      {renderPreview()}
    </li>
  );
}
