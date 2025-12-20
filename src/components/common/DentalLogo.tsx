"use client";

export default function DentalLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width={size}
            height={size}
            className={className}
        >
            <defs>
                <linearGradient id="toothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0A1628" />
                    <stop offset="100%" stopColor="#0F2040" />
                </linearGradient>
            </defs>

            {/* Background Circle */}
            <circle cx="50" cy="50" r="48" fill="url(#bgGrad)" stroke="#1E3A5F" strokeWidth="2" />

            {/* Stylized Tooth */}
            <path
                d="M50 18 
           C38 18 30 28 30 40 
           C30 52 35 58 37 70 
           C38 78 42 82 45 82 
           C48 82 49 78 50 72 
           C51 78 52 82 55 82 
           C58 82 62 78 63 70 
           C65 58 70 52 70 40 
           C70 28 62 18 50 18 Z"
                fill="url(#toothGrad)"
                opacity="0.95"
            />

            {/* Highlight */}
            <ellipse cx="42" cy="35" rx="6" ry="8" fill="white" opacity="0.3" />

            {/* Sparkle accent */}
            <circle cx="62" cy="28" r="3" fill="#60A5FA" opacity="0.8" />
            <circle cx="68" cy="34" r="2" fill="#60A5FA" opacity="0.5" />
        </svg>
    );
}
