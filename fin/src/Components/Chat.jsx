import React, { useState,useRef } from 'react'
// import send from './assets/send.svg';
// import upload from './assets/upload.svg';
import sideBar from '../assets/sideBar.svg';
import Spline from '@splinetool/react-spline';
import { X, Upload, Send, Menu, Edit2, Trash2, File, Image, FileText, Music, Video } from 'lucide-react';
import './Chat.css';
import api from '../api'; 
import { useDispatch , useSelector } from 'react-redux';

 
function Chat() {
  
  const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg': return 'jpg';
    case 'jpeg':return 'jpeg';
    case 'png': return 'png';
    case 'pdf':return 'pdf';
    case 'doc':
    case 'docx':
      return 'doc';
    case 'txt':
      return 'txt';
    default:
      return 'unknown';
  }
};


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
  }};


   const [uploadModalOpen,setUploadModalOpen]=useState(false);
const [sidebarOpen,setSidebarOpen]=useState(false);
const [files,setFiles]=useState('')
const [messages, setMessages] = useState([]); // TODO: Replace with chat messages from backend
  const [inputMessage, setInputMessage] = useState('');


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

  // const handleSendMessage = () => {
  //   if (inputMessage.trim()) {
  //     const newMessage = {
  //       id: Date.now(),
  //       text: inputMessage,
  //       sender: 'user',
  //       timestamp: new Date().toISOString()
  //     };
      
  //     setMessages(prev => [...prev, newMessage]);
  //     setInputMessage('');
      
  //     // TODO: Send message to your AI backend
  //     // sendMessageToAI(inputMessage);
  //   }
  // };







 
const handleSendMessage = async () => {
  if (inputMessage.trim()) {
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      // 👇 Send message to backend
      const res = await api.post('/chats', {
        message: userMessage.text
      });

      const aiMessage = {
        id: Date.now() + 1,
        text: res.data.reply, // assuming reply is in this field
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Failed to get response from AI backend:', err);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, something went wrong.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }
};


  return (
    <div className='all'>
      <div className={`sideBar ${sidebarOpen ? 'sidebar-open' : 'sidebar-close'}`}>
        <h2>
          Uploaded Files
        </h2>
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

      <div className="left">
        <div className="bg_spline">
        <Spline scene="https://prod.spline.design/9bpGqvSTH0SW14lj/scene.splinecode" />
      </div>
      
        <div className="side_opener">
          <button onClick={()=>setSidebarOpen(!sidebarOpen)}><img src={sideBar} alt="sideBar Slider" /></button>
        </div>
      </div>


      <div className="right">
        <div className="chat_container">

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

          <div className="chatInput_container">
            <input
              type="text"
               value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything"
              className="chat_input"
            />

            <div className="tools">
            <div className="leftTool">
              <button onClick={()=>setUploadModalOpen(true)}><Upload/></button>
            </div>
            <div className="rightTool">
              <button
               onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              >
                <Send/>
              </button>
            </div>
            </div>

             <FileUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
          </div>
          
          
        </div>
        
      </div>
      
    </div>
  )
}

export default Chat
