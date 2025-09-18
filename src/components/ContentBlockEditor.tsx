// @ts-nocheck
import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';

export default function ContentBlockEditor({ isOpen, onClose, onSave, block = null }) {
  const [blockData, setBlockData] = useState(block || {
    block_type: 'text',
    title: '',
    content: '',
    image_url: '',
    link_url: '',
    settings: {},
    display_order: 0,
    is_visible: true
  });

  if (!isOpen) return null;

  const blockTypes = [
    { value: 'text', label: 'Text Content', icon: '📝' },
    { value: 'image', label: 'Image', icon: '🖼️' },
    { value: 'gallery', label: 'Image Gallery', icon: '🖼️' },
    { value: 'video', label: 'Video', icon: '🎥' },
    { value: 'button', label: 'Call-to-Action Button', icon: '🔘' },
    { value: 'quote', label: 'Quote/Testimonial', icon: '💬' },
    { value: 'list', label: 'List/Features', icon: '📋' },
    { value: 'divider', label: 'Section Divider', icon: '➖' }
  ];

  const handleSave = () => {
    if (!blockData.title && blockData.block_type !== 'divider') {
      alert('Please enter a title for this content block');
      return;
    }
    
    onSave(blockData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
              {block ? 'Edit Content Block' : 'Add New Content Block'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Panel */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Block Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {blockTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setBlockData({...blockData, block_type: type.value})}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        blockData.block_type === type.value
                          ? 'bg-pink-500 text-white border-pink-500'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-lg mb-1">{type.icon}</div>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                <input
                  type="number"
                  value={blockData.display_order}
                  onChange={(e) => setBlockData({...blockData, display_order: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  min="0"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={blockData.is_visible}
                  onChange={(e) => setBlockData({...blockData, is_visible: e.target.checked})}
                  className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                />
                <label htmlFor="isVisible" className="text-sm font-medium text-gray-700">
                  Visible on website
                </label>
              </div>
            </div>

            {/* Content Panel */}
            <div className="lg:col-span-2 space-y-6">
              {blockData.block_type !== 'divider' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Block Title</label>
                  <input
                    type="text"
                    value={blockData.title}
                    onChange={(e) => setBlockData({...blockData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter block title"
                  />
                </div>
              )}

              {/* Content based on block type */}
              {blockData.block_type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <RichTextEditor
                    value={blockData.content}
                    onChange={(content) => setBlockData({...blockData, content})}
                    placeholder="Enter your content here..."
                  />
                </div>
              )}

              {(blockData.block_type === 'image' || blockData.block_type === 'gallery') && (
                <div>
                  <ImageUpload
                    currentImage={blockData.image_url}
                    onImageUpload={(url) => setBlockData({...blockData, image_url: url})}
                    label="Block Image"
                  />
                </div>
              )}

              {blockData.block_type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                  <input
                    type="url"
                    value={blockData.link_url}
                    onChange={(e) => setBlockData({...blockData, link_url: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              )}

              {blockData.block_type === 'button' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                    <input
                      type="text"
                      value={blockData.content}
                      onChange={(e) => setBlockData({...blockData, content: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Button text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
                    <input
                      type="url"
                      value={blockData.link_url}
                      onChange={(e) => setBlockData({...blockData, link_url: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              )}

              {blockData.block_type === 'quote' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quote Text</label>
                    <textarea
                      value={blockData.content}
                      onChange={(e) => setBlockData({...blockData, content: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter quote text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                    <input
                      type="text"
                      value={blockData.settings?.author || ''}
                      onChange={(e) => setBlockData({...blockData, settings: {...blockData.settings, author: e.target.value}})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Quote author"
                    />
                  </div>
                </div>
              )}

              {blockData.block_type === 'list' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">List Items (one per line)</label>
                  <textarea
                    value={blockData.content}
                    onChange={(e) => setBlockData({...blockData, content: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Item 1&#10;Item 2&#10;Item 3"
                  />
                </div>
              )}

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  {blockData.block_type === 'text' && (
                    <div>
                      {blockData.title && <h3 className="text-lg font-bold mb-2">{blockData.title}</h3>}
                      <div dangerouslySetInnerHTML={{ __html: blockData.content }} />
                    </div>
                  )}
                  
                  {blockData.block_type === 'image' && (
                    <div>
                      {blockData.title && <h3 className="text-lg font-bold mb-2">{blockData.title}</h3>}
                      {blockData.image_url && (
                        <img src={blockData.image_url} alt={blockData.title} className="w-full h-32 object-cover rounded" />
                      )}
                    </div>
                  )}
                  
                  {blockData.block_type === 'button' && (
                    <div className="text-center">
                      <button className="bg-pink-500 text-white px-6 py-3 rounded-xl font-medium">
                        {blockData.content || 'Button Text'}
                      </button>
                    </div>
                  )}
                  
                  {blockData.block_type === 'quote' && (
                    <blockquote className="border-l-4 border-pink-500 pl-4 italic">
                      <p>"{blockData.content}"</p>
                      {blockData.settings?.author && (
                        <cite className="text-sm text-gray-600 mt-2 block">— {blockData.settings.author}</cite>
                      )}
                    </blockquote>
                  )}
                  
                  {blockData.block_type === 'divider' && (
                    <hr className="border-gray-300 my-4" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 font-medium"
            >
              {block ? 'Update Block' : 'Add Block'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
