import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadthing";

export const uploadthingHandler = createRouteHandler({
  router: uploadRouter,
  config: {}
});
