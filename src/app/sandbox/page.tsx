import { db } from "~/server/db";
import { mockFolders, mockFiles } from "@/src/lib/mock-data";
import { files_table, folders_table } from "@/src/server/db/schema";

export default async function SandboxPage() {
  return (
    <div className="flex flex-col gap-4">
      Seed Function{" "}
      <form
        action={async () => {
          "use server";
          console.log("sup nerds");

          const folderInsert = await db.insert(folders_table).values(
            mockFolders.map((folder, index) => ({
              id: index + 1,
              ownerId: "asd",
              name: folder.name,
              parent: index !== 0 ? 1 : null,
              createdAt: new Date(),
            })),
          );
          const fileInsert = await db.insert(files_table).values(
            mockFiles.map((file, index) => ({
              id: index + 1,
              ownerId: "asd",
              name: file.name,
              size: 50000,
              url: file.url,
              parent: (index % 3) + 1,
              createdAt: new Date(),
            })),
          );
          console.log(folderInsert);
          console.log(fileInsert);
        }}
      >
        <button type="submit">Seed</button>
      </form>
    </div>
  );
}
