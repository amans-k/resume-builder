import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import ResumePreview from '../components/Resumepreview'
import Loader from '../components/Loader'

const Preview = () => {
const { resumeId } = useParams()
const [isLoading, setIsLoading] = useState(true)
const [resumeData, setResumeData] = useState(null)

const loadResume = useCallback(async () => {
setResumeData(dummyResumeData.find(resume => resume._id === resumeId) || null)
setIsLoading(false)
}, [resumeId])

useEffect(() => {
loadResume()
}, [loadResume])

return resumeData ? (
<div className='bg-slate-100'>
  <div className='max-w-3xl mx-auto py-10'>
    <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}
      classes='py-4 bg-white' />
  </div>
</div>
) : (
<div>
  {isLoading ?
  <Loader /> : (
  <div className='flex flex-col items-center justify-center h-screen'>
    <p className='text-center text-6xl text-slate-400 font-medium'>Resume not found</p>
    <a href="/"
      className='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors'>
      {/* Arrow icon removed due to import error */}
      <svg className="mr-2 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      go to home page
    </a>
  </div>
  )}
</div>
)
}

export default Preview
