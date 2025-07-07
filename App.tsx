
import React, { useState, useCallback } from 'react';
import { StepInfo, HighlightID } from './types';
import { STEPS } from './constants';

const highlightClass = "ring-2 ring-offset-4 ring-offset-slate-900 ring-cyan-400 shadow-lg shadow-cyan-500/50";
const baseBoxClass = "border-2 rounded-lg p-4 text-center font-semibold transition-all duration-300 w-40 h-20 flex items-center justify-center";
const baseArrowClass = "absolute transition-all duration-300 flex items-center justify-center text-sm font-mono text-white";

interface DiagramBoxProps {
  label: string;
  subLabel?: string;
  color: string;
  isHighlighted: boolean;
  onClick?: () => void;
}

const DiagramBox: React.FC<DiagramBoxProps> = ({ label, subLabel, color, isHighlighted, onClick }) => (
  <div className="flex flex-col items-center space-y-2">
    {subLabel && <span className="text-sm text-purple-400 font-mono">{subLabel}</span>}
    <div 
        onClick={onClick}
        className={`${baseBoxClass} ${color} ${isHighlighted ? highlightClass : 'border-slate-600'} ${onClick ? 'cursor-pointer hover:border-slate-400' : ''}`}>
      <span className="text-slate-50">{label}</span>
    </div>
  </div>
);

interface ArrowProps {
  label: string;
  isHighlighted: boolean;
  style: React.CSSProperties;
  dashed?: boolean;
  direction?: 'left' | 'right';
  className?: string;
  onClick?: () => void;
}

