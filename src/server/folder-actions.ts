"use server";

import { db } from "~/server/db";
import { folders_table } from "./db/schema";

export async function createFolder(input: {
  folder: {
    name: string;
    ownerId: string;
    parent: number;
  };
}) {
  return await db.insert(folders_table).values({
    ...input.folder,
    ownerId: input.folder.ownerId,
  });
}
