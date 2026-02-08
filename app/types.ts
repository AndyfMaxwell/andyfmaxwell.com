
export type Post = {
    id: string;
    title: string;
    image: string;
    excerpt: string;
    content: string | TrustedHTML;
    publishedAt: number;
}