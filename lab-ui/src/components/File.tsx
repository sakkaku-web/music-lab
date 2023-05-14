import { FcPlus } from "react-icons/fc";
import { BlobApiResponse, MusicItemDto, TagDto } from "../openapi";
import { Chip } from "./Chip";
import { useContext, useEffect, useState } from "react";
import { MusicApiContext } from "../music";

interface FileProps {
  file: MusicItemDto;
  onUpdate: (file: MusicItemDto) => void;
}

export function File({ file, onUpdate }: FileProps) {
  const [addNew, setAddNew] = useState(false);
  const [editingTag, setEditingTag] = useState(null as number | null);
  const [src, setSrc] = useState("");

  const api = useContext(MusicApiContext);
  const id = `${file.parent}/${file.file}`;

  useEffect(() => {
    api
      ?.musicDownloadDownloadFileGetRaw({ file: encodeURIComponent(id) })
      .then((res) => new BlobApiResponse(res.raw).value())
      .then((data) => URL.createObjectURL(data))
      .then((url) => setSrc(url))
      .catch((error) => console.log("Failed to load file:", error));
  }, []);

  const onUpdateTag = async (tag: TagDto) => {
    if (editingTag) {
      const res = await api?.updateTagTagIntIdPut({
        id: editingTag,
        tagDto: tag,
      });

      if (res) {
        const updatedTags = file.tags?.map((t) =>
          t.id === editingTag ? res : t
        );
        onUpdate({ ...file, tags: updatedTags });
      }

      setEditingTag(null);
    }
  };

  const onNewTag = async (tag: TagDto) => {
    const res = await api?.updateMusicTagTagPost({
      musicTagBody: { file: id, tag: tag },
    });

    if (res) {
      onUpdate(res);
    }

    setAddNew(false);
  };

  const toggleEdit = (id: number | null, newTag: boolean = false) => {
    setAddNew(false);
    setEditingTag(null);

    if (newTag) {
      setAddNew(true);
    } else {
      setEditingTag(id);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl">{file.file}</h1>

      <audio controls src={src} />

      <div className="flex gap-2">
        {file.tags?.map((tag) => (
          <Chip
            key={tag.id}
            tag={tag}
            edit={editingTag === tag.id}
            onEdit={onUpdateTag}
            onClick={() =>
              tag.id && editingTag !== tag.id && toggleEdit(tag.id)
            }
            onCancel={() => toggleEdit(null)}
          />
        ))}

        {!addNew && (
          <button
            onClick={() => toggleEdit(null, true)}
            className="p-2 hover:bg-slate-100"
          >
            <FcPlus />
          </button>
        )}

        {addNew && (
          <Chip
            edit={true}
            onEdit={onNewTag}
            onCancel={() => toggleEdit(null)}
          />
        )}
      </div>
    </div>
  );
}
