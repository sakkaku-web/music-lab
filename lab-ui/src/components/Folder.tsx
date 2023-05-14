import { useContext, useState } from "react";
import { FcExpand, FcNext } from "react-icons/fc";
import { MusicItemDto } from "../openapi";
import { MusicApiContext } from "../music";
import { Dialog } from "./Dialog";
import { File } from "./File";
import { FileIcon } from "./FileIcon";
import { Chip } from "./Chip";

interface FolderProps {
  parent?: string;
  name: string;
}

export function Folder({ parent, name }: FolderProps) {
  const [selectedFile, setSelectedFile] = useState(null as MusicItemDto | null);
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState(null as MusicItemDto[] | null);
  const api = useContext(MusicApiContext);

  const fullPath = parent ? `${parent}/${name}` : name;

  const onUpdate = (file: MusicItemDto) => {
    if (items) {
      setSelectedFile(file);
      const index = items.findIndex((i) => i.file === file.file);
      if (index >= 0) {
        items[index] = file;
        setItems([...items]);
      }
    }
  };

  const onFileClick = (file: MusicItemDto) => {
    setSelectedFile(file);
  };

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
      <button
        onClick={() => toggleExpanded()}
        className="flex gap-2 items-center hover:bg-slate-100 p-2"
      >
        {expanded ? <FcExpand /> : <FcNext />}

        <span>{name || "/"}</span>
      </button>

      {expanded && items && items.length > 0 && (
        <ul className="px-2">
          {items.map((item) =>
            item.isFolder ? (
              <Folder key={item.file} name={item.file} parent={fullPath} />
            ) : (
              <li key={item.file} className="flex items-center gap-2">
                <FileIcon file={`${item.parent}/${item.file}`} />
                <span
                  className="flex gap-2 items-center cursor-pointer p-2"
                  onClick={() => onFileClick && onFileClick(item)}
                >
                  {item.file}{" "}
                </span>
                {item.tags?.map((tag) => (
                  <Chip key={tag.id} editable={false} small={true} tag={tag} />
                ))}
              </li>
            )
          )}
        </ul>
      )}

      {selectedFile && (
        <Dialog open={!!selectedFile} onClose={() => setSelectedFile(null)}>
          <div className="bg-white p-4 min-w-[30rem] rounded-sm">
            <File file={selectedFile} onUpdate={onUpdate} />
          </div>
        </Dialog>
      )}
    </div>
  );
}
