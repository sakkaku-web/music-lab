import React, { useEffect, useState } from "react";
import { Configuration, MusicApi, MusicItemDto } from "./openapi";
import { groupBy, merge } from "lodash";
import { Folder } from "./components/Folder";

const api = new MusicApi(new Configuration({ basePath: "http://localhost:5000" }));

function App() {
  const [music, setMusic] = useState({} as Record<string, MusicItemDto[]>);

  useEffect(() => {
    onExpand("");
  }, []);

  const onExpand = (folder: string) => {
    if (!music[folder]) {
      api
        .musicListGet({ folder })
        .then((response) => {
          const group = groupBy(response.music, (item) => item.parent);
          setMusic(merge(music, group));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="p-4">
      <Folder name="" itemMap={music} onExpand={onExpand} />
    </div>
  );
}

export default App;
