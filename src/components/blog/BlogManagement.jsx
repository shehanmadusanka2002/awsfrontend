import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ArrowPathIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import BlogService from '../../services/BlogService';

const BlogManagement = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'published', 'draft'

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
  }, []);

  const fetchBlogPosts = async (resetPage = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const newPage = resetPage ? 0 : page;
      let published = null;
      
      if (selectedFilter === 'published') {
        published = true;
      } else if (selectedFilter === 'draft') {
        published = false;
      }
      
      // If user is logged in, fetch their blog posts
      let data = [];
      if (currentUser?.id) {
        data = await BlogService.getBlogPostsByUser(currentUser.id, newPage, 10);
      } else {
        data = await BlogService.getAllBlogPosts(newPage, 10, published);
      }
      
      setBlogPosts(prev => newPage === 0 ? data : [...prev, ...data]);
      setHasMore(data.length === 10);
      if (resetPage) setPage(0);
    } catch (err) {
      setError('Failed to load blog posts. Please try again later.');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts(true);
  }, [currentUser, selectedFilter]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    fetchBlogPosts();
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }
    
    try {
      await BlogService.deleteBlogPost(id);
      setBlogPosts(prev => prev.filter(post => post.id !== id));
    } catch (err) {
      setError('Failed to delete blog post.');
      console.error('Error deleting blog post:', err);
    }
  };

  const handlePublishToggle = async (id, currentStatus) => {
    try {
      const updatedPost = currentStatus
        ? await BlogService.unpublishBlogPost(id)
        : await BlogService.publishBlogPost(id);
      
      setBlogPosts(prev => 
        prev.map(post => 
          post.id === id ? updatedPost : post
        )
      );
    } catch (err) {
      setError(`Failed to ${currentStatus ? 'unpublish' : 'publish'} blog post.`);
      console.error('Error toggling publish status:', err);
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
        <Link
          to="/dashboard/Exporter/blog/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          New Blog Post
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`pb-3 px-1 ${
              selectedFilter === 'all'
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleFilterChange('all')}
          >
            All Posts
          </button>
          <button
            className={`pb-3 px-1 ${
              selectedFilter === 'published'
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleFilterChange('published')}
          >
            Published
          </button>
          <button
            className={`pb-3 px-1 ${
              selectedFilter === 'draft'
                ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleFilterChange('draft')}
          >
            Drafts
          </button>
        </nav>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Refresh button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => fetchBlogPosts(true)}
          className="flex items-center text-gray-600 hover:text-gray-900"
          title="Refresh"
        >
          <ArrowPathIcon className="h-5 w-5 mr-1" />
          <span className="text-sm">Refresh</span>
        </button>
      </div>

      {/* Loading state */}
      {loading && page === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <>
          {/* Blog posts list */}
          {blogPosts.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
              <p className="text-gray-500 mb-6">
                {selectedFilter === 'all'
                  ? "You haven't created any blog posts yet."
                  : selectedFilter === 'published'
                  ? "You don't have any published posts."
                  : "You don't have any drafts."}
              </p>
              <Link
                to="/dashboard/Exporter/blog/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Post
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engagement
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {/* Thumbnail */}
                          <div className="h-10 w-10 flex-shrink-0 mr-3">
                            {post.imageUrls && post.imageUrls.length > 0 ? (
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={post.imageUrls[0]}
                                alt=""
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No img</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {post.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {post.content?.replace(/<[^>]*>/g, '').substring(0, 50)}
                              {post.content?.length > 50 ? '...' : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <span className="mr-1">👍</span> {post.likeCount || 0}
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">💬</span> {post.commentCount || 0}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handlePublishToggle(post.id, post.published)}
                            className={`p-1 rounded-full ${
                              post.published
                                ? 'text-yellow-500 hover:bg-yellow-100'
                                : 'text-green-500 hover:bg-green-100'
                            }`}
                            title={post.published ? 'Unpublish' : 'Publish'}
                          >
                            {post.published ? (
                              <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>

                          <Link
                            to={`/dashboard/Exporter/blog/edit/${post.id}`}
                            className="p-1 rounded-full text-blue-500 hover:bg-blue-100"
                            title="Edit"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>

                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1 rounded-full text-red-500 hover:bg-red-100"
                            title="Delete"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Load more button */}
          {hasMore && blogPosts.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                    Loading...
                  </span>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogManagement;