from pydantic import BaseModel, Field
from typing import Optional
from app.db import db
import os

# Entity


tags = db.Table('music_tags',
                db.Column('tag_id', db.Integer, db.ForeignKey(
                    'tag.id'), primary_key=True),
                db.Column('music_id', db.String, db.ForeignKey(
                    'music.file'), primary_key=True)
                )


class Tag(db.Model):
    __tablename__ = 'tag'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    color = db.Column(db.String(6), nullable=False)
    music = db.relationship('Music', secondary=tags, back_populates='tags')


class Music(db.Model):
    __tablename__ = 'music'
    file = db.Column(db.String, primary_key=True)
    tags = db.relationship('Tag', secondary=tags, back_populates='music')

# Dto


class TagDto(BaseModel):
    id: Optional[int]
    name: str = Field(None, min_length=1, max_length=20)
    color: Optional[str] = Field(None, min_length=3, max_length=6)


class MusicItemDto(BaseModel):
    parent: str
    file: str
    is_folder: bool
    tags: list[TagDto] = Field(None, description="tags of music")

# Service


class MusicService:
    def __init__(self, music_folder: str, real_folder: str):
        self.music_folder = music_folder
        self.real_music_folder = real_folder if real_folder else music_folder

    def _is_folder(self, parent: str, file: str):
        return os.path.isdir(os.path.join(parent, file))

    def _remove_music_folder_prefix(self, path: str):
        path = path[len(self.music_folder):]
        if path.startswith('/'):
            path = path[1:]
        return path

    def _list_files_of(self, parent: str):
        files = os.listdir(parent)
        result = []

        files.sort()
        for file in files:
            if file.startswith('.') or file.startswith('_'):
                continue
            p = self._remove_music_folder_prefix(parent)
            music_file = self._to_music_id(os.path.join(p, file))
            music = self._get_music(music_file)
            tags = [self._to_tag_dto(tag)
                    for tag in music.tags] if music else []

            result.append(MusicItemDto(parent=p, file=file,
                                       is_folder=self._is_folder(parent, file), tags=tags))

        return result

    def _to_music_id(self, file: str):
        if file.startswith(self.music_folder):
            file = file[len(self.music_folder):]
        if file.startswith('/'):
            file = file[1:]
        return file

    def _join_music_folder(self, path: str):
        if path.startswith('/'):
            path = path[1:]

        if not path.startswith(self.music_folder):
            path = os.path.join(self.music_folder, path)

        if path.endswith('/'):
            path = path[:-1]

        # print(f'To: {path}')
        if not os.path.exists(path):
            return None

        return path

    def list_music(self, folder: str = None, tag_ids: list[int] = []) -> list[MusicItemDto]:
        if len(tag_ids) > 0:
            result = self._get_music_with_tags(tag_ids)
            return [self._to_music_item_dto(x) for x in result]

        full_path = self._join_music_folder(folder or '')
        music = []
        if full_path and os.path.isdir(full_path):
            music = self._list_files_of(parent=full_path)

        return music

    def _get_music_with_tags(self, tag_ids: list[int]) -> list[Music]:
        tags = [self._get_tag(tag) for tag in tag_ids]
        result = []
        for tag in tags:
            if tag:
                result.extend(tag.music)
        return result

    def download(self, file: str) -> str:
        full_path = self._join_music_folder(file)

        if full_path and os.path.isfile(full_path):
            return full_path

        return None

    def get_full_path(self, file: str):
        if file.startswith('/'):
            file = file[1:]

        path = os.path.join(self.real_music_folder, file)

        if path.endswith('/'):
            path = path[:-1]

        return path

    def update_tag(self, t: TagDto):
        tag = self._get_tag(t.id)
        if tag is None:
            raise Exception('Tag not found')

        tag.name = t.name
        tag.color = t.color
        db.session.commit()

        return self._to_tag_dto(tag)

    def tag_music(self, tag: TagDto, file: str):
        if self._join_music_folder(file) is None:
            raise Exception('File not found')

        id = self._to_music_id(file)
        music = self._get_music(id)
        if music is None:
            music = Music(file=id)
            db.session.add(music)
            print(f'Creating new music {music.file}')

        if tag.id is None:
            tag = Tag(name=tag.name, color=tag.color or 'FFF')
            db.session.add(tag)
            print(f'Creating new tag {tag.name}')
        else:
            tag = self._get_tag(tag.id)

        if tag is None:
            raise Exception('Tag not found')

        music.tags.append(tag)
        db.session.commit()

        return self._to_music_item_dto(music)

    def untag_music(self, tag: int, file: str):
        if self._join_music_folder(file) is None:
            raise Exception('File not found')

        id = self._to_music_id(file)
        music = self._get_music(id)
        if music is None:
            raise Exception('Music not found')

        music.tags = [t for t in music.tags if t.id != tag]
        self._delete_tag_if_empty(tag)

        db.session.commit()

        return self._to_music_item_dto(music)

    def _delete_tag_if_empty(self, tag: int):
        tag = self._get_tag(tag)
        if tag is None:
            return

        if len(tag.music) > 0:
            return

        print(f'Delete empty tag {tag.name}')
        db.session.delete(tag)

    def _get_tag(self, id: int) -> Tag:
        return Tag.query.filter_by(id=id).first()

    def _get_music(self, file: str) -> Music:
        return Music.query.filter_by(file=file).first()

    # Mapper

    def _to_tag_dto(self, tag: Tag) -> TagDto:
        return TagDto(id=tag.id, name=tag.name, color=tag.color)

    def _to_music_item_dto(self, music: Music) -> MusicItemDto:
        return MusicItemDto(parent=os.path.dirname(music.file),
                            is_folder=False,
                            file=os.path.basename(music.file),
                            tags=[self._to_tag_dto(t) for t in music.tags])
