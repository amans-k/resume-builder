import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  PlusIcon,
  UploadCloudIcon,
  FilePenLine,
  TrashIcon,
  PencilIcon,
  XIcon,
} from "lucide-react";
import { dummyResumeData } from "../assets/assets";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [editResumeId, setEditResumeId] = useState(null);

  useEffect(() => {
    // Load from localStorage if available, otherwise use dummy data
    const savedResumes = localStorage.getItem("userResumes");
    if (savedResumes) {
      setAllResumes(JSON.parse(savedResumes));
    } else {
      setAllResumes(dummyResumeData);
      localStorage.setItem("userResumes", JSON.stringify(dummyResumeData));
    }
  }, []);

  // Save to localStorage whenever resumes change
  useEffect(() => {
    if (allResumes.length > 0) {
      localStorage.setItem("userResumes", JSON.stringify(allResumes));
    }
  }, [allResumes]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleCreateResume = (e) => {
    e.preventDefault();
    if (!resumeTitle.trim()) return alert("Please enter a resume title");

    const newResume = {
      id: Date.now().toString(),
      title: resumeTitle,
      updatedAt: new Date().toISOString(),
      type: "created"
    };

    const updatedResumes = [...allResumes, newResume];
    setAllResumes(updatedResumes);
    setResumeTitle("");
    setShowCreateResume(false);
    navigate(`/app/builder/${newResume.id}`);
  };

  const handleUploadResume = (e) => {
    e.preventDefault();
    if (!resumeTitle.trim()) return alert("Please enter a resume title");
    if (!uploadFile) return alert("Please select a file to upload");

    const newResume = {
      id: Date.now().toString(),
      title: resumeTitle,
      updatedAt: new Date().toISOString(),
      fileName: uploadFile.name,
      fileSize: (uploadFile.size / 1024 / 1024).toFixed(2) + " MB",
      type: "uploaded",
      uploadedAt: new Date().toLocaleDateString()
    };

    const updatedResumes = [...allResumes, newResume];
    setAllResumes(updatedResumes);
    setUploadFile(null);
    setResumeTitle("");
    setShowUploadResume(false);
    
    // In a real app, you would upload the file here
    console.log("File to upload:", uploadFile);
    
    // Navigate to builder or show success message
    navigate(`/app/builder/${newResume.id}`);
  };

  const handleUpdateTitle = (e) => {
    e.preventDefault();
    if (!resumeTitle.trim()) return alert("Please enter a new title");

    const updatedResumes = allResumes.map((resume) =>
      resume.id === editResumeId
        ? { ...resume, title: resumeTitle, updatedAt: new Date().toISOString() }
        : resume
    );
    
    setAllResumes(updatedResumes);
    setEditResumeId(null);
    setResumeTitle("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      const updatedResumes = allResumes.filter((r) => r.id !== id);
      setAllResumes(updatedResumes);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [".pdf", ".doc", ".docx", ".txt"];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        alert("Please upload a valid file type (PDF, DOC, DOCX, TXT)");
        e.target.value = "";
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        e.target.value = "";
        return;
      }

      setUploadFile(file);
      
      // Auto-fill title from filename if empty
      if (!resumeTitle.trim()) {
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setResumeTitle(fileNameWithoutExt);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
        Welcome, {user.name}
      </p>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShowCreateResume(true)}
          className="w-full bg-white sm:max-w-48 h-52 flex flex-col items-center justify-center rounded-lg gap-3
            text-slate-600 border border-dashed border-slate-300 hover:border-indigo-500 hover:shadow-lg transition-all
            duration-300 cursor-pointer group"
        >
          <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all">
            <PlusIcon
              className="text-indigo-600"
              size={32}
            />
          </div>
          <p className="text-sm font-medium group-hover:text-indigo-600 transition-all duration-300">
            Create Resume
          </p>
          <p className="text-xs text-slate-500">Start from scratch</p>
        </button>

        <button
          onClick={() => setShowUploadResume(true)}
          className="w-full bg-white sm:max-w-48 h-52 flex flex-col items-center justify-center rounded-lg gap-3
            text-slate-600 border border-dashed border-slate-300 hover:border-green-600 hover:shadow-lg transition-all
            duration-300 cursor-pointer group"
        >
          <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full group-hover:from-green-200 group-hover:to-green-300 transition-all">
            <UploadCloudIcon
              className="text-green-600"
              size={32}
            />
          </div>
          <p className="text-sm font-medium group-hover:text-green-600 transition-all duration-300">
            Upload Existing
          </p>
          <p className="text-xs text-slate-500">PDF, DOC, DOCX</p>
        </button>
      </div>

      {allResumes.length > 0 && (
        <>
          <hr className="border-slate-300 my-6" />
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">
              My Resumes ({allResumes.length})
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {allResumes.map((resume, index) => {
                const color = colors[index % colors.length];
                return (
                  <div
                    key={resume.id}
                    className="relative w-full h-52 flex flex-col items-center justify-center rounded-lg gap-3
                      border group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white"
                    style={{
                      borderColor: hexToRgba(color, 0.3),
                    }}
                    onClick={() => navigate(`/app/builder/${resume.id}`)}
                  >
                    <div 
                      className="p-3 rounded-full"
                      style={{
                        backgroundColor: hexToRgba(color, 0.1),
                      }}
                    >
                      <FilePenLine
                        className="size-6 group-hover:scale-105 transition-all"
                        style={{ color }}
                      />
                    </div>
                    
                    <div className="text-center px-3">
                      <p
                        className="text-sm font-medium group-hover:scale-105 transition-all line-clamp-2"
                        style={{ color }}
                      >
                        {resume.title}
                      </p>
                      {resume.fileName && (
                        <p className="text-xs text-slate-500 mt-1">
                          {resume.fileName}
                        </p>
                      )}
                    </div>
                    
                    <p className="absolute bottom-2 text-[11px] text-slate-500">
                      Updated {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 bg-white/80 rounded p-1"
                    >
                      <button
                        onClick={() => {
                          setEditResumeId(resume.id);
                          setResumeTitle(resume.title);
                        }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600"
                        title="Edit title"
                      >
                        <PencilIcon size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(resume.id)}
                        className="p-1 hover:bg-red-50 rounded text-red-600"
                        title="Delete resume"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Create Resume Modal */}
      {showCreateResume && (
        <CreateResumeModal
          resumeTitle={resumeTitle}
          setResumeTitle={setResumeTitle}
          onSubmit={handleCreateResume}
          onClose={() => {
            setShowCreateResume(false);
            setResumeTitle("");
          }}
        />
      )}

      {/* Upload Resume Modal */}
      {showUploadResume && (
        <UploadResumeModal
          resumeTitle={resumeTitle}
          setResumeTitle={setResumeTitle}
          uploadFile={uploadFile}
          onFileChange={handleFileChange}
          onSubmit={handleUploadResume}
          onClose={() => {
            setShowUploadResume(false);
            setResumeTitle("");
            setUploadFile(null);
          }}
        />
      )}

      {/* Edit Title Modal */}
      {editResumeId && (
        <EditResumeModal
          resumeTitle={resumeTitle}
          setResumeTitle={setResumeTitle}
          onSubmit={handleUpdateTitle}
          onClose={() => {
            setEditResumeId(null);
            setResumeTitle("");
          }}
        />
      )}
    </div>
  );
};

// Create Resume Modal Component
const CreateResumeModal = ({ resumeTitle, setResumeTitle, onSubmit, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50"
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white border shadow-xl rounded-lg w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Create a Resume</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XIcon size={24} />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Resume Title
          </label>
          <input
            type="text"
            placeholder="Enter resume title"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            required
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-200 transition-colors"
          >
            Create Resume
          </button>
        </div>
      </form>
    </div>
  );
};

// Upload Resume Modal Component (Matches your design)
const UploadResumeModal = ({ resumeTitle, setResumeTitle, uploadFile, onFileChange, onSubmit, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50"
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white border shadow-xl rounded-lg w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Upload Resume</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XIcon size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Enter resume title
            </label>
            <input
              type="text"
              placeholder="Enter resume title"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select resume file
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
              <UploadCloudIcon className="mx-auto text-slate-400 mb-2" size={32} />
              <p className="text-sm text-slate-600 mb-2">
                Drag & drop your file here or click to browse
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Supported formats: PDF, DOC, DOCX, TXT (Max 5MB)
              </p>
              <input
                type="file"
                onChange={onFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                id="resume-upload"
                required
              />
              <label
                htmlFor="resume-upload"
                className="inline-block px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
              >
                Browse Files
              </label>
            </div>
            {uploadFile && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  ✓ File selected: {uploadFile.name}
                </p>
                <p className="text-xs text-green-600">
                  Size: {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 bg-green-700 text-white rounded-lg hover:bg-green-800 focus:ring-2 focus:ring-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!uploadFile}
          >
            Upload Resume
          </button>
        </div>
      </form>
    </div>
  );
};

// Edit Resume Modal Component
const EditResumeModal = ({ resumeTitle, setResumeTitle, onSubmit, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50"
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white border shadow-xl rounded-lg w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Edit Resume Title</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XIcon size={24} />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            New Resume Title
          </label>
          <input
            type="text"
            placeholder="Enter new resume title"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            required
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 transition-colors"
          >
            Update Title
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;