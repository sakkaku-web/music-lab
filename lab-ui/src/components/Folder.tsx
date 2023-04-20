import { useState } from "react";
import { FcExpand, FcNext } from "react-icons/fc";
import { MusicItemDto } from "../openapi";

interface FolderProps {
  parent?: string;
  name: string;
  itemMap: Record<string, MusicItemDto[]>;
  onExpand?: (folder: string) => void;
}

export function Folder({ parent, name, itemMap, onExpand }: FolderProps) {
  const [expanded, setExpanded] = useState(false);

  const fullPath = parent ? `${parent}/${name}` : name;

  const toggleExpanded = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (onExpand && newExpanded) {
      onExpand(fullPath);
    }
  };

  const items = itemMap[name] || [];

  return (
    <div className="flex flex-col gap-2">
      <button onClick={() => toggleExpanded()} className="flex gap-2 items-center">
        {expanded ? <FcExpand /> : <FcNext />}

        <span>{name}</span>
      </button>

      {expanded && items.length > 0 && (
        <ul className="p-2">
          {items.map((item) => (
            <li key={item.file} className="p-1">
              {item.isFolder ? (
                <Folder name={item.file} parent={fullPath} itemMap={itemMap} onExpand={onExpand} />
              ) : (
                item.file
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
