import { useState } from "react";
import { FcExpand, FcNext } from "react-icons/fc";
import { MusicItemDto } from "../openapi";

interface FolderProps {
  name: string;
  items: MusicItemDto[];
  onExpand?: (expanded: boolean) => void;
}

export function Folder({ name, items, onExpand }: FolderProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (onExpand) {
      onExpand(newExpanded);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button onClick={() => toggleExpanded()} className="flex gap-2 items-center">
        {expanded ? <FcExpand /> : <FcNext />}

        <span>{name}</span>
      </button>

      {expanded && (
        <ul className="p-2">
          {items.map((item) => (
            <li key={item.file} className="p-1">
              {item.isFolder ? <Folder name={item.file} items={[]} /> : item.file}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
