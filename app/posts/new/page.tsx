"use client";

import { useState, useRef } from "react";
import type { Post } from "@/app/types";
import '@/app/globals.css';
import { tasaOrbiter } from "@/app/fonts";
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from "tinymce";
import { redirect } from "next/navigation";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdPost, setCreatedPost] = useState<Post | null>(null);

  const editorRef = useRef<TinyMCEEditor | null>(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: editorRef.current ? editorRef.current.getContent() : "",
        published_at: Math.floor(Date.now() / 1000),
      };

      const authToken = btoa(`${username}:${password}`);
      const response = await fetch("http://localhost:8000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to create post (${response.status})`);
      }
      console.log("HERE");

      const data = await response.json();
      const post: Post = {
        id: data.id,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image ?? "",
        publishedAt: data.published_at,
      };
      console.log("POST CREATED: ", post);

      redirect(`/posts/${post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`post-page ${tasaOrbiter.className}`}>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="auth-fields">
            <label>
                API Username
            </label>
            <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="username"
                required
            />

            <label>
                API Password
            </label>
            <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="password"
                required
            />
        </div>

        <div className="field">
            <label>
                Title
            </label>
            <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Post title"
                required
            />
        </div>
        
        <div className="field">
            <label>
                Excerpt
            </label>
            <textarea
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                placeholder="Short summary"
                rows={4}
                required
                />
        </div>
        
        <div className="field">
            <label>
                Content
            </label>
            <Editor
                apiKey='n5t1hg0j2o84jgi0odpf7od9pwoj8oeuo1vrm80rz9g29m8x'
                onInit={ (_evt, editor) => editorRef.current = editor }
                initialValue="<p>This is the initial content of the editor.</p>"
                init={{
                height: 500,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />

        </div>

        <button className="post-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Post"}
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
