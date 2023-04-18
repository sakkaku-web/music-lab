from pydantic import BaseModel
from flask_openapi3 import APIBlueprint

from app.config import music_tag
import requests

import os

api = APIBlueprint('music', __name__, url_prefix='/music',
                   abp_tags=[music_tag])

MUSIC_FOLDER = os.getenv('MUSIC_FOLDER')


class MusicResponse(BaseModel):
    file: str


class MusicListResponse(BaseModel):
    music: list[MusicResponse]


@api.get('/', responses={'200': MusicListResponse})
def music_list():
    return MUSIC_FOLDER
