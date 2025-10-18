import Resume from "../models/Resume.js";

// ✅ FIXED: controller for creating a new resume with auto ID generation
// POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;
    
    // ✅ AUTO-GENERATE unique resumeId if not provided
    const resumeId = req.body.resumeId || Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    console.log('🆕 Creating resume with ID:', resumeId);

    // ✅ Check if resumeId already exists
    const existingResume = await Resume.findOne({ 
      $or: [
        { resumeId: resumeId },
        { _id: resumeId }
      ]
    });
    
    if (existingResume) {
      // Generate another unique ID if duplicate
      const newResumeId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      console.log('🔄 Duplicate found, generating new ID:', newResumeId);
      
      // create new resume with new ID
      const newResume = await Resume.create({ 
        userId, 
        title: title || `Resume ${newResumeId}`,
        resumeId: newResumeId,
        personal_info: {
          full_name: "",
          email: "",
          phone: "",
          location: "",
          profession: "",
          linkedin: "",
          website: "",
          image: ""
        },
        professional_summary: "",
        experience: [],
        education: [],
        projects: [],
        skills: [],
        template: "classic",
        accent_color: "#382F6A",
        public: false
      });
      
      return res.status(201).json({ 
        success: true,
        message: 'Resume created successfully',
        resume: newResume 
      });
    }

    // ✅ Create new resume with complete structure
    const newResume = await Resume.create({ 
      userId, 
      title: title || `Resume ${resumeId}`,
      resumeId: resumeId,
      personal_info: {
        full_name: "",
        email: "",
        phone: "",
        location: "",
        profession: "",
        linkedin: "",
        website: "",
        image: ""
      },
      professional_summary: "",
      experience: [],
      education: [],
      projects: [],
      skills: [],
      template: "classic",
      accent_color: "#382F6A",
      public: false
    });
    
    console.log('✅ Resume created successfully:', newResume._id);
    
    return res.status(201).json({ 
      success: true,
      message: 'Resume created successfully',
      resume: newResume 
    });
  } catch (error) {
    console.error('❌ Create resume error:', error);
    
    // ✅ Handle duplicate key error
    if (error.code === 11000) {
      const finalResumeId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      console.log('🔄 Duplicate key error, retrying with new ID:', finalResumeId);
      
      try {
        const newResume = await Resume.create({ 
          userId: req.userId, 
          title: req.body.title || `Resume ${finalResumeId}`,
          resumeId: finalResumeId,
          personal_info: {
            full_name: "",
            email: "",
            phone: "",
            location: "",
            profession: "",
            linkedin: "",
            website: "",
            image: ""
          }
        });
        
        return res.status(201).json({ 
          success: true,
          message: 'Resume created successfully',
          resume: newResume 
        });
      } catch (retryError) {
        return res.status(400).json({ 
          success: false,
          message: 'Failed to create resume after retry' 
        });
      }
    }
    
    return res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
}

// ✅ FIXED: Get all resumes for a user
// GET: /api/resumes/user-resumes
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
    
    console.log(`📄 Found ${resumes.length} resumes for user ${userId}`);
    
    return res.status(200).json({ 
      success: true,
      resumes 
    });
  } catch (error) {
    console.error('❌ Get user resumes error:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
}

// controller for deleting a resume
// DELETE: /api/resumes/delete/:resumeId
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    // Check if it's ObjectId or custom ID
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(resumeId);
    let query;
    
    if (isValidObjectId) {
      query = { userId, _id: resumeId };
    } else {
      query = { userId, resumeId: resumeId };
    }

    const result = await Resume.findOneAndDelete(query);

    if (!result) {
      return res.status(404).json({ 
        success: false,
        message: 'Resume not found' 
      });
    }

    console.log('🗑️ Resume deleted:', resumeId);
    
    return res.status(200).json({ 
      success: true,
      message: 'Resume deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Delete resume error:', error);
    return res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
}

// get user resume by id
// GET: /api/resumes/get/:resumeId
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    console.log('📥 Fetching resume:', resumeId, 'for user:', userId);

    // Check if it's ObjectId or custom ID
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(resumeId);
    let query;
    
    if (isValidObjectId) {
      query = { userId, _id: resumeId };
    } else {
      query = { userId, resumeId: resumeId };
    }

    const resume = await Resume.findOne(query);

    if (!resume) {
      console.log('❌ Resume not found:', resumeId);
      return res.status(404).json({ 
        success: false,
        message: "Resume not found" 
      });
    }

    console.log('✅ Resume found:', resume._id);
    
    return res.status(200).json({ 
      success: true,
      resume 
    });
  } catch (error) {
    console.error('❌ Get resume error:', error);
    return res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
}

