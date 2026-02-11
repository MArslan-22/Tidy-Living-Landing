import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export type Post = {
    slug: string;
    meta: {
        title: string;
        description: string;
        date: string;
        image?: string;
        category?: string;
        products?: Array<{
            name: string;
            asin: string;
            description: string;
            img?: string;
        }>
    };
    content: string;
};

export function getPostBySlug(slug: string): Post | null {
    try {
        const realSlug = slug.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug: realSlug,
            meta: data as Post['meta'],
            content,
        };
    } catch (e) {
        return null;
    }
}

export function getAllPosts(): Post[] {
    if (!fs.existsSync(postsDirectory)) return [];

    const files = fs.readdirSync(postsDirectory);
    const posts = files.map((file) => {
        const post = getPostBySlug(file);
        return post;
    }).filter((post): post is Post => post !== null);

    return posts;
}