const Arrow: React.FC<ArrowProps> = ({ label, isHighlighted, style, dashed = false, direction = 'right', className = '', onClick }) => {
  const highlightArrowClass = "bg-cyan-500 shadow-lg shadow-cyan-500/50";
  const hoverClass = onClick ? (isHighlighted ? 'hover:bg-cyan-400' : 'hover:bg-teal-500') : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseArrowClass} ${isHighlighted ? highlightArrowClass : 'bg-teal-600'} ${hoverClass} ${cursorClass} ${className}`}
      style={style}
      onClick={onClick}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <span>{label}</span>
        {direction === 'right' && (
          <div className={`absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 ${isHighlighted ? 'border-l-cyan-500' : 'border-l-teal-600'} transition-colors duration-300`}></div>
        )}
        {direction === 'left' && (
          <div className={`absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 ${isHighlighted ? 'border-r-cyan-500' : 'border-r-teal-600'} transition-colors duration-300`}></div>
        )}
         {dashed && <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full border-t-2 border-dashed border-slate-400"></div>}
      </div>
    </div>
  );
};

const DiagramColumn: React.FC<{ children: React.ReactNode, hasSubLabel?: boolean }> = ({ children, hasSubLabel = false }) => {
  const lineTopClass = hasSubLabel ? 'top-28' : 'top-20'; // h-20 (5rem=80px) for box, top-28 (7rem=112px) for box+sublabel
  return (
    <div className="flex justify-center relative h-full">
      {/* The timeline */}
      <div className={`absolute ${lineTopClass} bottom-0 w-px border-l-2 border-dashed border-slate-600`} />
      {/* The content (box), rendered on top of the line */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};


const GitDiagram: React.FC<{ highlight: HighlightID; onStepSelect: (id: HighlightID) => void; }> = ({ highlight, onStepSelect }) => {
  return (
    <div className="w-full h-full bg-slate-800/50 rounded-xl p-4 md:p-8 border border-slate-700 relative overflow-hidden">
      <div className="flex justify-between items-start h-full">
        {/* Local Repo Section */}
        <div className="flex-grow border-r-2 border-dashed border-slate-600 pr-4 md:pr-8 h-full flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-8 flex-shrink-0">Local Repo</h2>
          <div className="flex justify-around items-stretch relative flex-grow">
            {/* Columns for positioning */}
            <div className="w-1/4">
                <DiagramColumn>
                    <DiagramBox label="working tree" color="bg-green-900/50 border-green-500" isHighlighted={highlight === HighlightID.WORKING_TREE} onClick={() => onStepSelect(HighlightID.WORKING_TREE)} />
                </DiagramColumn>
            </div>
            <div className="w-1/4">
                 <DiagramColumn>
                    <DiagramBox label="index/ staging area" color="bg-yellow-900/50 border-yellow-500" isHighlighted={highlight === HighlightID.STAGING_AREA} onClick={() => onStepSelect(HighlightID.STAGING_AREA)}/>
                </DiagramColumn>
            </div>
            <div className="w-1/4">
                <DiagramColumn hasSubLabel>
                    <DiagramBox label="local branch" subLabel="e.g. master" color="bg-blue-900/50 border-blue-500" isHighlighted={highlight === HighlightID.LOCAL_REPO} onClick={() => onStepSelect(HighlightID.LOCAL_REPO)} />
                </DiagramColumn>
            </div>
            <div className="w-1/4">
                 <DiagramColumn hasSubLabel>
                    <DiagramBox label="remote-tracking ref" subLabel="e.g. origin/master" color="bg-gray-700 border-gray-500" isHighlighted={highlight === HighlightID.REMOTE_TRACKING_REF} onClick={() => onStepSelect(HighlightID.REMOTE_TRACKING_REF)} />
                </DiagramColumn>
            </div>
            
            {/* Arrows with percentage-based positioning */}
            <Arrow label="git add" isHighlighted={highlight === HighlightID.STAGING_AREA} style={{ top: '20%', left: '12.5%', width: '25%', height: 30 }} onClick={() => onStepSelect(HighlightID.STAGING_AREA)} />
            <Arrow label="git commit" isHighlighted={highlight === HighlightID.LOCAL_REPO} style={{ top: '30%', left: '37.5%', width: '25%', height: 30 }} onClick={() => onStepSelect(HighlightID.LOCAL_REPO)} />
            <Arrow label="git push" isHighlighted={highlight === HighlightID.REMOTE_REPO} style={{ top: '40%', left: '62.5%', width: '62.5%', height: 40 }} onClick={() => onStepSelect(HighlightID.REMOTE_REPO)} />
            <Arrow label="git fetch" isHighlighted={highlight === HighlightID.REMOTE_TRACKING_REF} direction="left" style={{ top: '52%', left: '87.5%', width: '37.5%', height: 30 }} onClick={() => onStepSelect(HighlightID.REMOTE_TRACKING_REF)} />
            <Arrow label="git pull" isHighlighted={highlight === HighlightID.PULL} direction="left" style={{ top: '64%', left: '12.5%', width: '112.5%', height: 50 }} onClick={() => onStepSelect(HighlightID.PULL)} />
            <Arrow label="git checkout" isHighlighted={highlight === HighlightID.CHECKOUT} direction="left" style={{ top: '78%', left: '12.5%', width: '50%', height: 30 }} onClick={() => onStepSelect(HighlightID.CHECKOUT)} />
            
            {/* git merge/rebase arrow: from remote-tracking to working tree, with a dashed segment */}
            <div className="absolute" style={{ top: '90%', left: '12.5%', width: '75%', height: 30 }}>
              {/* 1. Base solid arrow spanning the entire length */}
              <Arrow
                label="git merge/rebase"
                isHighlighted={highlight === HighlightID.MERGE_REBASE}
                direction="left"
                style={{ top: 0, left: 0, width: '100%', height: '100%' }}
                onClick={() => onStepSelect(HighlightID.MERGE_REBASE)}
              />
              {/* 2. Overlay to create the dashed segment on the right side */}
              <div
                className="absolute top-0 right-0 h-full pointer-events-none"
                style={{ width: '33.33%' }} // This covers the area from remote-tracking to local
              >
                {/* This div hides the solid line underneath with the background color */}
                <div className="absolute top-0 left-0 w-full h-full bg-slate-800/50"></div>
                {/* This div draws the dashed line on top */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-full border-t-2 border-dashed ${highlight === HighlightID.MERGE_REBASE ? 'border-cyan-400' : 'border-slate-400'}`}
                ></div>
              </div>
            </div>

          </div>
        </div>

        {/* Remote Repo Section */}
        <div className="w-1/4 pl-4 md:pl-8 h-full flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-8 flex-shrink-0">Remote Repo</h2>
           <div className="flex-grow">
               <DiagramColumn>
                <DiagramBox label="remote branch" color="bg-red-900/50 border-red-500" isHighlighted={highlight === HighlightID.REMOTE_REPO} onClick={() => onStepSelect(HighlightID.REMOTE_REPO)}/>
               </DiagramColumn>
           </div>
        </div>
      </div>
    </div>
  );
};

