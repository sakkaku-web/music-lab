import { FcPlus } from "react-icons/fc";
import { MusicItemDto, TagDto } from "../openapi";
import { Chip } from "./Chip";
import { useContext, useState } from "react";
import { MusicApiContext } from "../music";

interface FileProps {
  file: MusicItemDto;
  onUpdate: (file: MusicItemDto) => void;
}

export function File({ file, onUpdate }: FileProps) {
  const [addNew, setAddNew] = useState(false);
  const [editingTag, setEditingTag] = useState(null as number | null);

  const api = useContext(MusicApiContext);

  const onUpdateTag = async (tag: TagDto) => {
    if (editingTag) {
      const res = await api?.updateTagTagIntIdPut({
        id: editingTag,
        tagDto: tag,
      });

      if (res) {
        const updatedTags = file.tags?.map((t) => (t.id === editingTag ? res : t));
        onUpdate({ ...file, tags: updatedTags });
      }

      setEditingTag(null);
    }
  };

  const onNewTag = async (tag: TagDto) => {
    const res = await api?.updateMusicTagTagPost({
      musicTagBody: { file: `${file.parent}/${file.file}`, tag: tag },
    });

    if (res) {
      onUpdate(res);
    }

    setAddNew(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl">{file.file}</h1>

      <div className="flex gap-2">
        {file.tags?.map((tag) => (
          <Chip
            key={tag.id}
            tag={tag}
            edit={editingTag === tag.id}
            onEdit={onUpdateTag}
            onClick={() => tag.id && editingTag !== tag.id && setEditingTag(tag.id)}
            onCancel={() => setEditingTag(null)}
          />
        ))}

        {!addNew && (
          <button onClick={() => setAddNew(true)}>
            <FcPlus />
          </button>
        )}

        {addNew && <Chip edit={true} onEdit={onNewTag} onCancel={() => setAddNew(false)} />}
      </div>
    </div>
  );
}
