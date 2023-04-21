import { useContext, useState } from "react";
import { FcExpand, FcNext } from "react-icons/fc";
import { MusicItemDto } from "../openapi";
import { MusicApiContext } from "../music";

interface FolderProps {
  parent?: string;
  name: string;
}

export function Folder({ parent, name }: FolderProps) {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState(null as MusicItemDto[] | null);
  const api = useContext(MusicApiContext);

  const fullPath = parent ? `${parent}/${name}` : name;

  const toggleExpanded = async () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (items == null && newExpanded) {
      const res = await api?.musicListGet({ folder: fullPath });
      setItems(res?.music || []);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button onClick={() => toggleExpanded()} className="flex gap-2 items-center">
        {expanded ? <FcExpand /> : <FcNext />}

        <span>{name || "/"}</span>
      </button>

      {expanded && items && items.length > 0 && (
        <ul className="p-2">
          {items.map((item) => (
            <li key={item.file} className="p-1">
              {item.isFolder ? <Folder name={item.file} parent={fullPath} /> : item.file}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
