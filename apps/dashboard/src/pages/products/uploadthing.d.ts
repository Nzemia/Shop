// This file allows you to share the UploadThing router type with the frontend for type safety.
// Adjust the import path if your monorepo setup changes.

import type { OurFileRouter } from "../../../../../api/src/uploads/uploadthing";

declare module "@uploadthing/react" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export function UploadButton<T extends OurFileRouter>(props: any): JSX.Element;
}
