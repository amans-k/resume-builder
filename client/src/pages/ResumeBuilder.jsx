import React, { useEffect, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon,
GraduationCap, Share2Icon, Sparkles, User, CheckCircleIcon } from 'lucide-react'
import PersonalInfoForm from '../components/personalinfoform'
import ProfessionalSummaryForm from '../components/professinoalsummaryform'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectsForm from '../components/ProjectsForm'
import SkillsForm from '../components/SkillsForm'
import Resumepreview from '../components/Resumepreview'
import Templateselector from '../components/Templateselector'
import ColorPicker from '../components/colorpicker'
import { useSelector } from 'react-redux'

// Fixed: Using Vite environment variables
// ✅ FIXED: Use correct environment variable
const API_BASE = import.meta.env.VITE_SERVER_URL || 'https://resume-builder-3-xfol.onrender.com/api';
const ResumeBuilder = () => {
  const { resumeId } = useParams()
  const { token } = useSelector(state => state.auth)

  // Fixed: Consistent state structure - using 'projects' instead of 'project'
  const [resumeData, setResumeData] = useState({
    title: 'Untitled Resume',
    public: false,
    template: "classic",
    accent_color: "#382F6A",
    professional_summary: "",
    skills: [],
    personal_info: {
      image: "",
      full_name: "",
      profession: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
    },
    experience: [],
    projects: [], // Fixed: changed from 'project' to 'projects'
    education: [],
  })

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState({ show: false, message: '', type: '' })

  const sections = [
    { id: "personal", name: "Personal Info", Icon: User },
    { id: "summary", name: "Summary", Icon: FileText },
    { id: "experience", name: "Experience", Icon: Briefcase },
    { id: "education", name: "Education", Icon: GraduationCap },
    { id: "projects", name: "Projects", Icon: FolderIcon },
    { id: "skills", name: "Skills", Icon: Sparkles },
  ]

  // ✅ FIXED: API function with proper token handling
  const apiRequest = useCallback(async (endpoint, options = {}) => {
    // Check if token exists for protected routes
    if (!token && !endpoint.includes('/public')) {
      throw new Error('Unauthorized: No authentication token found');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options
    }

    try {
      console.log(`🔄 API Call: ${API_BASE}${endpoint}`);
      
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      
      // Handle unauthorized response
      if (response.status === 401) {
        throw new Error('Unauthorized: Please login again');
      }

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JJSON response: ${text}`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      console.log('✅ API Success:', data);
      return data;
    } catch (error) {
      console.error('❌ API Error:', error.message);
      
      // More specific error messages
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please check if backend is running.');
      }
      
      if (error.message.includes('Not Found')) {
        throw new Error(`API endpoint not found: ${endpoint}`);
      }
      
      throw error;
    }
  }, [token])

  // ✅ FIXED: Load resume from backend
  const loadResumeFromAPI = useCallback(async () => {
    try {
      console.log(`📡 Loading resume ${resumeId} from API...`);
      
      const data = await apiRequest(`/resumes/get/${resumeId}`);
      
      if (!data || !data.resume) {
        throw new Error('No resume data received from server');
      }
      
      console.log('✅ Loaded from API:', data.resume);
      return data.resume;
    } catch (error) {
      console.error('❌ Failed to load from API:', error.message);
      
      // Check if it's a 404 error (resume not found)
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log('📝 Resume not found, will create new one');
        return null;
      }
      
      return null;
    }
  }, [resumeId, apiRequest])

  // ✅ FIXED: Save resume to backend
  const saveResumeToAPI = useCallback(async (data) => {
    try {
      console.log('💾 Saving resume to API...');
      
      const backendData = {
        resumeId: resumeId,
        resumeData: data,
        removeBackground: removeBackground
      };

      console.log('📤 Sending data:', backendData);

      const response = await apiRequest('/resumes/update', {
        method: 'POST',
        body: JSON.stringify(backendData)
      });

      console.log('✅ Saved to API:', response);
      
      if (!response || !response.resume) {
        throw new Error('No response data received from server');
      }
      
      return response.resume;
    } catch (error) {
      console.error('❌ Failed to save to API:', error.message);
      
      // More specific error handling
      if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Cannot connect to server. Please check your internet connection and ensure backend is running.');
      }
      
      throw error;
    }
  }, [resumeId, removeBackground, apiRequest])

  // Transform data for frontend (project -> projects)
  const transformToFrontendFormat = useCallback((backendData) => {
    if (!backendData) return null

    return {
      id: backendData._id || backendData.id,
      title: backendData.title || 'Untitled Resume',
      public: backendData.public || false,
      template: backendData.template || "classic",
      accent_color: backendData.accent_color || "#382F6A",
      professional_summary: backendData.professional_summary || "",
      skills: backendData.skills || [],
      personal_info: backendData.personal_info || {
        image: "",
        full_name: "",
        profession: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        website: "",
      },
      experience: backendData.experience || [],
      projects: backendData.project || backendData.projects || [], // Handle both formats
      education: backendData.education || [],
    }
  }, [])

  // Transform data for backend (projects -> project)
  const transformToBackendFormat = useCallback((frontendData) => {
    return {
      title: frontendData.title || 'Untitled Resume',
      public: frontendData.public || false,
      template: frontendData.template || "classic",
      accent_color: frontendData.accent_color || "#382F6A",
      professional_summary: frontendData.professional_summary || "",
      skills: frontendData.skills || [],
      personal_info: frontendData.personal_info || {
        image: "",
        full_name: "",
        profession: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        website: "",
      },
      experience: frontendData.experience || [],
      project: frontendData.projects || [], // Transform 'projects' to 'project'
      education: frontendData.education || [],
    }
  }, [])

  const changeResumeVisibility = async () => {
    const newVisibility = !resumeData.public;
    setResumeData(prev => ({...prev, public: newVisibility}))
    
    // Auto-save when changing visibility
    try {
      const backendData = transformToBackendFormat({...resumeData, public: newVisibility})
      await saveResumeToAPI(backendData)
    } catch (error) {
      console.error('Failed to update visibility:', error)
      // Revert on error
      setResumeData(prev => ({...prev, public: !newVisibility}))
    }
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/resume/' + resumeId;
    if (navigator.share) {
      navigator.share({
        url: resumeUrl,
        text: 'My Resume'
      });
    } else {
      alert("Your device doesn't support sharing")
    }
  }

  const downloadResume = () => {
    window.print();
  }

  // ✅ FIXED: Save changes function with better token validation
  const handleSaveChanges = async () => {
    if (!token) {
      setSaveStatus({ 
        show: true, 
        message: 'Unauthorized: Please login to save changes', 
        type: 'error' 
      })
      setTimeout(() => {
        setSaveStatus({ show: false, message: '', type: '' })
      }, 5000)
      return;
    }

    try {
      setSaveStatus({ show: true, message: 'Saving changes...', type: 'loading' })

      // Transform data to backend format
      const backendData = transformToBackendFormat(resumeData)
      console.log('📝 Transformed data for backend:', backendData);

      // Save to backend API
      const savedResume = await saveResumeToAPI(backendData)

      if (savedResume) {
        // Update local state with the response from backend
        const frontendData = transformToFrontendFormat(savedResume)
        setResumeData(frontendData)
        
        setSaveStatus({ 
          show: true, 
          message: 'Saved successfully!', 
          type: 'success' 
        })
      } else {
        throw new Error('Failed to save to database - no response received');
      }

      setTimeout(() => {
        setSaveStatus({ show: false, message: '', type: '' })
      }, 3000)

    } catch (error) {
      console.error('❌ Save error:', error)
      setSaveStatus({ 
        show: true, 
        message: `Failed to save: ${error.message}`,
        type: 'error' 
      })

      setTimeout(() => {
        setSaveStatus({ show: false, message: '', type: '' })
      }, 5000)
    }
  }

  // ✅ FIXED: useEffect with proper dependencies
  useEffect(() => {
    const loadExistingResume = async () => {
      setLoading(true)

      console.log('🔗 resumeId from URL:', resumeId)
      console.log('🔑 Token available:', !!token)

      if (!resumeId || resumeId === 'undefined') {
        console.error('❌ Invalid resumeId:', resumeId)
        setLoading(false)
        return
      }

      if (!token) {
        console.log('⚠️ No authentication token - using dummy data')
        // Use dummy data when no token
        const dummyResume = dummyResumeData.find(resume => resume.id === resumeId)
        if (dummyResume) {
          console.log('📄 Using dummy data (no auth)')
          setResumeData(dummyResume)
          document.title = dummyResume.title
        } else {
          console.log('🆕 Creating new resume structure (no auth)')
          setResumeData(prev => ({
            ...prev,
            id: resumeId,
            title: `Resume ${resumeId}`
          }))
        }
        setLoading(false)
        return
      }

      // Try to load from backend API (only if we have token)
      try {
        const apiResume = await loadResumeFromAPI()
        if (apiResume) {
          console.log('✅ Loaded from backend API')
          const frontendData = transformToFrontendFormat(apiResume)
          setResumeData(frontendData)
          document.title = frontendData.title || `Resume ${resumeId}`
          setLoading(false)
          return
        }
      } catch (error) {
        console.log('⚠️ Could not load from API, using fallback:', error.message)
      }

      // Fallback to dummy data
      const dummyResume = dummyResumeData.find(resume => resume.id === resumeId)
      if (dummyResume) {
        console.log('📄 Using dummy data as fallback')
        setResumeData(dummyResume)
        document.title = dummyResume.title
      } else {
        console.log('🆕 Creating new resume structure')
        setResumeData(prev => ({
          ...prev,
          id: resumeId,
          title: `Resume ${resumeId}`
        }))
      }

      setLoading(false)
    }

    loadExistingResume()
  }, [resumeId, token, loadResumeFromAPI, transformToFrontendFormat])

  const activeSection = sections[activeSectionIndex]

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading resume...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!resumeId || resumeId === 'undefined') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to="/app" className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all mb-6'>
          <ArrowLeftIcon className='w-4 h-4' /> Back to Dashboard
        </Link>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Resume</h2>
          <p className="text-gray-600 mb-6">The resume ID is missing or invalid.</p>
          <Link to="/app" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Success Message Popup */}
      {saveStatus.show && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          saveStatus.type === 'success' ? 'animate-bounce' : ''
        }`}>
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg border ${
            saveStatus.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : saveStatus.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {saveStatus.type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
            {saveStatus.type === 'loading' && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            )}
            {saveStatus.type === 'error' && (
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
            )}
            <span className="font-medium">{saveStatus.message}</span>
          </div>
        </div>
      )}

      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link to="/app" className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className='w-4 h-4' /> Back to Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>

          {/* Left Panel - Form */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1 relative
              ${removeBackground ? 'opacity-90' : '' }`}>

              {/* Progress bar */}
              <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />
              <hr className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-1000'
                style={{ width: `${(activeSectionIndex * 100) / (sections.length - 1)}%` }} />

              {/* Navigation */}
              <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                <div className='flex items-center gap-2'>
                  <Templateselector 
                    selectedtemplate={resumeData.template} 
                    onchange={(template) => setResumeData(prev => ({ ...prev, template }))}
                  />
                  <ColorPicker 
                    selectedColor={resumeData.accent_color} 
                    onChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color }))}
                  />
                </div>
                <div className='flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button 
                      onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))}
                      className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all'
                    >
                      <ChevronLeft className='size-4' /> Previous
                    </button>
                  )}
                  <button 
                    onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))}
                    className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all'
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next
                    <ChevronRight className='size-4' />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className='space-y-6'>
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm 
                    data={resumeData.personal_info} 
                    onChange={(data) => setResumeData(prev => ({
                      ...prev, 
                      personal_info: data 
                    }))}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                    accentColor={resumeData.accent_color}
                  />
                )}

                {activeSection.id === 'summary' && (
                  <ProfessionalSummaryForm 
                    data={resumeData.professional_summary} 
                    onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))}
                    setResumeData={setResumeData}
                  />
                )}

                {activeSection.id === 'experience' && (
                  <ExperienceForm 
                    data={resumeData.experience} 
                    onChange={(data) => setResumeData(prev => ({ ...prev, experience: data }))}
                  />
                )}

                {activeSection.id === 'education' && (
                  <EducationForm 
                    data={resumeData.education} 
                    onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))}
                  />
                )}

                {activeSection.id === 'projects' && (
                  <ProjectsForm 
                    data={resumeData.projects} 
                    onChange={(data) => setResumeData(prev => ({ ...prev, projects: data }))}
                  />
                )}

                {activeSection.id === 'skills' && (
                  <SkillsForm 
                    data={resumeData.skills} 
                    onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))}
                  />
                )}
              </div>

              <button
                onClick={handleSaveChanges}
                disabled={saveStatus.type === 'loading'}
                className={`flex items-center gap-2 bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-4 py-2 mt-6 text-sm ${
                  saveStatus.type === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                {saveStatus.type === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className='lg:col-span-7 max-lg:mt-6'>
            <div className='relative w-full'>
              <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                {resumeData.public && (
                  <button 
                    onClick={handleShare}
                    className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'
                  >
                    <Share2Icon className='size-4' /> Share
                  </button>
                )}
                <button 
                  onClick={changeResumeVisibility}
                  className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors'
                >
                  {resumeData.public ?
                    <EyeIcon className='size-4' /> :
                    <EyeOffIcon className='size-4' />}
                  {resumeData.public ? 'Public' : 'Private'}
                </button>
                <button 
                  onClick={downloadResume}
                  className='flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors'
                >
                  <DownloadIcon className='size-4' />
                  Download
                </button>
              </div>
            </div>
            <Resumepreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder