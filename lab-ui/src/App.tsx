import { Configuration, MusicApi } from "./openapi";
import { Folder } from "./components/Folder";
import { MusicApiContext } from "./music";
import { env } from "./env";

const api = new MusicApi(new Configuration({ basePath: env.apiUrl }));

function App() {
  return (
    <div className="p-4">
      <MusicApiContext.Provider value={api}>
        <Folder name="" />
      </MusicApiContext.Provider>
    </div>
  );
}

export default App;
