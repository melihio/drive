import { db } from "../server/db";
import {
  files_table as fileSchema,
  folders_table as foldersSchema,
} from "../server/db/schema";
import DriveContents from "./drive-contents";

export default async function GoogleDriveClone() {
  const files = await db.select().from(fileSchema);
  const folders = await db.select().from(foldersSchema);
  return <DriveContents files={files} folders={folders} />;
}