// get resume by id public
// GET: /api/resumes/public/:resumeId
export const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    
    console.log('🌐 Fetching public resume:', resumeId);

    // Check if it's ObjectId or custom ID
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(resumeId);
    let query;
    
    if (isValidObjectId) {
      query = { public: true, _id: resumeId };
    } else {
      query = { public: true, resumeId: resumeId };
    }

    const resume = await Resume.findOne(query);

    if (!resume) {
      return res.status(404).json({ 
        success: false,
        message: "Resume not found" 
      });
    }

    return res.status(200).json({ 
      success: true,
      resume 
    });
  } catch (error) {
    console.error('❌ Get public resume error:', error);
    return res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
}

// ✅ FIXED: controller for updating a resume with duplicate error handling
// POST: /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    
    console.log('🔄 Update request received:', { userId, resumeId });
    
    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "resumeId is required"
      });
    }

    // ✅ FIXED: Check if resumeId is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(resumeId);
    
    let query;
    if (isValidObjectId) {
      query = { userId, _id: resumeId };
      console.log('✅ Using MongoDB ObjectId');
    } else {
      query = { userId, resumeId: resumeId };
      console.log('✅ Using custom resumeId');
    }

    // ✅ FIXED: Proper data handling
    let resumeDataCopy;
    
    if (typeof resumeData === 'string') {
      try {
        resumeDataCopy = JSON.parse(resumeData);
        console.log('✅ Parsed JSON string successfully');
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        try {
          resumeDataCopy = JSON.parse(JSON.parse(resumeData));
        } catch (e) {
          resumeDataCopy = resumeData;
        }
      }
    } else {
      resumeDataCopy = { ...resumeData };
      console.log('✅ Using direct object');
    }

    // ✅ FIXED: CRITICAL - Ensure personal_info.image is always a string
    if (resumeDataCopy.personal_info) {
      console.log('🖼️ Personal info image before fix:', resumeDataCopy.personal_info.image);
      
      if (Array.isArray(resumeDataCopy.personal_info.image)) {
        resumeDataCopy.personal_info.image = resumeDataCopy.personal_info.image[0] || '';
        console.log('🔄 Converted image array to string');
      }
      
      if (resumeDataCopy.personal_info.image && typeof resumeDataCopy.personal_info.image !== 'string') {
        console.log('🔄 Setting non-string image to empty string');
        resumeDataCopy.personal_info.image = '';
      }
      
      // Ensure all personal_info fields are strings
      const personalInfoFields = ['full_name', 'email', 'phone', 'location', 'profession', 'linkedin', 'website', 'image'];
      personalInfoFields.forEach(field => {
        if (resumeDataCopy.personal_info[field] && typeof resumeDataCopy.personal_info[field] !== 'string') {
          resumeDataCopy.personal_info[field] = String(resumeDataCopy.personal_info[field]);
        }
      });
    }

    // ✅ FIXED: Sync projects and project fields
    if (resumeDataCopy.projects && Array.isArray(resumeDataCopy.projects)) {
        resumeDataCopy.project = resumeDataCopy.projects;
        console.log('✅ Copied projects to project field');
    }

    if (resumeDataCopy.project && Array.isArray(resumeDataCopy.project) && !resumeDataCopy.projects) {
        resumeDataCopy.projects = resumeDataCopy.project;
        console.log('✅ Copied project to projects field');
    }

    // ✅ FIXED: Add resumeId for custom IDs to prevent duplicates
    if (!isValidObjectId) {
      resumeDataCopy.resumeId = resumeId;
    }

    console.log('📤 Final data prepared for save');

    // ✅ FIXED: Update or create resume with duplicate error handling
    try {
      const updatedResume = await Resume.findOneAndUpdate(
        query,
        resumeDataCopy,
        { 
          new: true, 
          runValidators: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      );

      console.log('✅ Resume updated successfully:', updatedResume._id);
      
      return res.status(200).json({ 
        success: true,
        message: 'Saved successfully', 
        resume: updatedResume 
      });
      
    } catch (dbError) {
      // ✅ Handle duplicate key error during update
      if (dbError.code === 11000) {
        console.log('🔄 Duplicate key during update, handling...');
        
        // Try to find existing resume
        const existingResume = await Resume.findOne(query);
        if (existingResume) {
          // Update existing resume
          const updatedResume = await Resume.findOneAndUpdate(
            query,
            resumeDataCopy,
            { new: true, runValidators: true }
          );
          
          return res.status(200).json({ 
            success: true,
            message: 'Saved successfully', 
            resume: updatedResume 
          });
        } else {
          // Create with new ID
          const newResumeId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
          resumeDataCopy.resumeId = newResumeId;
          
          const newResume = await Resume.create(resumeDataCopy);
          
          return res.status(200).json({ 
            success: true,
            message: 'Saved with new ID', 
            resume: newResume 
          });
        }
      }
      throw dbError;
    }
    
  } catch (error) {
    console.error('❌ Update resume error:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Internal server error' 
    });
  }
}