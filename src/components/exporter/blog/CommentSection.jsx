import React, { useState, useEffect } from 'react';
import BlogService from '../../../services/BlogService';
import { UserCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // This is a placeholder - you'll need to implement this based on your auth system
  const getCurrentUser = () => {
    // Check if the user is logged in
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const userProfileImage = localStorage.getItem('userProfileImage');
    
    if (userId) {
      return {
        id: userId,
        name: userName,
        role: userRole,
        profileImageUrl: userProfileImage
      };
    }
    
    return null;
  };
  
  const isExporter = () => {
    const user = getCurrentUser();
    return user && user.role === 'EXPORTER';
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await BlogService.getCommentsForBlog(postId);
        setComments(data);
      } catch (err) {
        setError('Failed to load comments. Please try again later.');
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    const user = getCurrentUser();
    if (!user) {
      // Redirect to login or show login prompt
      alert('You must be logged in to comment.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const commentData = {
        content: newComment,
        blogPostId: postId
      };
      
      const createdComment = await BlogService.addComment(postId, commentData);
      setComments([...comments, createdComment]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post your comment. Please try again.');
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await BlogService.deleteComment(commentId);
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (err) {
        setError('Failed to delete the comment. Please try again.');
        console.error('Error deleting comment:', err);
      }
    }
  };
  
  const handleApproveComment = async (commentId) => {
    try {
      const updatedComment = await BlogService.approveComment(commentId);
      setComments(comments.map(comment => 
        comment.id === commentId ? updatedComment : comment
      ));
    } catch (err) {
      setError('Failed to approve the comment. Please try again.');
      console.error('Error approving comment:', err);
    }
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Comments</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Add a comment
          </label>
          <textarea
            id="comment"
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share your thoughts..."
            disabled={isSubmitting || !getCurrentUser()}
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim() || !getCurrentUser()}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              (isSubmitting || !newComment.trim() || !getCurrentUser()) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
        {!getCurrentUser() && (
          <p className="text-sm text-gray-500 mt-2">
            You must be logged in to comment.
          </p>
        )}
      </form>
      
      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className={`bg-white p-4 rounded-lg border ${
              comment.approved ? 'border-gray-200' : 'border-yellow-200 bg-yellow-50'
            }`}>
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  {comment.user?.profileImageUrl ? (
                    <img 
                      src={comment.user.profileImageUrl} 
                      alt={comment.user.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                  )}
                  <div>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-800 mr-2">
                        {comment.user?.name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.content}</p>
                  </div>
                </div>
                
                {/* Comment actions */}
                <div className="flex space-x-2">
                  {isExporter() && !comment.approved && (
                    <button
                      onClick={() => handleApproveComment(comment.id)}
                      className="text-green-600 hover:text-green-800"
                      title="Approve comment"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                  )}
                  
                  {(getCurrentUser()?.id === comment.user?.id || isExporter()) && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      title="Delete comment"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              
              {!comment.approved && (
                <div className="mt-2 text-xs text-yellow-700 italic">
                  This comment is awaiting approval.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;