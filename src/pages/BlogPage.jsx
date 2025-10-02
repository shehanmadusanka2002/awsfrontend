import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogService from '../services/BlogService';
import { formatDistanceToNow } from 'date-fns';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const data = await BlogService.getAllBlogPosts(0, 50, true); // Get only published blog posts
        setBlogPosts(data);
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4 max-w-4xl mx-auto">
        <h2 className="font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">AquaLink Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore the latest insights, updates, and stories from our seafood exporters around the world.
        </p>
      </div>

      {blogPosts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">No blog posts available yet.</p>
          <p className="mt-4 text-gray-400">Check back soon for new content!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id} className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                {/* Featured image */}
                {post.imageUrls && post.imageUrls.length > 0 ? (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.imageUrls[0]} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
                    <span className="text-blue-300 text-lg font-semibold">AquaLink Blog</span>
                  </div>
                )}
                
                {/* Content */}
                <div className="p-5">
                  <h2 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                    {post.content.length > 150 ? '...' : ''}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      {post.author?.profileImageUrl ? (
                        <img 
                          src={post.author.profileImageUrl} 
                          alt={post.author.name} 
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                      ) : (
                        <UserCircleIcon className="w-8 h-8 text-gray-400 mr-2" />
                      )}
                      <span className="text-sm text-gray-700">{post.author?.name || 'Anonymous'}</span>
                    </div>
                    
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center mr-3">
                      <span className="mr-1">👍</span> {post.likeCount || 0}
                    </div>
                    <div className="flex items-center mr-3">
                      <span className="mr-1">💬</span> {post.commentCount || 0}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;