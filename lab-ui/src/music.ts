import { createContext } from "react";
import { BlobApiResponse, MusicApi } from "./openapi";

export const MusicApiContext = createContext(null as MusicApi | null);

export async function createAudioSrc(api: MusicApi, file: string) {
  return api
    ?.musicDownloadDownloadFileGetRaw({ file: encodeURIComponent(file) })
    .then((res) => new BlobApiResponse(res.raw).value())
    .then((data) => URL.createObjectURL(data));
}
