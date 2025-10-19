import { Sparkles, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import toast from 'react-hot-toast'

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {
    const { token } = useSelector(state => state.auth)
    const [isGenerating, setIsGenerating] = useState(false)

    const generateSummary = async () => {
        console.log("🟡 STEP 1: AI Enhance button clicked")
        console.log("🟡 Token exists:", !!token)
        console.log("🟡 Current data:", data)

        if (!data || data.trim() === '') {
            toast.error("Please enter some text first")
            return
        }

        try {
            setIsGenerating(true)
            
            console.log("🟡 STEP 2: Making API call to backend...")
            
            // ✅ FIXED: Use correct API base URL
            const API_BASE = import.meta.env.VITE_SERVER_URL || 'https://resume-builder-gilt-six-86.vercel.app';
            
            const response = await axios.post(
                `${API_BASE}/api/ai/enhance-pro-sum`, 
                { userContent: data }, 
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            )
            
            console.log("✅ STEP 3: Backend response received:", response.data)
            
            // ✅ Check if response has enhancedContent
            if (response.data.success && response.data.enhancedContent) {
                setResumeData(prev => ({
                    ...prev, 
                    professional_summary: response.data.enhancedContent
                }))
                toast.success("Summary enhanced successfully!")
            } else {
                console.error("❌ Invalid response format:", response.data)
                toast.error("Invalid response from AI service")
            }
            
        } catch (error) {
            console.error("❌ STEP 3: API Error occurred")
            console.error("❌ Error status:", error.response?.status)
            console.error("❌ Error data:", error.response?.data)
            console.error("❌ Error message:", error.message)
            
            // ✅ Better error messages
            if (error.response?.status === 400) {
                toast.error("Bad request: " + (error.response.data?.message || "Check your input"))
            } else if (error.response?.status === 401) {
                toast.error("Authentication failed - please login again")
            } else if (error.response?.status === 500) {
                toast.error("Server error: " + (error.response.data?.message || "AI service issue"))
            } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
                toast.error("Cannot connect to server - check if backend is running")
            } else {
                toast.error(error.response?.data?.message || "AI enhancement failed")
            }
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-800'>
                        Professional Summary
                    </h3>
                    <p className='text-sm text-gray-500'>
                        Add summary for your resume here
                    </p>
                </div>
                <button 
                    disabled={isGenerating} 
                    onClick={generateSummary} 
                    className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isGenerating ? (
                        <Loader2 className="size-4 animate-spin"/>
                    ) : (
                        <Sparkles className="size-4"/>
                    )}
                    {isGenerating ? "Enhancing..." : "AI Enhance"}
                </button>
            </div>

            <div className="mt-6">
                <textarea 
                    value={data || ""} 
                    onChange={(e) => onChange(e.target.value)} 
                    rows={7} 
                    className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none' 
                    placeholder='Example: Experienced web developer with 3+ years in React.js, Node.js, and MongoDB. Seeking frontend developer role...' 
                />
                <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center mt-2'>
                    Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.
                </p>
            </div>
        </div>
    )
}

export default ProfessionalSummaryForm