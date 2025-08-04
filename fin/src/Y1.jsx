import React, { useState, useRef } from 'react';
import './Y1.css';

// Mock login state - replace with your actual auth logic
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // TODO: Replace with actual auth state
  return { isLoggedIn, setIsLoggedIn };
};

// File type icons using Unicode/CSS
const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return '🖼️';
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'txt':
      return '📄';
    case 'mp3':
    case 'wav':
    case 'flac':
      return '🎵';
    case 'mp4':
    case 'avi':
    case 'mov':
      return '🎬';
    default:
      return '📎';
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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Upload File</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Select File</label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="file-input"
            />
          </div>
          
          <div className="form-group">
            <label>File Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
              className="text-input"
            />
          </div>
          
          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter file description"
              rows={3}
              className="textarea-input"
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || !fileName.trim()}
            className="upload-btn"
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
    <div className="file-item">
      <div className="file-info">
        <span className="file-icon">{getFileIcon(file.name)}</span>
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyPress={(e) => e.key === 'Enter' && handleRename()}
            className="file-rename-input"
            autoFocus
          />
        ) : (
          <div className="file-details">
            <p className="file-name">{file.name}</p>
            {file.description && (
              <p className="file-description">{file.description}</p>
            )}
          </div>
        )}
      </div>
      
      <div className="file-actions">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="action-btn edit-btn"
          title="Rename"
        >
          ✏️
        </button>
        <button
          onClick={handleDelete}
          className="action-btn delete-btn"
          title="Delete"
        >
          🗑️
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
      <div className="login-required">
        <div className="login-message">
          <h2>Please Login</h2>
          <p>You need to be logged in to access the chat interface.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Sidebar Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Uploaded Files</h2>
          <button onClick={() => setSidebarOpen(false)} className="close-sidebar-btn">×</button>
        </div>
        
        <div className="sidebar-content">
          {files.length === 0 ? (
            <p className="no-files">No files uploaded yet</p>
          ) : (
            <div className="files-list">
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
      <div className="main-chat">
        {/* Header */}
        <div className="chat-header">
          <button onClick={() => setSidebarOpen(true)} className="menu-btn">☰</button>
          <h1>Ask.....?</h1>
          <div className="spacer"></div>
        </div>

        {/* Messages Area */}
        <div className="messages-area">
          {messages.length === 0 ? (
            <div className="empty-messages">
              <p>Start a conversation...</p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map(message => (
                <div key={message.id} className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="upload-btn-input"
              title="Upload file"
            >
              📎
            </button>
            
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything..."
              className="message-input"
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="send-btn"
              title="Send message"
            >
              ➤
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
    </div>
  );
};

export default Chat;