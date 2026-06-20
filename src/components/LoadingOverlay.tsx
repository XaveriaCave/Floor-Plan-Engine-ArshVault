import React from 'react';

interface LoadingOverlayProps {
    visible: boolean;
    label?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    visible,
    label = 'Compiling blueprint...',
}) => {
    if (!visible) return null;

    return (
        <div
            id="loading-overlay"
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm anim-fade-in"
        >
            <div className="flex flex-col items-center gap-5">
                {/* PCB Trace Spinner */}
                <div className="relative w-20 h-20">
                    <svg viewBox="0 0 100 100" className="w-20 h-20 spin-slow">
                        {/* Outer trace ring with circuit-style dashes */}
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="3"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            strokeDasharray="18 10"
                            strokeLinecap="round"
                            className="trace-dash"
                        />
                        {/* Inner rotating ring, opposite direction */}
                        <circle
                            cx="50"
                            cy="50"
                            r="28"
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="2"
                            strokeDasharray="10 14"
                            strokeLinecap="round"
                            className="trace-dash-rev"
                        />
                        {/* Corner solder pads */}
                        {[0, 90, 180, 270].map((deg) => (
                            <circle
                                key={deg}
                                cx={50 + 42 * Math.cos((deg * Math.PI) / 180)}
                                cy={50 + 42 * Math.sin((deg * Math.PI) / 180)}
                                r="3"
                                fill="#3b82f6"
                                className="pad-pulse"
                            />
                        ))}
                    </svg>
                    {/* Center pulsing core */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_3px_rgba(34,211,238,0.7)] core-pulse" />
                    </div>
                </div>

                {/* Label */}
                <div className="flex flex-col items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-slate-200 tracking-wide uppercase">
                        {label}
                    </span>
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dot-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dot-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dot-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};