import React, { useEffect, useState } from "react";
import { Configuration, MusicApi, MusicItemDto } from "./openapi";
import { groupBy } from "lodash";
import { Folder } from "./components/Folder";

const api = new MusicApi(new Configuration({ basePath: "http://localhost:5000" }));

function App() {
  const [music, setMusic] = useState({} as Record<string, MusicItemDto[]>);

  useEffect(() => {
    api.musicListGet().then((response) => {
      setMusic(groupBy(response.music, (item) => item.parent));
    });
  });

  const root = "/";

  return (
    <div className="p-4">
      <Folder name={root} items={music[root] || []} />
    </div>
  );
}

export default App;
