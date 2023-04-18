from pydantic import BaseModel, Field
from flask_openapi3 import APIBlueprint

from app.config import music_tag
import requests

from enum import Enum
import os

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
    return [MusicResponse(parent=parent, file=file,
                          is_folder=_is_folder(parent, file)) for file in files]


@api.get('/', responses={'200': MusicListResponse})
def music_list(query: MusicQuery):
    sub = query.folder or ''
    full_path = os.path.join(MUSIC_FOLDER, sub)
    music = _list_files_of(parent=full_path)

    return MusicListResponse(music=music).dict()
