import React, { useState, useEffect } from 'react';
import BlogService from '../../../services/BlogService';
import { useNavigate } from 'react-router-dom';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import BlogPostCard from './BlogPostCard';

const BlogManagement = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const data = await BlogService.getAllBlogPosts(0, 50, null); // Get all blog posts, published or not
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

  const handleCreatePost = () => {
    navigate('/exporter/blog/create');
  };

  const handleEdit = (postId) => {
    navigate(`/exporter/blog/edit/${postId}`);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        await BlogService.deleteBlogPost(postId);
        setBlogPosts(blogPosts.filter(post => post.id !== postId));
      } catch (err) {
        setError('Failed to delete blog post. Please try again later.');
        console.error('Error deleting blog post:', err);
      }
    }
  };

  const handlePublishToggle = async (post) => {
    try {
      if (post.published) {
        const updatedPost = await BlogService.unpublishBlogPost(post.id);
        setBlogPosts(blogPosts.map(p => p.id === post.id ? updatedPost : p));
      } else {
        const updatedPost = await BlogService.publishBlogPost(post.id);
        setBlogPosts(blogPosts.map(p => p.id === post.id ? updatedPost : p));
      }
    } catch (err) {
      setError(`Failed to ${post.published ? 'unpublish' : 'publish'} blog post. Please try again later.`);
      console.error('Error toggling publish state:', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Blog Management</h2>
        <button
          onClick={handleCreatePost}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Create New Post
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {blogPosts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">You haven't created any blog posts yet.</p>
          <button
            onClick={handleCreatePost}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map(post => (
            <BlogPostCard
              key={post.id}
              post={post}
              onEdit={() => handleEdit(post.id)}
              onDelete={() => handleDelete(post.id)}
              onPublishToggle={() => handlePublishToggle(post)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogManagement;