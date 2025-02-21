"import server-only";

import { eq } from "drizzle-orm";
import { db } from ".";
import {
  DB_FileType,
  files_table as filesSchema,
  folders_table as foldersSchema,
} from "./schema";

export const QUERIES = {
  getFolders: function (folderId: number) {
    return db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.parent, folderId));
  },
  getFiles: function (folderId: number) {
    return db
      .select()
      .from(filesSchema)
      .where(eq(filesSchema.parent, folderId));
  },
  getAllParentsForFolder: async function (folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;
    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(foldersSchema)
        .where(eq(foldersSchema.id, currentId));

      if (!folder[0]) {
        throw new Error("Parent folder not found");
      }

      parents.unshift(folder[0]);
      currentId = folder[0].parent;
    }
    return parents;
  },
};

export const MUTATIONS = {
  createFile: async function (file: {
    ownerId: string;
    name: string;
    size: number;
    url: string;
  }) {
    return await db.insert(filesSchema).values({ ...file, parent: 1 });
  },
};
