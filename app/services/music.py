from pydantic import BaseModel, Field
import os

# Entity


class Music:
    id: int
    file: str
    tags: list[str]

# Dto


class MusicItemDto(BaseModel):
    parent: str
    file: str
    is_folder: bool

# Service


class MusicService:
    def __init__(self, music_folder: str):
        self.music_folder = music_folder

    def _is_folder(self, parent: str, file: str):
        return os.path.isdir(os.path.join(parent, file))

    def _remove_music_folder_prefix(self, path: str):
        return path[len(self.music_folder):]

    def _list_files_of(self, parent: str):
        files = os.listdir(parent)
        return [MusicItemDto(parent=self._remove_music_folder_prefix(parent), file=file,
                             is_folder=self._is_folder(parent, file)) for file in files]

    def _join_music_folder(self, path: str):
        return os.path.join(self.music_folder, path)

    def list(self, folder: str = None) -> list[MusicItemDto]:
        full_path = self._join_music_folder(folder or '')
        music = []

        if os.path.exists(full_path) and os.path.isdir(full_path):
            music = self._list_files_of(parent=full_path)

        return music

    def download(self, file: str) -> str:
        full_path = self._join_music_folder(file)

        if os.path.exists(full_path) and os.path.isfile(full_path):
            return full_path

        return None
