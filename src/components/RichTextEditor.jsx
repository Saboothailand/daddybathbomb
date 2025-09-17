import React, { useState, useRef } from 'react';

export default function RichTextEditor({ value = '', onChange, placeholder = 'Enter product description...' }) {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedSize, setSelectedSize] = useState('16');
  const editorRef = useRef();

  const colors = [
    '#000000', '#333333', '#666666', '#999999', '#cccccc',
    '#ff0000', '#ff6600', '#ffcc00', '#33cc00', '#0066cc',
    '#6600cc', '#cc0066', '#ffffff'
  ];

  const fontSizes = [
    { label: 'Small', value: '12' },
    { label: 'Normal', value: '16' },
    { label: 'Large', value: '20' },
    { label: 'X-Large', value: '24' },
    { label: 'XX-Large', value: '32' }
  ];

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    executeCommand('foreColor', color);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    executeCommand('fontSize', size);
  };

  const toolbarButtons = [
    { command: 'bold', icon: 'B', title: 'Bold', style: 'font-bold' },
    { command: 'italic', icon: 'I', title: 'Italic', style: 'italic' },
    { command: 'underline', icon: 'U', title: 'Underline', style: 'underline' },
    { command: 'strikeThrough', icon: 'S', title: 'Strikethrough', style: 'line-through' },
    { type: 'separator' },
    { command: 'justifyLeft', icon: '⬅', title: 'Align Left' },
    { command: 'justifyCenter', icon: '⬌', title: 'Center' },
    { command: 'justifyRight', icon: '➡', title: 'Align Right' },
    { type: 'separator' },
    { command: 'insertUnorderedList', icon: '•', title: 'Bullet List' },
    { command: 'insertOrderedList', icon: '1.', title: 'Numbered List' },
    { type: 'separator' },
    { command: 'createLink', icon: '🔗', title: 'Insert Link', action: () => {
      const url = prompt('Enter URL:');
      if (url) executeCommand('createLink', url);
    }},
    { command: 'insertImage', icon: '📷', title: 'Insert Image', action: insertImage }
  ];

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-3 flex items-center gap-2 flex-wrap">
        {/* Font Size */}
        <select
          value={selectedSize}
          onChange={(e) => handleSizeChange(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
        >
          {fontSizes.map(size => (
            <option key={size.value} value={size.value}>{size.label}</option>
          ))}
        </select>

        {/* Color Picker */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">Color:</span>
          <div className="flex gap-1">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-6 h-6 rounded border-2 ${
                  selectedColor === color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Formatting Buttons */}
        {toolbarButtons.map((button, index) => {
          if (button.type === 'separator') {
            return <div key={index} className="w-px h-6 bg-gray-300 mx-1" />;
          }

          return (
            <button
              key={button.command || index}
              onClick={button.action || (() => executeCommand(button.command))}
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded transition-colors"
              title={button.title}
              style={button.style ? { textDecoration: button.style === 'line-through' ? 'line-through' : 'none' } : {}}
            >
              <span className={button.style}>{button.icon}</span>
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[300px] p-4 focus:outline-none"
        style={{ fontSize: `${selectedSize}px` }}
        onInput={updateContent}
        dangerouslySetInnerHTML={{ __html: value }}
        placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  );
}
