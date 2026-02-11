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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const post = getPostBySlug(resolvedParams.slug);
    if (!post) return;
    return {
        title: `${post.meta.title} | Tidy Living Co`,
        description: post.meta.description,
    };
}

export default async function BlogPost({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const post = getPostBySlug(resolvedParams.slug);
    const targetAsin = resolvedSearchParams.asin as string;

    if (!post) {
        notFound();
    }

    // Reorder products: if match found, put it first.
    let displayProducts = post.meta.products || [];
    if (targetAsin && displayProducts.length > 0) {
        const matchIndex = displayProducts.findIndex(p => p.asin === targetAsin);
        if (matchIndex > -1) {
            const match = displayProducts[matchIndex];
            const others = displayProducts.filter(p => p.asin !== targetAsin);
            displayProducts = [match, ...others];
        }
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
                        <h3 className="text-xl font-bold mb-6 uppercase tracking-wider text-gray-400 border-b pb-2">
                            {targetAsin ? 'Your Matched Solution & More' : 'Quick Picks'}
                        </h3>
                        <div className="space-y-6">
                            {displayProducts.map((product, idx) => {
                                const isMatch = product.asin === targetAsin;
                                return (
                                    <div key={idx} className={`flex gap-4 items-center group p-4 rounded-xl transition-all ${isMatch ? 'bg-amber-50 border border-amber-200 shadow-sm transform scale-105' : 'hover:bg-gray-50'}`}>
                                        <div className="flex-1">
                                            {isMatch && (
                                                <span className="inline-block bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                                                    FEATURED MATCH
                                                </span>
                                            )}
                                            <h4 className="font-bold text-lg text-gray-800 group-hover:text-amber-600 transition">{product.name}</h4>
                                            <p className="text-sm text-gray-500">{product.description}</p>
                                        </div>
                                        <a href={`https://www.amazon.com/dp/${product.asin}?tag=tidylivingc0e-20`} target="_blank" className={`cta-btn px-4 py-2 text-white rounded-lg text-sm font-bold transition whitespace-nowrap ${isMatch ? 'bg-amber-600 hover:bg-amber-700 shadow-md' : 'bg-gray-900 hover:bg-gray-700'}`}>
                                            Check Price
                                        </a>
                                    </div>
                                );
                            })}
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
