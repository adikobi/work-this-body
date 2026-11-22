const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const PlayIcon = () => (<svg {...base} fill="currentColor" stroke="none"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>);
export const PauseIcon = () => (<svg {...base} fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1.2" /><rect x="14" y="5" width="4" height="14" rx="1.2" /></svg>);
export const ResetIcon = () => (<svg {...base}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>);
export const SoundOnIcon = () => (<svg {...base}><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></svg>);
export const SoundOffIcon = () => (<svg {...base}><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="m16 9 5 6" /><path d="m21 9-5 6" /></svg>);
export const SkipRestIcon = () => (<svg {...base} fill="currentColor" stroke="none"><path d="M3.5 6.3v11.4a.9.9 0 0 0 1.4.74l7.4-5.7a.9.9 0 0 0 0-1.48L4.9 5.56a.9.9 0 0 0-1.4.74Z" /><path d="M12.5 6.3v11.4a.9.9 0 0 0 1.4.74l7.4-5.7a.9.9 0 0 0 0-1.48l-7.4-5.7a.9.9 0 0 0-1.4.74Z" /></svg>);
export const NextExerciseIcon = () => (<svg {...base} fill="currentColor" stroke="none"><path d="M4.5 6.3v11.4a.9.9 0 0 0 1.4.74l8.4-5.7a.9.9 0 0 0 0-1.48L5.9 5.56a.9.9 0 0 0-1.4.74Z" /><rect x="16.5" y="5" width="3" height="14" rx="1.2" /></svg>);
