import React, { useState, useEffect } from 'react';

// Main App component
const ItemPage = () => {
  // State to store text input
  const [textInput, setTextInput] = useState('');
  // State to store the name for text upload
  const [textName, setTextName] = useState('');
  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState(null);
  // State to store the name for file upload
  const [fileNameInput, setFileNameInput] = useState('');
  // State to store uploaded items (text and file names)
  const [uploadedItems, setUploadedItems] = useState([]);
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);
  // State for messages (success/error)
  const [message, setMessage] = useState('');

  // Function to fetch uploaded items from the backend
  const fetchUploadedItems = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      // Replace with your actual backend URL
      const response = await fetch('http://localhost:5000/api/items');
      if (!response.ok) {
        // If response is not OK, it might be a server-side error, not just network
        const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
        throw new Error(`HTTP error! status: ${response.status}. ${errorData.message || ''}`);
      }
      const data = await response.json();
      setUploadedItems(data);
    } catch (error) {
      console.error('Error fetching uploaded items:', error);
      // Enhanced error message for network issues
      setMessage('Failed to load items. Please ensure the backend server is running and accessible at http://localhost:5000.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch items on component mount
  useEffect(() => {
    fetchUploadedItems();
  }, []);

  // Handler for text input changes
  const handleTextInputChange = (e) => {
    setTextInput(e.target.value);
  };

  // Handler for text name input changes
  const handleTextNameChange = (e) => {
    setTextName(e.target.value);
  };

  // Handler for file input changes
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handler for file name input changes
  const handleFileNameInputChange = (e) => {
    setFileNameInput(e.target.value);
  };

  // Handler for text upload
  const handleTextUpload = async () => {
    if (!textInput.trim() || !textName.trim()) {
      setMessage('Name and text content are required.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    try {
      // Replace with your actual backend URL
      const response = await fetch('http://localhost:5000/api/items/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: textName, content: textInput }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
        throw new Error(`HTTP error! status: ${response.status}. ${errorData.message || ''}`);
      }

      const result = await response.json();
      setMessage(result.message || 'Text uploaded successfully!');
      setTextInput(''); // Clear text input
      setTextName(''); // Clear name input
      fetchUploadedItems(); // Refresh the list
    } catch (error) {
      console.error('Error uploading text:', error);
      // Enhanced error message for network issues
      setMessage('Failed to upload text. Please ensure the backend server is running and accessible at http://localhost:5000.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for file upload
  const handleFileUpload = async () => {
    if (!selectedFile || !fileNameInput.trim()) {
      setMessage('Name and a file are required.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    // Create FormData to send file and name
    const formData = new FormData();
    formData.append('name', fileNameInput); // Append the name
    formData.append('file', selectedFile);

    try {
      // Replace with your actual backend URL
      const response = await fetch('http://localhost:5000/api/items/file', {
        method: 'POST',
        body: formData, // No Content-Type header needed for FormData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
        throw new Error(`HTTP error! status: ${response.status}. ${errorData.message || ''}`);
      }

      const result = await response.json();
      setMessage(result.message || 'File uploaded successfully!');
      setSelectedFile(null); // Clear selected file
      setFileNameInput(''); // Clear name input
      // Reset file input value
      document.getElementById('file-input').value = '';
      fetchUploadedItems(); // Refresh the list
    } catch (error) {
      console.error('Error uploading file:', error);
      // Enhanced error message for network issues
      setMessage('Failed to upload file. Please ensure the backend server is running and accessible at http://localhost:5000.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-500">
            Content Uploader
          </span>
        </h1>

        {/* Message display */}
        {message && (
          <div className={`p-3 mb-4 rounded-md text-center ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Text Upload Section */}
        <div className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upload Text</h2>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out mb-4"
            placeholder="Enter a name for your text"
            value={textName}
            onChange={handleTextNameChange}
          />
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out resize-y min-h-[100px]"
            placeholder="Enter your text here..."
            value={textInput}
            onChange={handleTextInputChange}
          ></textarea>
          <button
            onClick={handleTextUpload}
            className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-md shadow-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload Text'}
          </button>
        </div>

        {/* File Upload Section */}
        <div className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upload File</h2>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200 ease-in-out mb-4"
            placeholder="Enter a name for your file"
            value={fileNameInput}
            onChange={handleFileNameInputChange}
          />
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {selectedFile && (
            <p className="text-sm text-gray-600 mt-2">Selected file: <span className="font-medium">{selectedFile.name}</span></p>
          )}
          <button
            onClick={handleFileUpload}
            className="mt-4 w-full bg-gradient-to-r from-teal-500 to-green-600 text-white py-3 px-6 rounded-md shadow-lg hover:from-teal-600 hover:to-green-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>

        {/* Uploaded Items List */}
        <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Uploaded Items</h2>
          {isLoading && uploadedItems.length === 0 ? (
            <p className="text-gray-500 text-center">Loading items...</p>
          ) : uploadedItems.length === 0 ? (
            <p className="text-gray-500 text-center">No items uploaded yet.</p>
          ) : (
            <ul className="space-y-3">
              {uploadedItems.map((item) => (
                <li key={item._id} className="p-4 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-between">
                  <div className="flex-grow break-all pr-4">
                    <span className="font-semibold text-gray-700">{item.name}</span> - {' '}
                    {item.type === 'text' ? (
                      <span className="text-gray-800">
                        <span className="font-semibold text-blue-600">[Text]</span> {item.content}
                      </span>
                    ) : (
                      <span className="text-gray-800">
                        <span className="font-semibold text-teal-600">[File]</span> {item.fileName}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{new Date(item.uploadedAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemPage;

