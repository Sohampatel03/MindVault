import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Image, X, FileImage } from 'lucide-react';

const ImageUpload = ({ onImageSelect, selectedImage, onRemoveImage }) => {
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      onImageSelect({
        file: file,
        preview: previewUrl,
        name: file.name,
        size: file.size
      });
    }
    setDragOver(false);
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false,
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false)
  });

  return (
    <div className="space-y-4">
      {!selectedImage ? (
        <motion.div
          {...getRootProps()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
            ${isDragActive || dragOver 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <motion.div
              animate={{ 
                scale: isDragActive ? 1.1 : 1,
                rotate: isDragActive ? 5 : 0 
              }}
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                isDragActive ? 'bg-indigo-100' : 'bg-gray-100'
              }`}
            >
              <Upload className={`w-8 h-8 ${isDragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
            </motion.div>
            
            <div>
              <p className={`text-lg font-medium ${isDragActive ? 'text-indigo-600' : 'text-gray-900'}`}>
                {isDragActive ? 'Drop image here' : 'Upload an image'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Drag & drop an image, or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports: PNG, JPG, JPEG, GIF, WebP
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white border border-gray-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <FileImage className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="font-medium text-gray-900">{selectedImage.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onRemoveImage}
              className="p-1 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-red-500" />
            </motion.button>
          </div>
          
          <div className="relative overflow-hidden rounded-lg bg-gray-50">
            <img
              src={selectedImage.preview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="text-white text-sm">Preview</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ImageUpload;