import { FcAudioFile, FcFile } from "react-icons/fc";
import { FaPlay, FaPause } from "react-icons/fa";
import { useContext, useState } from "react";
import { MusicApiContext, createAudioSrc } from "../music";

interface FileIconProps {
  file: string;
}

const audioFile = [".mp3", ".wav", ".ogg", ".m4a", ".aac", ".wma"];

export function FileIcon({ file }: FileIconProps) {
  const api = useContext(MusicApiContext);
  const [paused, setPaused] = useState(true);
  const [audio, setAudio] = useState(null as HTMLAudioElement | null);

  const play = async () => {
    if (!audio && api) {
      const src = await createAudioSrc(api, file);
      const a = new Audio(src);
      a.play();
      setAudio(a);
    } else {
      audio?.play();
    }

    setPaused(false);
  };

  const pause = () => {
    audio?.pause();
    setPaused(true);
  };

  if (audioFile.some((x) => file.endsWith(x))) {
    return (
      <>
        <FcAudioFile />
        <span className={audio ? "text-black" : "text-gray-300"}>
          {(paused && (
            <FaPlay className="cursor-pointer" onClick={() => play()} />
          )) || <FaPause className="cursor-pointer" onClick={() => pause()} />}
        </span>
      </>
    );
  }

  return <FcFile />;
}
