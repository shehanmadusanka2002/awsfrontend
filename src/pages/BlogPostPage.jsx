import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { UserCircleIcon, HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import CommentSection from '../components/blog/CommentSection';
import BlogService from '../services/BlogService';

const BlogPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userReaction, setUserReaction] = useState(null);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
  }, []);
  
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await BlogService.getBlogPostById(postId);
        setBlogPost(data);
        
        // Check if user has already reacted to this post
        if (currentUser) {
          try {
            const reactions = await BlogService.getReactionsForBlog(postId);
            const userReaction = reactions.find(reaction => reaction.user?.id === currentUser.id);
            if (userReaction) {
              setUserReaction(userReaction.type);
            }
          } catch (err) {
            console.error('Error fetching user reactions:', err);
          }
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Blog post not found.');
        } else {
          setError('Failed to load blog post. Please try again later.');
        }
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (postId) {
      fetchBlogPost();
    }
  }, [postId, currentUser]);
  
  const handleReaction = async (type) => {
    if (!currentUser) {
      // Trigger login modal
      window.dispatchEvent(new CustomEvent("show-login"));
      return;
    }
    
    try {
      if (userReaction === type) {
        // Remove reaction if clicking the same button again
        await BlogService.removeReaction(postId);
        setUserReaction(null);
        setBlogPost(prev => ({
          ...prev,
          likeCount: type === 'LIKE' ? Math.max(0, prev.likeCount - 1) : prev.likeCount,
          dislikeCount: type === 'DISLIKE' ? Math.max(0, prev.dislikeCount - 1) : prev.dislikeCount
        }));
      } else {
        // Add new reaction or change existing one
        await BlogService.reactToBlogPost(postId, type);
        
        // Update UI
        setBlogPost(prev => {
          const updatedPost = { ...prev };
          
          // If switching from one reaction to another
          if (userReaction === 'LIKE' && type === 'DISLIKE') {
            updatedPost.likeCount = Math.max(0, updatedPost.likeCount - 1);
            updatedPost.dislikeCount = (updatedPost.dislikeCount || 0) + 1;
          } else if (userReaction === 'DISLIKE' && type === 'LIKE') {
            updatedPost.dislikeCount = Math.max(0, updatedPost.dislikeCount - 1);
            updatedPost.likeCount = (updatedPost.likeCount || 0) + 1;
          } else {
            // New reaction
            if (type === 'LIKE') {
              updatedPost.likeCount = (updatedPost.likeCount || 0) + 1;
            } else {
              updatedPost.dislikeCount = (updatedPost.dislikeCount || 0) + 1;
            }
          }
          
          return updatedPost;
        });
        
        setUserReaction(type);
      }
    } catch (err) {
      console.error('Error handling reaction:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar 
          dashboardName={null}
          showProfileMenu={false}
          setShowProfileMenu={() => {}}
        />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !blogPost) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar 
          dashboardName={null}
          showProfileMenu={false}
          setShowProfileMenu={() => {}}
        />
        <main className="flex-grow py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
              <p className="mb-6">{error || 'Blog post not found.'}</p>
              <Link to="/blog" className="text-blue-600 hover:underline">
                ← Back to Blog Listing
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        dashboardName={null}
        showProfileMenu={false}
        setShowProfileMenu={() => {}}
      />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/blog" className="text-blue-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog Listing
            </Link>
          </div>
          
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Featured image */}
            {blogPost.imageUrls && blogPost.imageUrls.length > 0 && (
              <div className="h-64 md:h-96 overflow-hidden">
                <img 
                  src={blogPost.imageUrls[0]} 
                  alt={blogPost.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {blogPost.title}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {blogPost.author?.profileImageUrl ? (
                    <img 
                      src={blogPost.author.profileImageUrl} 
                      alt={blogPost.author.name} 
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <UserCircleIcon className="w-10 h-10 text-gray-400 mr-3" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {blogPost.author?.name || 'Anonymous'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(blogPost.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Blog content */}
              <div 
                className="prose max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
              
              {/* Additional images */}
              {blogPost.imageUrls && blogPost.imageUrls.length > 1 && (
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {blogPost.imageUrls.slice(1).map((imageUrl, index) => (
                    <div key={index} className="aspect-w-1 aspect-h-1">
                      <img 
                        src={imageUrl} 
                        alt={`${blogPost.title} - Image ${index + 2}`} 
                        className="rounded-md object-cover w-full h-48"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Reactions section */}
              <div className="flex items-center space-x-4 border-t border-gray-100 pt-6 mt-6">
                <button
                  onClick={() => handleReaction('LIKE')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                    userReaction === 'LIKE'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {userReaction === 'LIKE' ? (
                    <HeartIconSolid className="h-5 w-5 text-blue-600" />
                  ) : (
                    <HeartIcon className="h-5 w-5" />
                  )}
                  <span>{blogPost.likeCount || 0}</span>
                </button>
                
                <button
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                  onClick={() => {
                    // Scroll to comments section
                    document.getElementById('comments-section')?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                >
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                  <span>{blogPost.commentCount || 0}</span>
                </button>
              </div>
            </div>
          </article>
          
          {/* Comments section */}
          <div id="comments-section" className="bg-white rounded-lg shadow-md p-6 mt-8">
            <CommentSection 
              blogPostId={postId}
              isExporter={currentUser?.role === 'EXPORTER'} 
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;