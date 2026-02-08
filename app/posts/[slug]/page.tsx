
import type { Post } from "@/app/types";
import { tasaOrbiter, inter, fugazOne } from "@/app/fonts";
import Image from "next/image";
import './locals.css';
import { formatDate } from "@/app/utils";

async function getPost(slug: string): Promise<Post> {
  const res = await fetch(
    `http://localhost:8000/posts/${slug}`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
    const data = await res.json();
 
    if (data.image === "COMPLETED") {
        data.image = `https://andyfmaxwell-posts.s3.us-west-1.amazonaws.com/${data.id}`;
        data.publishedAt = data.published_at;
    }
    else {
        // Handle case where image is not completed
}
  return data;
}

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const post = await getPost(slug);
    return (
        <div>
            <div className="post-page">
                <h1 className={tasaOrbiter.className}>{post.title}</h1>
                <hr className="divider"></hr>
                <div className="meta-info">
                    <p className={inter.className}>{formatDate(post.publishedAt)}</p>
                </div>
                    {post.image && <Image className="post-image-large" src={post.image} alt="post-image" width={600} height={400} />}
                <p className={`post-content ${inter.className}`} dangerouslySetInnerHTML={{ __html: post.content }}></p>
            </div>
            <hr className="divider"></hr>
            <h2 className={`${fugazOne.className} meta`}>Thanks For Reading!</h2>
        </div>
    );
}