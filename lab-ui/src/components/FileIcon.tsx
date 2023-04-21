import { FcAudioFile, FcFile } from "react-icons/fc";

interface FileIconProps {
  file: string;
}

const audioFile = [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".wma"];

export function FileIcon({ file }: FileIconProps) {
  if (audioFile.some((x) => file.endsWith(x))) {
    return <FcAudioFile />;
  }

  return <FcFile />;
}
