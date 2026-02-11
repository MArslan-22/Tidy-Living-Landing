import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';

export default function BlogIndex() {
    const posts = getAllPosts();

    return (
        <main className="min-h-screen p-8 max-w-4xl mx-auto">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">Home Organization Guides</h1>
                <p className="text-gray-600">Deep dives into making your space aesthetic and functional.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {posts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                        <div className="glass-panel rounded-2xl overflow-hidden p-6 hover:shadow-xl transition-all duration-300 h-full border border-white/40 bg-white/40 backdrop-blur-md">
                            <div className="mb-4">
                                <span className="text-xs font-bold tracking-wider uppercase text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">
                                    {post.meta.category || 'Guide'}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-amber-600 transition-colors">
                                {post.meta.title}
                            </h2>
                            <p className="text-gray-600 line-clamp-3">
                                {post.meta.description}
                            </p>
                            <div className="mt-4 text-sm text-gray-400 flex items-center gap-2">
                                <span>Read Guide</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-16 text-center">
                <Link href="/" className="text-gray-500 hover:text-gray-800 underline">
                    ← Back to Quick Finds
                </Link>
            </div>
        </main>
    );
}
