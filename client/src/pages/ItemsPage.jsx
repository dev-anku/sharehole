import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const Message = ({ message }) => {
  return (
    <div>
      {message && (
        <div className={`p-3 mb-4 rounded-md text-center ${message.includes('successfully') ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items/file`, {
        method: 'POST',
        credentials: "include",
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
      setMessage('Failed to upload file.');
    } finally {
      setLoading(false);
    }
  }

  return (<div className="mb-8 p-6 border border-gray-700 rounded-lg shadow-sm bg-gray-900">
    <h2 className="text-2xl font-semibold text-gray-100 mb-4">Upload File</h2>
    <input
      type="text"
      className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200 ease-in-out mb-4"
      placeholder="Enter a name for your file"
      value={fileName}
      onChange={(e) => setFileName(e.target.value)}
    />
    <input
      id="file-input"
      type="file"
      onChange={(e) => setSelectedFile(e.target.files[0])}
      className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900 file:text-blue-300 hover:file:bg-blue-800 cursor-pointer"
    />
    {selectedFile && (
      <p className="text-sm text-gray-400 mt-2">Selected file: <span className="font-medium text-gray-200">{selectedFile.name}</span></p>
    )}
    <button
      onClick={handleFileUpload}
      className="mt-4 w-full bg-gradient-to-r from-teal-700 to-green-800 text-white py-3 px-6 rounded-md shadow-lg hover:from-teal-600 hover:to-green-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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
      setMessage('Failed to upload text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 p-6 border border-gray-700 rounded-lg shadow-sm bg-gray-900">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Upload Text</h2>
      <input
        type="text"
        className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out mb-4"
        placeholder="Enter a name for your text"
        value={textName}
        onChange={(e) => setTextName(e.target.value)}
      />
      <textarea
        className="w-full p-3 border border-gray-700 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 ease-in-out resize-y min-h-[100px]"
        placeholder="Enter your text here..."
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
      ></textarea>
      <button
        onClick={handleTextUpload}
        className="mt-4 w-full bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-3 px-6 rounded-md shadow-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? 'Uploading...' : 'Upload Text'}
      </button>
    </div>
  );
}

const UploadedItemsList = ({ uploadedItems, setMessage, isLoading, setLoading, fetchUploadedItems }) => {
  const [deletingId, setDeletingId] = useState(null);

  async function handleItemDelete(itemId) {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items/delete/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown server error." }));
        throw new Error(`HTTP error! status: ${response.status}. ${errorData.message || ''}`);
      }

      const result = await response.json();
      setMessage(result.message || "Item Deleted Successfully!");
    } catch (error) {
      console.error("Error deleting the item: ", error);
    } finally {
      setLoading(false);
      fetchUploadedItems();
    }
  }

  return (
    <div className="p-6 border border-gray-700 rounded-lg shadow-sm bg-gray-900">
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Your Uploaded Items</h2>
      {isLoading && uploadedItems.length === 0 ? (
        <p className="text-gray-400 text-center">Loading items...</p>
      ) : uploadedItems.length === 0 ? (
        <p className="text-gray-400 text-center">No items uploaded yet.</p>
      ) : (
        <ul className="space-y-3">
          {uploadedItems.map((item) => (
            <li key={item._id} className="p-4 bg-gray-800 rounded-md border border-gray-700 flex items-center justify-between">
              <div className="flex flex-col gap-2 w-full pr-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-xl text-gray-100">{item.name}</span>
                  <div className="flex">
                    {item.type === 'file' && (
                      <a
                        href={item.filePath.replace('/upload/', '/upload/fl_attachment/')}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 px-3 py-1 bg-blue-700 text-white text-sm rounded-md hover:bg-blue-600 transition duration-200 flex items-center"
                      >Download</a>
                    )}
                    {deletingId !== item._id ? (
                      <button
                        className="ml-3 px-3 py-1 bg-red-700 text-white text-sm rounded-md hover:bg-red-600 transition duration-200 flex items-center"
                        onClick={() => setDeletingId(item._id)}
                      >
                        Delete
                      </button>
                    ) : (
                      <>
                        <button
                          className="ml-3 px-3 py-1 bg-green-700 text-white text-sm rounded-md hover:bg-green-600 transition duration-200 flex items-center"
                          onClick={() => handleItemDelete(item._id)}
                        >
                          Yes
                        </button>
                        <button
                          className="ml-3 px-3 py-1 bg-red-700 text-white text-sm rounded-md hover:bg-red-600 transition duration-200 flex items-center"
                          onClick={() => setDeletingId(null)}
                        >
                          No
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {item.type === 'text' ? (
                  <div className="mt-1">
                    <div className="relative mt-1">
                      <button
                        className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500"
                        onClick={() => navigator.clipboard.writeText(item.content)}
                      >
                        Copy
                      </button>
                      <pre className="p-2 bg-gray-700 text-gray-100 rounded overflow-auto text-sm whitespace-pre-wrap">
                        <code>{item.content}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-300 flex items-center">
                    {item.fileName}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )
      }
    </div>
  );
}

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [uploadedItems, setUploadedItems] = useState([]);
  const [message, setMessage] = useState("");

  async function handleLogout() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        navigate("/login");
      } else {
        setMessage("Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setMessage("An error occurred during logout.");
    }
  }

  async function fetchUploadedItems() {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
        method: "GET",
        credentials: "include",
      });
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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-sans">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-red-700 to-pink-700 text-white text-sm font-semibold rounded-md shadow-lg hover:from-red-600 hover:to-pink-600 transition duration-300 z-50"
      >
        Logout
      </button>
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-4xl">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            ShareHole
          </span>
        </h1>
        <Message message={message} />
        <TextUpload setMessage={setMessage} isLoading={isLoading} setLoading={setLoading} fetchUploadedItems={fetchUploadedItems} />
        <FileUpload setMessage={setMessage} isLoading={isLoading} setLoading={setLoading} fetchUploadedItems={fetchUploadedItems} />
        <UploadedItemsList uploadedItems={uploadedItems} setMessage={setMessage} isLoading={isLoading} setLoading={setLoading} fetchUploadedItems={fetchUploadedItems} />
      </div>
    </div>
  )
}

export default HomePage

