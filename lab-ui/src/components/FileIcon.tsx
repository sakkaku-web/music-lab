import { FcAudioFile, FcFile } from "react-icons/fc";
import { FaPlay, FaPause } from "react-icons/fa";
import { useContext, useRef, useState } from "react";
import { MusicApiContext, createAudioSrc } from "../music";

interface FileIconProps {
  file: string;
}

const audioFile = [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".wma"];

export function FileIcon({ file }: FileIconProps) {
  const api = useContext(MusicApiContext);
  const audio = useRef(null as HTMLAudioElement | null);
  const [paused, setPaused] = useState(true);
  const [src, setSrc] = useState("");

  const play = async () => {
    if (!src && api) {
      const src = await createAudioSrc(api, file);
      setSrc(src);
    } else {
      audio.current?.play();
    }

    setPaused(false);
  };

  const pause = () => {
    audio.current?.pause();
    setPaused(true);
  };

  if (audioFile.some((x) => file.endsWith(x))) {
    return (
      <>
        <FcAudioFile />
        <span className={src ? "text-black" : "text-gray-300"}>
          {(paused && (
            <FaPlay className="cursor-pointer" onClick={() => play()} />
          )) || <FaPause className="cursor-pointer" onClick={() => pause()} />}
          {src && <audio autoPlay ref={audio} src={src} />}
        </span>
      </>
    );
  }

  return <FcFile />;
}
