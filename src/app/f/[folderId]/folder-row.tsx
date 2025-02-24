import { Button } from "@/src/components/ui/button";
import { deleteFolder } from "@/src/server/actions";
import { Folder as FolderIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { folders_table } from "~/server/db/schema";

export function FolderRow(props: {
  folder: typeof folders_table.$inferSelect;
}) {
  const { folder } = props;
  const router = useRouter();

  return (
    <li className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4">
      <div className="flex w-full flex-row items-center justify-between gap-4">
        <div className="flex w-1/2 min-w-0">
          <Link
            href={`/f/${folder.id}`}
            className="flex min-w-0 items-center text-gray-100 hover:text-blue-400"
          >
            <FolderIcon className="mr-3 min-w-[20px]" size={20} />
            <span className="truncate">{folder.name}</span>
          </Link>
        </div>
        <div className="hidden w-1/6 text-sm text-gray-400 sm:block">
          {"folder"}
        </div>
        <div className="hidden w-1/4 text-sm text-gray-400 sm:block">{"-"}</div>
        <div className="flex w-[40px] justify-end text-gray-400">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={async () => {
              if (
                window.confirm(
                  `Are you sure you want to delete "${folder.name}" and all its contents?`,
                )
              ) {
                const btn = document.activeElement as HTMLButtonElement;
                btn.innerHTML =
                  '<svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
                btn.disabled = true;
                await deleteFolder(folder.id);
                router.refresh();
              }
            }}
          >
            <Trash2Icon size={20} />
          </Button>
        </div>
      </div>
    </li>
  );
}