const InfoPanel: React.FC<{ step: StepInfo }> = ({ step }) => (
  <div className="w-full bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-700 flex flex-col space-y-4 transition-all duration-300 flex-grow overflow-y-auto">
    <h3 className="text-xl md:text-2xl font-bold text-white">
      <span className="mr-3">{step.emoji}</span>
      {step.title}
    </h3>
    <p className="text-slate-300 text-base md:text-lg leading-relaxed">{step.description}</p>
    <p className="text-slate-400 italic text-sm md:text-base">{step.example}</p>
    <div className="pt-2">
      <p className="text-slate-400 text-sm font-semibold">{step.commandLabel}</p>
      {step.command !== 'git add' || step.commandLabel !== 'No necesitas comando aún, solo estás trabajando en tus archivos.' ?
        (<pre className="bg-slate-900 text-cyan-400 p-3 md:p-4 rounded-md mt-2 font-mono text-sm md:text-base overflow-x-auto">
          <code>{step.command}</code>
        </pre>)
        : null
      }
    </div>
  </div>
);

const Controls: React.FC<{ current: number; total: number; onPrev: () => void; onNext: () => void; }> = ({ current, total, onPrev, onNext }) => (
  <div className="flex items-center justify-between w-full flex-shrink-0">
    <button
      onClick={onPrev}
      disabled={current === 0}
      className="px-6 py-3 bg-slate-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
    >
      Anterior
    </button>
    <span className="text-slate-400 font-mono">Paso {current + 1} / {total}</span>
    <button
      onClick={onNext}
      disabled={current === total - 1}
      className="px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500 transition-colors"
    >
      Siguiente
    </button>
  </div>
);


export default function App() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleStepSelect = useCallback((highlightId: HighlightID) => {
    const newStepIndex = STEPS.findIndex(step => step.highlight === highlightId);
    if (newStepIndex !== -1) {
      setCurrentStep(newStepIndex);
    }
  }, []);

  const activeStep = STEPS[currentStep];

  return (
    <main className="h-screen max-h-screen overflow-hidden bg-slate-900 text-white p-4 sm:p-8 flex flex-col">
      <header className="text-center mb-4 w-full flex-shrink-0">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Guía Interactiva de Git</h1>
        <p className="mt-2 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto">
          Sigue los pasos para entender el flujo de trabajo básico de Git de forma visual.
        </p>
      </header>

      <div className="w-full max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-stretch justify-center gap-8 flex-grow min-h-0">
        <div className="w-full lg:w-[60%] xl:w-[65%] flex-shrink-0 flex flex-col">
          <GitDiagram highlight={activeStep.highlight} onStepSelect={handleStepSelect} />
        </div>
        
        <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col space-y-6 min-h-0">
          <InfoPanel step={activeStep} />
          <Controls current={currentStep} total={STEPS.length} onPrev={handlePrev} onNext={handleNext} />
        </div>
      </div>
       <footer className="text-center mt-4 text-slate-500 text-sm flex-shrink-0">
        <p>Recreación interactiva basada en el popular diagrama de flujo de Git.</p>
      </footer>
    </main>
  );
}
