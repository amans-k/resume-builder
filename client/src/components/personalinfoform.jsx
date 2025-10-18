import { BriefcaseBusiness, Globe, MapPin, Phone, User, Linkedin } from 'lucide-react'
import React from 'react'

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground, accentColor }) => {
  
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  // ✅ FIXED: Simple image handler - only store URL string, not File object
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Create temporary URL for preview
      const imageUrl = URL.createObjectURL(file)
      // Store only the URL string in data
      handleChange('image', imageUrl)
    }
  }

  const removeImage = () => {
    handleChange('image', '')
  }

  const fields = [
    { key: 'full_name', label: 'Full Name', Icon: User, type: 'text', required: true },
    { key: 'email', label: 'Email', Icon: Globe, type: 'email', required: true },
    { key: 'phone', label: 'Phone Number', Icon: Phone, type: 'tel' },
    { key: 'location', label: 'Location', Icon: MapPin, type: 'text' },
    { key: 'profession', label: 'Profession', Icon: BriefcaseBusiness, type: 'text' },
    { key: 'linkedin', label: 'Linkedin profile', Icon: Linkedin, type: 'url' },
    { key: 'website', label: 'Personal Website', Icon: Globe, type: 'url' },
  ]

  return (
    <div>
      <h3 className='text-lg font-semibold text-gray-900'>Personal Information</h3>
      <p className='text-sm text-gray-600'>Get Started With the personal information</p>

      <div className='flex items-center gap-4 mt-4'>
        <div className="relative">
          {data.image ? (
            <div className="relative">
              <img
                src={data.image}
                alt='user-image'
                className='w-20 h-20 rounded-full object-cover border-2'
                style={{ borderColor: accentColor }}
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ) : (
            <label className='cursor-pointer'>
              <div 
                className='w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed hover:opacity-80'
                style={{ borderColor: accentColor }}
              >
                <User className='size-8' style={{ color: accentColor }} />
              </div>
              <input
                type="file"
                accept='image/jpeg, image/png'
                className='hidden'
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          {data.image && (
            <div className='flex items-center gap-2 text-sm'>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type="checkbox"
                  className='sr-only peer'
                  onChange={() => setRemoveBackground(prev => !prev)}
                  checked={removeBackground}
                />
                <div className='w-9 h-5 bg-gray-300 rounded-full peer-checked:bg-green-600 transition-colors duration-200'></div>
                <span className='dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
              </label>
              <span className="text-gray-700">Remove Background</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {fields.map((field) => {
          const Icon = field.Icon
          return (
            <div key={field.key} className='space-y-2'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                <Icon className='size-4' />
                {field.label}
                {field.required && <span className='text-red-500'>*</span>}
              </label>

              <input
                type={field.type}
                required={field.required}
                value={data[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm'
                placeholder={`Enter your ${field.label.toLowerCase()}`}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PersonalInfoForm