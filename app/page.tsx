"use client";
import { tasaOrbiter, fugazOne } from "./fonts";
import "./globals.css";
import "./locals.css";
import type { Post } from "./types";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "./utils";
import { useState, useEffect } from "react";


const imageWidth = 300, imageHeight = 200;

async function getPosts(): Promise<Post[]> {
  const res = await fetch(
    `http://localhost:8000/posts?${new URLSearchParams({ limit: "4"})}`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  const data = await res.json();
  const fullPosts = [];
  for (const post of data) {
    if (post.image === "COMPLETED") {
      fullPosts.push({
        id: post.id,
        title: post.title,
        image: `https://andyfmaxwell-posts.s3.us-west-1.amazonaws.com/${post.id}`,
        excerpt: post.excerpt,
        content: post.content,
        publishedAt: post.published_at,
      });
    }
  }
  return fullPosts;
}

function PostCard ({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.id}`} className={`post-card ${tasaOrbiter.className}`}>
      <Image src={post.image} alt="post-image" width={imageWidth} height={imageHeight} className="post-image"></Image>
      <h3 className="post-title">{post.title}</h3>
      <p className="post-excerpt">{post.excerpt}</p>
      <p className="post-date">{formatDate(post.publishedAt)}</p>
    </Link>
  )
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then(fetchedPosts => setPosts(fetchedPosts));
  }, [])
  
  return (
    <div className="hero">
      <div id="who-i-am">
        <div className="who-i-am-wrapper"> 
          <h1 className={`${fugazOne.className} herotitle`}>Hi, I'm Andrew</h1>
          <p className={`${tasaOrbiter.className}`}>
            I'm a Vancouver based mid level engineer who specializes in backend development. <br></br>
            What motivates me is solving complex problems and creating impactful things.
          </p>
        </div>
      </div>
      <div id="recent-posts">
        <h2 className={fugazOne.className}>Recent Posts</h2>
        <div className='posts-container'>
          {
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          }
        </div>
      </div>
    </div>
  );
}
