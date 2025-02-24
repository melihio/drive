"use server";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";
import { cookies } from "next/headers";

const utApi = new UTApi();

export async function createFolder(input: {
  folder: {
    name: string;
    ownerId: string;
    parent: number;
  };
}) {
  await db.insert(folders_table).values({
    ...input.folder,
    ownerId: input.folder.ownerId,
  });
  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  const file = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)),
    )
    .then((result) => result[0]);

  if (!file) {
    return { error: "File not found" };
  }

  const utapiResult = await utApi.deleteFiles(
    file.url.replace("https://utfs.io/f/", ""),
  );

  console.log(utapiResult);

  const dbDeleteResult = await db
    .delete(files_table)
    .where(eq(files_table.id, fileId));

  console.log(dbDeleteResult);

  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

async function getAllSubFolders(folderId: number): Promise<number[]> {
  const subFolders: number[] = [folderId];
  let newFolders = [folderId];

  // Keep finding subfolders until no new ones are found
  while (newFolders.length > 0) {
    const folders = await db
      .select({ id: folders_table.id })
      .from(folders_table)
      .where(inArray(folders_table.parent, newFolders));

    newFolders = folders.map((f) => f.id);
    subFolders.push(...newFolders);
  }

  return subFolders;
}

export async function deleteFolder(folderId: number) {
  const session = await auth();
  if (!session.userId) throw new Error("Unauthorized");

  // Get the folder and verify ownership
  const folder = await db
    .select()
    .from(folders_table)
    .where(
      and(
        eq(folders_table.id, folderId),
        eq(folders_table.ownerId, session.userId),
      ),
    )
    .limit(1);

  if (!folder[0]) throw new Error("Folder not found");

  // Get all subfolders (including the current folder)
  const allFolders = await getAllSubFolders(folderId);

  // Get all files in these folders
  const files = await db
    .select()
    .from(files_table)
    .where(inArray(files_table.parent, allFolders));

  // Delete files from uploadthing
  const utApi = new UTApi();
  await Promise.all(
    files.map((file) => utApi.deleteFiles(file.url.split("/").pop()!)),
  );

  // Delete all files from the database
  await db.delete(files_table).where(inArray(files_table.parent, allFolders));

  // Delete all folders
  await db.delete(folders_table).where(inArray(folders_table.id, allFolders));

  // Force refresh
  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}
