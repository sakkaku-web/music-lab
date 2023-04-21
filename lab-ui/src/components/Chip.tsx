import { useState } from "react";
import { TagDto } from "../openapi";
import { SketchPicker, TwitterPicker } from "react-color";

interface ChipProps {
  tag?: TagDto;
  edit?: boolean;
  onEdit?: (tag: TagDto) => void;
  onCancel?: () => void;
  onClick?: () => void;
}

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function Chip({ tag, edit, onEdit, onCancel, onClick }: ChipProps) {
  const [editName, setEditName] = useState(tag?.name || "");
  const [editColor, setEditColor] = useState(`#${tag?.color || "000000"}`);
  const [openPicker, setOpenPicker] = useState(false);

  const colorRgb = hexToRgb(editColor);

  const black = "#101010";
  const white = "#F0F0F0";
  const textColor = colorRgb.r < 128 || colorRgb.g < 128 ? white : black;

  // TODO: clickable when name is empty
  return (
    <div
      style={{ background: editColor, color: textColor }}
      className="text-slate-900 rounded-full px-2 py-1 flex gap-2 min-w-[5rem]"
      onClick={onClick}
    >
      {(edit && (
        <>
          <input
            value={editName}
            style={{ background: editColor, color: textColor }}
            className="outline-none rounded-full w-20"
            onChange={(e) => setEditName(e.target.value)}
            onKeyUp={(e) =>
              e.key === "Enter" &&
              onEdit &&
              onEdit({ id: tag?.id, name: editName || "", color: editColor.replace("#", "") })
            }
          />

          <div className="relative flex">
            <button
              className="w-6 border cursor-pointer"
              style={{ borderColor: textColor }}
              onClick={() => setOpenPicker(!openPicker)}
            ></button>

            {openPicker && (
              <div className="absolute top-10 -left-2">
                <TwitterPicker color={editColor} onChange={(x) => setEditColor(x.hex)} />
              </div>
            )}
          </div>
          <button onClick={onCancel}>x</button>
        </>
      )) ||
        tag?.name ||
        ""}
    </div>
  );
}
