import sqlite3
import init_db  # Ensure the database and tables are initialized
import time
import os
import boto3
from typing import Annotated

from uuid import uuid4

from fastapi import FastAPI, Depends, HTTPException, UploadFile
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
security = HTTPBasic()

# -------------------- Validation
class Post(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str
    content: str
    excerpt: str
    image: str = None
    published_at: int = Field(default_factory=lambda: int(time.time()))

class Subscriber(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    first_name: str
    last_name: str
    email: EmailStr

# -------------------- Utils

def get_db():
    conn = sqlite3.connect('database.db', check_same_thread=False)
    try:
        yield conn
    finally:
        conn.close()

def _authenticate(credentials: HTTPBasicCredentials):
    time.sleep(1)
    username = os.getenv("APPUSERNAME", "username")
    password = os.getenv("APPPASSWORD", "password")

    if credentials.username != username or credentials.password != password:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
# -------------------- Enums

class ImageUploadStatus(str):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"

# -------------------- Endpoints

@app.post("/posts", status_code=201)
def create_post(post: Post, db: sqlite3.Connection = Depends(get_db),  credentials: HTTPBasicCredentials = Depends(security)):
    _authenticate(credentials)
    c = db.cursor()
    c.execute(
        '''
        INSERT INTO posts (id, title, content, excerpt, image, published_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ''',
        (post.id, post.title, post.content, post.excerpt, ImageUploadStatus.PENDING, post.published_at)
    )
    db.commit()
    return post

@app.get("/posts", status_code=200)
def get_posts(limit=10, offset=0, db: sqlite3.Connection = Depends(get_db)):
    c = db.cursor()
    c.execute(
        f'''
        SELECT id, title, content, excerpt, image, published_at
        FROM posts
        ORDER BY published_at DESC
        LIMIT {limit}
        OFFSET {offset}
        '''
    )
    rows = c.fetchall()
    posts = [Post(id=row[0], title=row[1], content=row[2], excerpt=row[3], image=row[4], published_at=row[5]) for row in rows]
    return posts

@app.get("/posts/{post_id}", status_code=200)
def get_post_by_id(post_id: str, db: sqlite3.Connection = Depends(get_db)):
    c = db.cursor()
    c.execute(
        '''
        SELECT id, title, content, excerpt, image, published_at
        FROM posts
        WHERE id = ?
        ''',
        (post_id,)
    )
    row = c.fetchone()
    if row:
        return Post(id=row[0], title=row[1], content=row[2], excerpt=row[3], image=row[4], published_at=row[5])
    return {"error": "Post not found"}

@app.post("/subscribers", status_code=201)
def create_subscriber(subscriber: Subscriber, db: sqlite3.Connection = Depends(get_db)):    
    print("SUBSCRIBER: ", subscriber)
    c = db.cursor()
    c.execute(
        '''
        INSERT INTO subscribers (id, email, first_name, last_name)
        VALUES (?, ?, ?, ?)
        ''',
        (subscriber.id, subscriber.email, subscriber.first_name, subscriber.last_name)
    )
    db.commit()
    return subscriber

@app.post("/posts/{post_id}/upload", status_code=201)
async def upload_image(post_id: str, file: UploadFile, db: sqlite3.Connection = Depends(get_db), credentials: HTTPBasicCredentials = Depends(security)):
    _authenticate(credentials)

    # try:
    s3 = boto3.client('s3')
    s3.upload_fileobj(
        file.file,
        os.getenv("AWS_S3_BUCKET_NAME"),
        post_id
    )
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail="Failed to upload image") from e

    
    image = ImageUploadStatus.COMPLETED
    c = db.cursor()
    c.execute(
        '''
        UPDATE posts
        SET image = ?
        WHERE id = ?
        ''',
        (image, post_id)
    )
    db.commit()
    return {"image": image}

