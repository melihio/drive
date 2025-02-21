import { MUTATIONS, QUERIES } from "@/src/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  driveUploader: f({
    blob: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "1GB",
      maxFileCount: 999,
    },
  })
    .input(z.object({ folderId: z.number() }))
    .middleware(async ({ input }) => {
      const user = await auth();

      if (!user.userId) throw new UploadThingError("Unauthorized");

      const folder = await QUERIES.getFolderById(input.folderId);

      if (!folder) throw new UploadThingError("Folder not found");
      if (folder.ownerId !== user.userId)
        throw new UploadThingError("Unauthorized");

      return { userId: user.userId, folderId: input.folderId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      await MUTATIONS.createFile({
        file: {
          ownerId: metadata.userId,
          name: file.name,
          size: file.size,
          url: file.ufsUrl,
          parent: metadata.folderId,
        },
        userId: metadata.userId,
      });

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
