from pydantic import BaseModel, Field
from flask_openapi3 import APIBlueprint
from flask import send_file
import os

from app.config import music_tag

api = APIBlueprint('music', __name__, url_prefix='/music',
                   abp_tags=[music_tag])

MUSIC_FOLDER = os.getenv('MUSIC_FOLDER')


class MusicQuery(BaseModel):
    folder: str = Field(None, description="search music inside folder")
    name: str = Field(
        None, description="search music file by name recursively")  # TODO: implement


class MusicResponse(BaseModel):
    parent: str
    file: str
    is_folder: bool


class MusicListResponse(BaseModel):
    music: list[MusicResponse]


def _is_folder(parent: str, file: str):
    return os.path.isdir(os.path.join(parent, file))


def _list_files_of(parent: str):
    files = os.listdir(parent)
    return [MusicResponse(parent=parent[len(MUSIC_FOLDER):], file=file,
                          is_folder=_is_folder(parent, file)) for file in files]


def _join_music_folder(path: str):
    return os.path.join(MUSIC_FOLDER, path)


@api.get('/', responses={'200': MusicListResponse})
def music_list(query: MusicQuery):
    sub = query.folder or ''
    full_path = _join_music_folder(sub)
    music = []

    if os.path.exists(full_path) and os.path.isdir(full_path):
        music = _list_files_of(parent=full_path)

    return MusicListResponse(music=music).dict()
