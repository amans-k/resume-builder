import { Briefcase, Plus, Sparkles, Trash2, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import toast from 'react-hot-toast'

const ExperienceForm = ({ data, onChange }) => {
    const { token } = useSelector(state => state.auth)
    const [isGenerating, setIsGenerating] = useState(null) // Track which experience is being enhanced

    // Get API base URL from environment or fallback
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

    const addExperience = () => {
        const newExperience = {
            company: "",
            position: "",
            start_date: "",
            end_date: "",
            description: "",
            is_current: false
        };
        onChange([...data, newExperience])
    }

    const removeExperience = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated)
    }

    const updateExperience = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated)
    }

    // ✅ AI Enhance for Job Description
    const enhanceJobDescription = async (index, currentDescription, position = "") => {
        console.log("🟡 AI Enhance Job Description clicked for index:", index)

        const contentToEnhance = currentDescription && currentDescription.trim() !== '' 
            ? currentDescription 
            : `Job description for ${position || "this position"}`

        try {
            setIsGenerating(index)
            console.log("🟡 Making API call to enhance job description...")

            const response = await axios.post(
                `${API_BASE_URL}/api/ai/enhance-job-desc`,
                { userContent: contentToEnhance },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            console.log("✅ Job Description enhanced:", response.data)

            if (response.data.success && response.data.enhancedContent) {
                updateExperience(index, "description", response.data.enhancedContent)
                toast.success("Job description enhanced successfully!")
            } else {
                toast.error("Invalid response from AI service")
            }
        } catch (error) {
            console.error("❌ Job Description Enhancement Error:", error)

            if (!error.response) {
                toast.error("⚠️ Backend server not running on port 3000!")
            } else if (error.response.status === 401) {
                toast.error("Please login again")
            } else if (error.response.status === 500) {
                toast.error("AI service temporarily unavailable")
            } else {
                toast.error(error.response?.data?.message || "AI enhancement failed")
            }
        } finally {
            setIsGenerating(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        Professional Experience
                    </h3>
                    <p className="text-sm text-gray-500">Add your job experience</p>
                </div>
                <button 
                    onClick={addExperience} 
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                    <Plus className="size-4" />
                    Add Experience
                </button>
            </div>

            {data.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No work experience added yet.</p>
                    <p className="text-sm">Click "Add Experience" to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.map((experience, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-white">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-800">Experience {index + 1}</h4>
                                <button 
                                    onClick={() => removeExperience(index)} 
                                    className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                <input 
                                    value={experience.company || ""} 
                                    onChange={(e) => updateExperience(index, "company", e.target.value)} 
                                    type="text" 
                                    placeholder="Company Name" 
                                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                                <input 
                                    value={experience.position || ""} 
                                    onChange={(e) => updateExperience(index, "position", e.target.value)} 
                                    type="text" 
                                    placeholder="Job Title" 
                                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />

                                <input 
                                    value={experience.start_date || ""} 
                                    onChange={(e) => updateExperience(index, "start_date", e.target.value)} 
                                    type="month" 
                                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />

                                <input 
                                    value={experience.end_date || ""} 
                                    onChange={(e) => updateExperience(index, "end_date", e.target.value)} 
                                    type="month" 
                                    disabled={experience.is_current}
                                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>

                            <label className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={experience.is_current || false} 
                                    onChange={(e) => updateExperience(index, "is_current", e.target.checked)} 
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                />
                                <span className="text-sm text-gray-700">Currently working here</span>
                            </label>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Job Description</label>
                                    <button 
                                        onClick={() => enhanceJobDescription(index, experience.description, experience.position)}
                                        disabled={isGenerating === index}
                                        className="flex items-center gap-1 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-purple-200"
                                    >
                                        {isGenerating === index ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <Sparkles className="w-3 h-3" />
                                        )}
                                        {isGenerating === index ? "Enhancing..." : "AI Enhance"}
                                    </button>
                                </div>
                                <textarea 
                                    value={experience.description || ""} 
                                    onChange={(e) => updateExperience(index, "description", e.target.value)} 
                                    rows={4} 
                                    className="w-full text-sm px-3 py-2 rounded-lg resize-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                                    placeholder="Example: Developed web applications using React.js and Node.js. Collaborated with teams to deliver features and managed MongoDB databases..."
                                />
                                <p className="text-xs text-gray-500">
                                    Tip: Describe your responsibilities, achievements, and technologies used.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}  
        </div>
    )
}

export default ExperienceForm
