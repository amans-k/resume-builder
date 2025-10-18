import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    // ✅ ADDED: Custom resumeId field to handle both ObjectId and string IDs
    resumeId: { 
        type: String, 
        required: true,
        unique: true
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    title: { 
        type: String, 
        default: 'Untitled Resume' 
    },
    public: { 
        type: Boolean, 
        default: false 
    },
    template: { 
        type: String, 
        default: "classic" 
    },
    accent_color: { 
        type: String, 
        default: "#382F6A" 
    },
    professional_summary: { 
        type: String, 
        default: "" 
    },
    skills: [{ 
        type: String 
    }],
    personal_info: {
        image: { 
            type: String, 
            default: "" 
        },
        full_name: { 
            type: String, 
            default: "" 
        },
        profession: { 
            type: String, 
            default: "" 
        },
        email: { 
            type: String, 
            default: "" 
        },
        phone: { 
            type: String, 
            default: "" 
        },
        location: { 
            type: String, 
            default: "" 
        },
        linkedin: { 
            type: String, 
            default: "" 
        },
        website: { 
            type: String, 
            default: "" 
        },
    },
    experience: [
        {
            company: { type: String },
            position: { type: String },
            start_date: { type: String },
            end_date: { type: String },
            description: { type: String },
            is_current: { type: Boolean },
        }
    ],
    project: [
        {
            name: { type: String },
            type: { type: String },
            description: { type: String },
        }
    ],
    education: [
        {
            institution: { type: String },
            degree: { type: String },
            field: { type: String },
            graduation_date: { type: String },
            gpa: { type: String },
        }
    ],
}, { 
    timestamps: true, 
    minimize: false 
});

// ✅ ADDED: Create index for faster queries
ResumeSchema.index({ resumeId: 1 });
ResumeSchema.index({ userId: 1 });

const Resume = mongoose.model('Resume', ResumeSchema);
export default Resume;