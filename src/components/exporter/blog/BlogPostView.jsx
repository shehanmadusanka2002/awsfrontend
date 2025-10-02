import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BlogService from '../../../services/BlogService';
import { UserCircleIcon, ChatBubbleLeftIcon, ThumbUpIcon, ThumbDownIcon } from '@heroicons/react/24/outline';
import { ThumbUpIcon as ThumbUpSolid, ThumbDownIcon as ThumbDownSolid } from '@heroicons/react/24/solid';
import CommentSection from './CommentSection';

const BlogPostView = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userReaction, setUserReaction] = useState(null); // 'LIKE', 'DISLIKE', null
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        const data = await BlogService.getBlogPostById(postId);
        setPost(data);
        
        // Check if the current user has reacted to this post
        const reactions = await BlogService.getReactionsForBlog(postId);
        const userReaction = reactions.find(reaction => 
          reaction.user?.id === getCurrentUserId() // You'll need to implement getCurrentUserId()
        );
        
        if (userReaction) {
          setUserReaction(userReaction.reactionType);
        }
      } catch (err) {
        setError('Failed to load the blog post. It may have been removed or is not published.');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [postId]);

  // This is a placeholder - you'll need to implement this based on your auth system
  const getCurrentUserId = () => {
    // Get the current user ID from your authentication system
    return localStorage.getItem('userId');
  };

  const handleReaction = async (reactionType) => {
    try {
      if (userReaction === reactionType) {
        // If user clicks the same reaction again, remove it
        await BlogService.removeReaction(postId);
        setUserReaction(null);
        
        // Update counts
        if (reactionType === 'LIKE') {
          setPost({...post, likeCount: post.likeCount - 1});
        } else {
          setPost({...post, dislikeCount: post.dislikeCount - 1});
        }
      } else {
        // If user had a different reaction before, remove it first
        if (userReaction) {
          // Update counts for old reaction
          if (userReaction === 'LIKE') {
            setPost({...post, likeCount: post.likeCount - 1});
          } else {
            setPost({...post, dislikeCount: post.dislikeCount - 1});
          }
        }
        
        // Add the new reaction
        await BlogService.reactToBlogPost(postId, reactionType);
        setUserReaction(reactionType);
        
        // Update counts for new reaction
        if (reactionType === 'LIKE') {
          setPost({...post, likeCount: post.likeCount + 1});
        } else {
          setPost({...post, dislikeCount: post.dislikeCount + 1});
        }
      }
    } catch (err) {
      console.error('Error handling reaction:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
        <h2 className="font-bold">Error</h2>
        <p>{error}</p>
        <Link to="/blog" className="text-blue-600 hover:underline mt-2 inline-block">
          Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Blog post header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
        
        <div className="flex items-center justify-between text-gray-500 mb-6">
          <div className="flex items-center">
            {post.author?.profileImageUrl ? (
              <img 
                src={post.author.profileImageUrl} 
                alt={post.author.name} 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
            ) : (
              <UserCircleIcon className="w-10 h-10 text-gray-400 mr-3" />
            )}
            <div>
              <p className="font-semibold text-gray-700">{post.author?.name || 'Anonymous'}</p>
              <p className="text-sm">
                Published {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {post.updatedAt !== post.createdAt && (
            <span className="text-sm italic">
              Updated {new Date(post.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      
      {/* Featured image */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="mb-8">
          <img
            src={post.imageUrls[0]}
            alt={post.title}
            className="w-full rounded-lg shadow-md"
          />
        </div>
      )}
      
      {/* Blog content */}
      <div className="prose prose-lg max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      
      {/* Additional images */}
      {post.imageUrls && post.imageUrls.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {post.imageUrls.slice(1).map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`${post.title} image ${index + 2}`}
              className="w-full h-48 object-cover rounded-lg shadow-sm"
            />
          ))}
        </div>
      )}
      
      {/* Reactions and comments */}
      <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row sm:justify-between">
        {/* Reactions */}
        <div className="flex items-center space-x-6 mb-4 sm:mb-0">
          <button
            className="flex items-center space-x-2 group"
            onClick={() => handleReaction('LIKE')}
            disabled={!getCurrentUserId()}
          >
            {userReaction === 'LIKE' ? (
              <ThumbUpSolid className="h-6 w-6 text-blue-600" />
            ) : (
              <ThumbUpIcon className="h-6 w-6 text-gray-500 group-hover:text-blue-600" />
            )}
            <span className={userReaction === 'LIKE' ? 'font-semibold text-blue-600' : 'text-gray-700'}>
              {post.likeCount || 0}
            </span>
          </button>
          
          <button
            className="flex items-center space-x-2 group"
            onClick={() => handleReaction('DISLIKE')}
            disabled={!getCurrentUserId()}
          >
            {userReaction === 'DISLIKE' ? (
              <ThumbDownSolid className="h-6 w-6 text-red-600" />
            ) : (
              <ThumbDownIcon className="h-6 w-6 text-gray-500 group-hover:text-red-600" />
            )}
            <span className={userReaction === 'DISLIKE' ? 'font-semibold text-red-600' : 'text-gray-700'}>
              {post.dislikeCount || 0}
            </span>
          </button>
        </div>
        
        {/* Comments toggle */}
        <button
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          onClick={() => setShowComments(!showComments)}
        >
          <ChatBubbleLeftIcon className="h-6 w-6" />
          <span>{post.commentCount || 0} Comments</span>
        </button>
      </div>
      
      {/* Comments section */}
      {showComments && (
        <CommentSection postId={postId} />
      )}
    </div>
  );
};

export default BlogPostView;