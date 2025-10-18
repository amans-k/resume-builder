import React, { useState } from 'react'
import { Palette, Check } from 'lucide-react'

const ColorPicker = ({ selectedColor, onChange }) => {
    const colors = [
        { name: "Blue", value: "#3B82F6" },
        { name: "Indigo", value: "#6366F1" },
        { name: "Purple", value: "#8B5CF6" },
        { name: "Green", value: "#10B981" },
        { name: "Red", value: "#EF4444" },
        { name: "Orange", value: "#F97316" },
        { name: "Teal", value: "#14B8A6" },
        { name: "Pink", value: "#EC4899" },
        { name: "Gray", value: "#6B7280" },
        { name: "Black", value: "#1F2937" },
        { name: "Yellow", value: "#EAB308" },
        { name: "Cyan", value: "#06B6D4" },
        { name: "Lime", value: "#84CC16" },
        { name: "Amber", value: "#F59E0B" },
        { name: "Rose", value: "#F43F5E" }
    ]
    
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className='relative'>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className='flex items-center gap-1 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg'
            >
                <Palette size={16} /> 
                <span className="max-sm:hidden">Accent</span>
            </button>

            {isOpen && (
                <div className='grid grid-cols-5 w-72 gap-2 absolute top-full left-0 right-0 p-3 mt-2 z-10 bg-white rounded-md border border-gray-200 shadow-sm'>
                    {colors.map((color) => (
                        <div 
                            key={color.value} 
                            className='relative cursor-pointer group flex flex-col' 
                            onClick={() => {
                                onChange(color.value)
                                setIsOpen(false)
                            }}
                        >
                            <div 
                                className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors" 
                                style={{ backgroundColor: color.value }}
                            >
                                {selectedColor === color.value && (
                                    <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
                                        <Check className="size-4 text-white"/>
                                    </div>
                                )}
                            </div>
                            <p className='text-xs text-center mt-1 text-gray-600'>{color.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ColorPicker