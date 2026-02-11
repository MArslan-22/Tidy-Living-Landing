import { getPostBySlug, getAllPosts } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const post = getPostBySlug(params.slug);
    if (!post) return;
    return {
        title: `${post.meta.title} | Tidy Living Co`,
        description: post.meta.description,
    };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
    const post = getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full flex items-center justify-center text-center px-4">
                {post.meta.image && (
                    <Image
                        src={post.meta.image}
                        alt={post.meta.title}
                        fill
                        className="object-cover brightness-50 z-0"
                        priority
                    />
                )}
                <div className="z-10 max-w-3xl text-white">
                    <Link href="/blog" className="inline-block mb-4 text-sm font-bold tracking-widest uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full hover:bg-white/40 transition">
                        {post.meta.category}
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow-lg leading-tight">
                        {post.meta.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 font-light">
                        {post.meta.description}
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 -mt-20 relative z-20">

                {/* Quick Picks Section */}
                {post.meta.products && (
                    <div className="glass-panel p-8 rounded-2xl mb-12 bg-white/80 backdrop-blur-xl shadow-2xl border border-white/50">
                        <h3 className="text-xl font-bold mb-6 uppercase tracking-wider text-gray-400 border-b pb-2">Quick Picks</h3>
                        <div className="space-y-6">
                            {post.meta.products.map((product, idx) => (
                                <div key={idx} className="flex gap-4 items-center group">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-gray-800 group-hover:text-amber-600 transition">{product.name}</h4>
                                        <p className="text-sm text-gray-500">{product.description}</p>
                                    </div>
                                    <a href={`https://www.amazon.com/dp/${product.asin}?tag=tidylivingc0e-20`} target="_blank" className="cta-btn px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition whitespace-nowrap">
                                        Check Price
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content Body */}
                <div className="prose prose-lg prose-indigo mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
                    <MDXRemote source={post.content} />

                    <hr className="my-12 border-gray-100" />

                    <p className="text-sm text-gray-400 italic text-center">
                        As an Amazon Associate, we earn from qualifying purchases. This helps support our content.
                    </p>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/" className="inline-flex items-center text-gray-500 hover:text-amber-600 font-medium transition">
                        <span className="mr-2">←</span> Back to Finds
                    </Link>
                </div>

            </div>
        </article>
    );
}
