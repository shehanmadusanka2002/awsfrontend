import React from 'react';
import { formatDistance } from 'date-fns';
import { PencilIcon, TrashIcon, EyeIcon, GlobeAltIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const BlogPostCard = ({ post, onEdit, onDelete, onPublishToggle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      {/* Featured image */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="h-48 overflow-hidden">
          <img 
            src={post.imageUrls[0]} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            post.published 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {post.published ? 'Published' : 'Draft'}
          </span>
          <span className="text-xs text-gray-500">
            {formatDistance(new Date(post.createdAt), new Date(), { addSuffix: true })}
          </span>
        </div>
        
        <h3 className="font-bold text-xl mb-2 text-gray-800">{post.title}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}
          {post.content.length > 150 ? '...' : ''}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <div className="flex items-center mr-4">
            <span className="mr-1">👍</span> {post.likeCount || 0}
          </div>
          <div className="flex items-center mr-4">
            <span className="mr-1">👎</span> {post.dislikeCount || 0}
          </div>
          <div className="flex items-center">
            <span className="mr-1">💬</span> {post.commentCount || 0}
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between">
        <div>
          <button
            onClick={onPublishToggle}
            className={`mr-2 inline-flex items-center p-2 rounded-full ${
              post.published
                ? 'text-orange-600 hover:bg-orange-100'
                : 'text-green-600 hover:bg-green-100'
            }`}
            title={post.published ? 'Unpublish' : 'Publish'}
          >
            {post.published ? (
              <LockClosedIcon className="h-5 w-5" />
            ) : (
              <GlobeAltIcon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => window.open(`/blog/${post.id}`, '_blank')}
            className="inline-flex items-center p-2 rounded-full text-blue-600 hover:bg-blue-100"
            title="View post"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </div>
        <div>
          <button
            onClick={onEdit}
            className="mr-2 inline-flex items-center p-2 rounded-full text-indigo-600 hover:bg-indigo-100"
            title="Edit post"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center p-2 rounded-full text-red-600 hover:bg-red-100"
            title="Delete post"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;