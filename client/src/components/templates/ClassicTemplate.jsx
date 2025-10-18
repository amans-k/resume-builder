import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ClassicTemplate = ({ data, accentColor = "#3b82f6" }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        try {
            // Handle different date formats safely
            if (dateStr.includes("-")) {
                const [year, month] = dateStr.split("-");
                if (year && month) {
                    return new Date(year, month - 1).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short"
                    });
                }
            }
            // Return original string if format is unexpected
            return dateStr;
        } catch (error) {
            console.error("Date formatting error:", error);
            return dateStr; // Return original string if parsing fails
        }
    };

    // Safe data access with fallbacks - ✅ FIXED: Handle both project and projects
    const personalInfo = data?.personal_info || {};
    const professionalSummary = data?.professional_summary || "";
    const experience = data?.experience || [];
    const projects = data?.projects || data?.project || []; // ✅ FIXED: Handle both singular and plural
    const education = data?.education || [];
    const skills = data?.skills || [];

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 leading-relaxed">
            {/* Header */}
            <header className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: accentColor }}>
                <h1 className="text-3xl font-bold mb-2" style={{ color: accentColor }}>
                    {personalInfo.full_name || "Your Name"}
                </h1>

                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                    {personalInfo.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{personalInfo.location}</span>
                        </div>
                    )}
                    {personalInfo.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin className="w-4 h-4" />
                            <span className="break-all">{personalInfo.linkedin}</span>
                        </div>
                    )}
                    {personalInfo.website && (
                        <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            <span className="break-all">{personalInfo.website}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {professionalSummary && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-3" style={{ color: accentColor }}>
                        PROFESSIONAL SUMMARY
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{professionalSummary}</p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        PROFESSIONAL EXPERIENCE
                    </h2>

                    <div className="space-y-4">
                        {experience.map((exp, index) => (
                            <div key={index} className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{exp.position || "Position"}</h3>
                                        <p className="text-gray-700 font-medium">{exp.company || "Company"}</p>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        <p>
                                            {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                        </p>
                                    </div>
                                </div>
                                {exp.description && (
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects - ✅ FIXED: Better projects display */}
            {projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        PROJECTS
                    </h2>

                    <div className="space-y-4">
                        {projects.map((proj, index) => (
                            <div key={index} className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{proj.name || "Project Name"}</h3>
                                        {proj.type && (
                                            <p className="text-gray-600 font-medium">{proj.type}</p>
                                        )}
                                    </div>
                                </div>
                                {proj.description && (
                                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {proj.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        EDUCATION
                    </h2>

                    <div className="space-y-3">
                        {education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {edu.degree || "Degree"} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-700">{edu.institution || "Institution"}</p>
                                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>{formatDate(edu.graduation_date)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-4" style={{ color: accentColor }}>
                        CORE SKILLS
                    </h2>

                    <div className="flex gap-4 flex-wrap">
                        {skills.map((skill, index) => (
                            <div key={index} className="text-gray-700">
                                • {skill}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default ClassicTemplate;