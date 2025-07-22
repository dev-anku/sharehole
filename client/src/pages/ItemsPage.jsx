import React, { useState, useEffect } from "react";

const Message = ({ message }) => {
  return (
    <div>
      {message && (
        <div className={`p-3 mb-4 rounded-md text-center ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
    </div>
  )
}

const FileUpload = ({ setMessage, isLoading, setLoading, fetchUploadedItems }) => {
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  async function handleFileUpload() {
    if (!selectedFile || !fileName.trim()) {
      setMessage("Name and file are required for uploading.");
      return;
    }
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('name', fileName);
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/api/items/file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
        throw new Error(`HTTP error! status: ${response.status}. ${errorData.message || ''}`);
      }

      const result = await response.json();
      setMessage(result.message || "File uploaded successfully.");
      setSelectedFile(null);
      setFileName('');
      document.getElementById('file-input').value = '';
      fetchUploadedItems();
    } catch (error) {
      console.error("Error uploading file: ", error);
      setMessage('Failed to upload file. Please ensure the backend server is running and accessible at http://localhost:5000.');
    } finally {
      setLoading(false);
    }
  }

  return (<div className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm">
    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upload File</h2>
    <input
      type="text"
      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200 ease-in-out mb-4"
      placeholder="Enter a name for your file"
      value={fileName}
      onChange={(e) => setFileName(e.target.value)}
    />
    <input
      id="file-input"
      type="file"
      onChange={(e) => setSelectedFile(e.target.files[0])}
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
  );
}

const TextUpload = ({ setMessage, isLoading, setLoading, fetchUploadedItems }) => {
  const [textContent, setTextContent] = useState("");
  const [textName, setTextName] = useState("");

  async function handleTextUpload() {
    if (!textContent.trim() || !textName.trim()) {
      setMessage("Name and Text Content are required to upload.");
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch("http://localhost:5000/api/items/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: textName, content: textContent }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown server error." }));
        throw new Error(`HTTP error! status: ${response.status}. ${errorData.message || ""}`);
      }

      const result = await response.json();
      setMessage(result.message || "Text Uploaded Successfully!");
      setTextName("");
      setTextContent("");
      fetchUploadedItems();
    } catch (error) {
      console.error("Error Uploading Text: ", error);
      setMessage('Failed to upload text. Please ensure the backend server is running and accessible at http://localhost:5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upload Text</h2>
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out mb-4"
        placeholder="Enter a name for your text"
        value={textName}
        onChange={(e) => setTextName(e.target.value)}
      />
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out resize-y min-h-[100px]"
        placeholder="Enter your text here..."
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
      ></textarea>
      <button
        onClick={handleTextUpload}
        className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-md shadow-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? 'Uploading...' : 'Upload Text'}
      </button>
    </div>
  );
}

const UploadedItemsList = ({ uploadedItems, isLoading }) => {
  function handleItemDelete() {
    console.log("Item delete");
  }

  return (
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
                <span className="font-semibold text-gray-700">{item.name}</span><br />
                {item.type === 'text' ? (
                  <span className="text-gray-800">
                    <span className="font-semibold text-blue-600">[Text]</span> {item.content}
                  </span>
                ) : (
                  <span className="text-gray-800 flex justify-between items-center">
                    <span>
                      <span className="font-semibold text-teal-600">[File]</span> {item.fileName}
                    </span>
                    {/* Add download link for files */}
                  </span>
                )}
                {item.type === 'file' && (
                  <a
                    href={`http://localhost:5000/${item.filePath}`} // Construct the full URL to the file
                    download // The 'download' attribute prompts the browser to download the file
                  >
                    <button
                      download
                      className="ml-3 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition duration-200 flex items-center"
                    >
                      Download
                    </button>
                  </a>
                )}
                < button className="ml-3 px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-blue-600 transition duration-200 flex items-center" onClick={handleItemDelete}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )
      }
    </div >
  );
}

const HomePage = () => {
  const [isLoading, setLoading] = useState(false);
  const [uploadedItems, setUploadedItems] = useState([]);
  const [message, setMessage] = useState("");

  async function fetchUploadedItems() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/items");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknow server error." }));
        throw new Error(`HTTP error! status: ${response.status}. ${errorData.message || ''}`);
      }
      const data = await response.json();
      setUploadedItems(data);
    } catch (error) {
      console.error("Error fetching uploaded items:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUploadedItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-500">
            Content Uploader
          </span>
        </h1>
        <Message message={message} />
        <TextUpload setMessage={setMessage} isLoading={isLoading} setLoading={setLoading} fetchUploadedItems={fetchUploadedItems} />
        <FileUpload setMessage={setMessage} isLoading={isLoading} setLoading={setLoading} fetchUploadedItems={fetchUploadedItems} />
        <UploadedItemsList uploadedItems={uploadedItems} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default HomePage
