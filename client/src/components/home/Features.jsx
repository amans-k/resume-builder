import React from 'react';
import { Zap } from 'lucide-react'; // ✅ Proper icon import
import Title from './Title'; // ✅ Ensure Title.jsx exists in same folder

const Features = () => {
  const [isHover, setIsHover] = React.useState(false);

  return (
    <div id="features" className="flex flex-col items-center my-16 px-4 scroll-mt-12">
      {/* Section Tag */}
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-400/10 rounded-full px-6 py-1.5 mb-6">
        <Zap width={14} /> {/* ✅ Fixed syntax */}
        <span>Simple Process</span>
      </div>

      {/* ✅ Fixed prop name */}
      <Title
        title="Build Your Resume"
        description="Our streamlined process helps you create a professional resume in minutes with intelligent AI-powered tools and features."
      />

      {/* Main container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-6xl">
        <img
          className="max-w-md w-full xl:-ml-16"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
          alt="Features illustration"
        />

        <div
          className="space-y-6"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          {/* Feature 1 */}
          <div className="flex items-center gap-6 max-w-md group cursor-pointer">
            <div
              className={`p-6 border flex gap-4 rounded-xl transition-all duration-300 ${
                isHover
                  ? 'bg-violet-100 border-violet-300'
                  : 'bg-white hover:bg-violet-50 hover:border-violet-300'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 stroke-violet-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
              </svg>
              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  Real-Time Analytics
                </h3>
                <p className="text-sm text-slate-600">
                  Get instant insights into your finances with live dashboards.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-6 max-w-md group cursor-pointer">
            <div className="p-6 border flex gap-4 rounded-xl transition-all duration-300 bg-white hover:bg-green-50 hover:border-green-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 stroke-green-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
              </svg>
              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  Bank-Grade Security
                </h3>
                <p className="text-sm text-slate-600">
                  End-to-end encryption, 2FA, and GDPR compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-6 max-w-md group cursor-pointer">
            <div className="p-6 border flex gap-4 rounded-xl transition-all duration-300 bg-white hover:bg-orange-50 hover:border-orange-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 stroke-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 15V3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
              </svg>
              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  Customizable Reports
                </h3>
                <p className="text-sm text-slate-600">
                  Export professional, audit-ready reports for tax or review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; }
      `}</style>
    </div>
  );
};

export default Features;
