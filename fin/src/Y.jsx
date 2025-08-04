import React, { useState, useRef } from 'react';
import { X, Upload, Send, Menu, Edit2, Trash2, File, Image, FileText, Music, Video } from 'lucide-react';

// Mock login state - replace with your actual auth logic
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // TODO: Replace with actual auth state
  return { isLoggedIn, setIsLoggedIn };
};

// File type icons mapping
const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return <Image className="w-4 h-4" />;
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText className="w-4 h-4" />;
    case 'mp3':
    case 'wav':
    case 'flac':
      return <Music className="w-4 h-4" />;
    case 'mp4':
    case 'avi':
    case 'mov':
      return <Video className="w-4 h-4" />;
    default:
      return <File className="w-4 h-4" />;
  }
};

// File Upload Modal Component
const FileUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleUpload = () => {
    if (selectedFile && fileName.trim()) {
      const fileData = {
        id: Date.now(), // TODO: Replace with proper ID from backend
        name: fileName,
        description: description,
        file: selectedFile,
        type: selectedFile.type,
        size: selectedFile.size,
        uploadedAt: new Date().toISOString()
      };
      
      // TODO: Integrate with your MongoDB backend
      // uploadFileToBackend(fileData);
      
      onUpload(fileData);
      
      // Reset form
      setFileName('');
      setDescription('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-90vw">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Upload File</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              File Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter file description"
              rows={3}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || !fileName.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

// File Item Component
const FileItem = ({ file, onRename, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(file.name);

  const handleRename = () => {
    if (newName.trim() && newName !== file.name) {
      // TODO: Integrate with your MongoDB backend
      // updateFileInBackend(file.id, { name: newName });
      onRename(file.id, newName);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      // TODO: Integrate with your MongoDB backend
      // deleteFileFromBackend(file.id);
      onDelete(file.id);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {getFileIcon(file.name)}
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyPress={(e) => e.key === 'Enter' && handleRename()}
            className="flex-1 bg-gray-800 text-white text-sm px-2 py-1 rounded border border-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            autoFocus
          />
        ) : (
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{file.name}</p>
            {file.description && (
              <p className="text-gray-400 text-xs truncate">{file.description}</p>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Main Chat Component
const Chat = () => {
  const { isLoggedIn } = useAuth(); // TODO: Replace with your actual auth hook
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [files, setFiles] = useState([]); // TODO: Replace with data from MongoDB
  const [messages, setMessages] = useState([]); // TODO: Replace with chat messages from backend
  const [inputMessage, setInputMessage] = useState('');

  // TODO: Load files from MongoDB on component mount
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     loadUserFiles();
  //   }
  // }, [isLoggedIn]);

  const handleFileUpload = (fileData) => {
    setFiles(prev => [...prev, fileData]);
  };

  const handleFileRename = (fileId, newName) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, name: newName } : file
    ));
  };

  const handleFileDelete = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
      
      // TODO: Send message to your AI backend
      // sendMessageToAI(inputMessage);
    }
  };

  // Login required screen
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
          <p className="text-gray-400">You need to be logged in to access the chat interface.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Uploaded Files</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {files.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No files uploaded yet</p>
          ) : (
            <div className="space-y-3">
              {files.map(file => (
                <FileItem
                  key={file.id}
                  file={file}
                  onRename={handleFileRename}
                  onDelete={handleFileDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">Ask.....?</h1>
          <div className="w-6 h-6"></div> {/* Spacer */}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-lg">Start a conversation...</p>
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-2">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
            </button>
            
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Chat;