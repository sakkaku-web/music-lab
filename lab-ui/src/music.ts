import { createContext } from "react";
import { MusicApi } from "./openapi";

export const MusicApiContext = createContext(null as MusicApi | null);
