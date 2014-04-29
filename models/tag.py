import sqlalchemy as sc

from sqlalchemy.orm import relationship, backref
from models.post import Post
from common.db import Base

class Tag(Base):
  __tablename__ = 'tags'

  id = sc.Column(sc.Integer, primary_key=True)
  post_id = sc.Column(sc.Integer, sc.ForeignKey('posts.id'))
  tag_name = sc.Column(sc.String)

  post = relationship('Post', backref=backref('tags'))

  def __init__(self, post_id, tag_name):
    self.post_id = post_id
    self.tag_name = tag_name

  def get_dict(self):
    attrs = ('post_id', 'tag_name')
    return {attr: getattr(self, attr) for attr in attrs}

  def __repr__(self):
    return str(self.get_dict())