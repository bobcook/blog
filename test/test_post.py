import config

from app import app
from flask import session
from . import send_json
from common.utils import debug
from common import db
from models.post import Post
from models.tag import Tag
from business import post

posts_count = db.session.query(Post).count()

def add_new_post():
  global posts_count
  posts_count += 1
  data = dict(
    title="new_post_title_",
    content="new_post_content_" + str(posts_count),
    status="public"
  )
  new_post = Post(**data)
  db.session.add(new_post)
  db.session.commit()

def test_new_post():
  # If administrator doesn't login, and someon wants to visist
  # the create new post page. The app will redirect to 
  # administrator's login page to require you to login first
  with app.test_client() as c:
    rv = c.get('/new_post')
    assert rv.status_code == 302

  with app.test_client() as c:
    with c.session_transaction() as sess:
      sess['is_admin'] = True
    rv = c.get('/new_post')
    assert rv.status_code == 200
    assert 'new-post' in rv.data

def test_create_new_post():
  with app.test_client() as c:
    with c.session_transaction() as sess:
      sess['is_admin'] = True
      sess['user'] = '{"id": "1"}'
    data = dict(
      title='lucy is good',
      content='jerry is the king of the world',
      tags=['jerry', 'lucy']
    )
    rv = send_json('post', '/new_post', data, c)
    post = db.session.query(Post).filter_by(title='lucy is good').first()
    assert post.content == 'jerry is the king of the world'
    assert 'success' in rv.data

    tags = db.session.query(Tag.tag_name).all()
    tags = [tag[0] for tag in tags]
    assert 'jerry' in tags
    assert 'lucy' in tags

    assert post.author.username


def test_get_post_by_page():
  import time
  for i in xrange(100):
    time.sleep(0.001)
    add_new_post()

  with app.test_client() as c:
    rv = c.get('/page/1')
    posts = post.get_all_posts()
    assert posts[0].update_time > posts[10].update_time
    
    assert '"/post/1"' not in rv.data
    assert 'new_post_content_100' in rv.data
    assert 'new_post_content_91' in rv.data
    assert 'new_post_content_90' not in rv.data
    assert '<a class="active">1</a>' in rv.data

    rv = c.get('/page/200')
    assert '404' in rv.data

def test_edit_post():
  with app.test_client() as c:
    with c.session_transaction() as sess:
      sess['is_admin'] = False
    rv = c.get('/edit_post/1')  
    assert '404' in rv.data

    with c.session_transaction() as sess:
      sess['is_admin'] = True
      sess['user'] = '{"id": "1"}'
    rv = c.get('/edit_post/1')  
    assert '404' not in rv.data
    assert 'edit-post'in rv.data

    rv = c.get('/edit_post/19080890')  
    assert '404' in rv.data

def test_update_post():
  with app.test_client() as c:
    with c.session_transaction() as sess:
      sess['is_admin'] = False
    rv = send_json('put', '/update_post', {}, c)
    assert 'failed' in rv.data
    assert 'not login' in rv.data

    with c.session_transaction() as sess:
      sess['is_admin'] = True
      sess['user'] = '{"id": "1"}'
    data = dict(
      id=1,
      content='new content',
      title='new title',
      status='private',
      tags=['newtag1', 'newtag2'],
    )  
    rv = send_json('put', '/update_post', data, c)
    assert 'success' in rv.data
    post = db.session.query(Post).filter_by(id=1).first()
    for key, value in data.iteritems():
      if key != 'tags':
        assert getattr(post, key) == value