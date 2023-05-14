from pydantic import BaseModel, Field
from flask_openapi3 import APIBlueprint
from flask import send_file
import os
from urllib.parse import unquote

from app.config import music_tag
from app.services.music import MusicItemDto, TagDto, MusicService

api = APIBlueprint('music', __name__, url_prefix='/music',
                   abp_tags=[music_tag])

MUSIC_FOLDER = os.path.abspath(os.getenv('MUSIC_FOLDER'))
music_service = MusicService(MUSIC_FOLDER)


class MusicQuery(BaseModel):
    folder: str = Field(None, description="search music inside folder")
    tags: list[int] = Field(None, description="search music by tags")


class MusicListResponse(BaseModel):
    music: list[MusicItemDto]


class MusicTagBody(BaseModel):
    file: str
    tag: TagDto


class MusicUnTagBody(BaseModel):
    file: str
    tag: int


class TagUpdatePath(BaseModel):
    id: int


@api.put('/tag/<int:id>', responses={'200': TagDto})
def update_tag(path: TagUpdatePath, body: TagDto):
    body.id = path.id
    try:
        return music_service.update_tag(body).dict()
    except Exception as error:
        return {'message': error.args}, 404


@api.post('/tag', responses={'200': MusicItemDto})
def update_music_tag(body: MusicTagBody):
    try:
        return music_service.tag_music(body.tag, body.file).dict()
    except Exception as error:
        return {'message': error.args}, 404


@api.delete('/tag', responses={'200': MusicItemDto})
def delete_music_tag(body: MusicUnTagBody):
    try:
        return music_service.untag_music(body.tag, body.file).dict()
    except Exception as error:
        return {'message': error.args}, 404


@api.get('/', responses={'200': MusicListResponse})
def music_list(query: MusicQuery):
    music = music_service.list_music(folder=query.folder, tag_ids=query.tags)
    return MusicListResponse(music=music).dict()


class MusicDownloadPath(BaseModel):
    file: str


class MusicErrorResponse(BaseModel):
    message: str


@api.get('/download/<file>',
         responses={'404': MusicErrorResponse},
         extra_responses={"200": {"content": {"application/octet-stream": {"schema": {"type": "file"}}}}})
def music_download(path: MusicDownloadPath):
    file_name = unquote(path.file)
    file = music_service.download(file_name)

    if file is None:
        return MusicErrorResponse(message=f'File not found: {file}').dict(), 404

    return send_file(file, as_attachment=True)
