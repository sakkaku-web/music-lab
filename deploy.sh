docker stop music-lab && docker rm music-lab

MUSIC_FOLDER="$(pwd)/music"
DB_FOLDER="$(pwd)/instance"

docker build . --tag music-lab
docker run -d --restart unless-stopped -p 8080:5000 \
    -v $MUSIC_FOLDER:/music \
    -v $DB_FOLDER:/instance \
    -e REACT_APP_API_URL='http://localhost:8080' \
    -e MUSIC_FOLDER=/music \
    -e DATABASE_URL=sqlite:///music.db \
    --name music-lab music-lab 

cd lab-ui
PUBLIC_URL=/music-lab npm run build
sudo rm /srv/http/music-lab -r && sudo cp -r ./build /srv/http/music-lab