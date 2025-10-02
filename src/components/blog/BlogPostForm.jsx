import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import BlogService from '../../services/BlogService';

const BlogPostForm = ({ editMode = false }) => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [loading, setLoading] = useState(editMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: false,
    removedImageUrls: []
  });
  
  const editorRef = useRef(null);
  
  useEffect(() => {
    if (editMode && postId) {
      const fetchBlogPost = async () => {
        try {
          setLoading(true);
          const blogPost = await BlogService.getBlogPostById(postId);
          setFormData({
            title: blogPost.title || '',
            content: blogPost.content || '',
            published: blogPost.published || false,
            removedImageUrls: []
          });
          
          // Setup existing images for preview
          if (blogPost.imageUrls && blogPost.imageUrls.length > 0) {
            setPreviewImages(blogPost.imageUrls.map(url => ({
              url,
              isExisting: true
            })));
          }
        } catch (err) {
          setError('Failed to load blog post data. Please try again.');
          console.error('Error fetching blog post:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchBlogPost();
    }
  }, [editMode, postId]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviewImages = files.map(file => ({
      url: URL.createObjectURL(file),
      isExisting: false,
      file
    }));
    
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
  };
  
  const removeImage = (index) => {
    const imageToRemove = previewImages[index];
    
    if (imageToRemove.isExisting) {
      // If it's an existing image, mark it for removal on the server
      setFormData(prev => ({
        ...prev,
        removedImageUrls: [...prev.removedImageUrls, imageToRemove.url]
      }));
    } else {
      // If it's a new image, remove it from the files array
      const updatedImages = images.filter(image => 
        URL.createObjectURL(image) !== imageToRemove.url
      );
      setImages(updatedImages);
    }
    
    // Remove from preview
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      const blogPostData = {
        title: formData.title,
        content: formData.content,
        published: formData.published,
      };
      
      if (editMode) {
        // For edit mode, include removed images
        blogPostData.removedImageUrls = formData.removedImageUrls;
        await BlogService.updateBlogPost(postId, blogPostData, images);
      } else {
        // For create mode
        await BlogService.createBlogPost(blogPostData, images);
      }
      
      // Navigate back to blog management
      navigate('/dashboard/Exporter/blog');
    } catch (err) {
      setError('Failed to save blog post. Please check your form and try again.');
      console.error('Error saving blog post:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">
        {editMode ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Post Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter post title"
            required
          />
        </div>
        
        {/* Content - TinyMCE Editor */}
        <div>
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
            Post Content
          </label>
          <Editor
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={formData.content}
            init={{
              height: 400,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
            onEditorChange={handleEditorChange}
          />
        </div>
        
        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Post Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <label htmlFor="images" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center">
                <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="text-sm text-gray-600">Click to upload images</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</p>
              </div>
            </label>
          </div>
          
          {/* Image Previews */}
          {previewImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previewImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image.url} 
                    alt={`Preview ${index}`} 
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Published Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-gray-700">
            Publish immediately
          </label>
        </div>
        
        {/* Form Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/Exporter/blog')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              `${editMode ? 'Update' : 'Create'} Blog Post`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;