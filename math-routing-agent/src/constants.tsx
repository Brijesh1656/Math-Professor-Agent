import React from 'react';

export const DownloadIcon: React.FC<{className?: string}> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const SendIcon: React.FC<{className?: string}> = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M2.002 21.004l20-9-20-9-1.002 7.004h11.002v4H1.002l1 7.004Z" fill="currentColor"/>
    </svg>
);

export const UploadIcon: React.FC<{className?: string}> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
    </svg>
);

export const ThumbsUpIcon: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H5.904c-.66 0-1.174.544-1.174 1.215v4.154c0 .671.514 1.215 1.174 1.215h1.305c.162 0 .315.031.465.09L8.21 15.307c.553.185 1.12.348 1.688.483a18.75 18.75 0 0 0 5.483-3.884c.253-.332.48-.682.682-1.051a3.397 3.397 0 0 0 .23-1.12c0-.166-.017-.332-.051-.49a1.44 1.44 0 0 0-.42-1.07Z" />
  </svg>
);

export const ThumbsDownIcon: React.FC<{className?: string}> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.587 8.188a11.953 11.953 0 0 1-1.043 2.268c-.294.424-.904.683-1.465.683H12.25c-.47 0-.91-.121-1.308-.34L5.58 14.55a4.502 4.502 0 0 1-2.433-4.084V8.625a4.5 4.5 0 0 1 4.5-4.5h.633Z" />
  </svg>
);

export const MathIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="math-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'rgb(56, 189, 248)', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'rgb(34, 211, 238)', stopOpacity: 1}} />
            </linearGradient>
            <style>
                {`
                    @keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    @keyframes rotate-reverse { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
                    .orbit-1 { animation: rotate 20s linear infinite; transform-origin: 100px 100px; }
                    .orbit-2 { animation: rotate-reverse 30s linear infinite; transform-origin: 100px 100px; }
                    .orbit-3 { animation: rotate 40s linear infinite; transform-origin: 100px 100px; }
                `}
            </style>
        </defs>
        <path d="M100 20C144.183 20 180 55.8172 180 100C180 144.183 144.183 180 100 180C55.8172 180 20 144.183 20 100C20 55.8172 55.8172 20 100 20Z" stroke="url(#math-icon-gradient)" strokeWidth="4" strokeOpacity="0.3"/>
        <g className="orbit-1">
            <circle cx="100" cy="35" r="8" fill="url(#math-icon-gradient)"/>
        </g>
        <g className="orbit-2">
            <path d="M155 70L165 80L155 90" stroke="url(#math-icon-gradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g className="orbit-3">
            <rect x="40" y="140" width="16" height="16" fill="url(#math-icon-gradient)" fillOpacity="0.8" rx="4"/>
        </g>
        <text x="100" y="112" textAnchor="middle" fontSize="60" fontWeight="bold" fill="white" >Σ</text>
    </svg>
);

export const BotIcon: React.FC<{className?: string}> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
    </svg>
);
