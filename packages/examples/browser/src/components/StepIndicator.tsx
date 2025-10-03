interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="mb-4 md:mb-6 lg:mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 md:top-5 left-0 right-0 h-0.5 md:h-1 bg-slate-700/50 -z-10">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-slate-600 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 mb-1.5 md:mb-2 ${
                  isCompleted
                    ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                    : isCurrent
                    ? "bg-gradient-to-br from-indigo-600 to-slate-700 text-white shadow-lg shadow-indigo-500/30 scale-110"
                    : "bg-slate-700/50 text-slate-500 border-2 border-slate-700"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <div className="text-center">
                <p
                  className={`text-[10px] md:text-xs font-semibold mb-0.5 md:mb-1 transition-colors ${
                    isCurrent ? "text-indigo-300" : isCompleted ? "text-green-300" : "text-slate-500"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[9px] md:text-xs text-slate-600 max-w-[80px] md:max-w-[100px] hidden sm:block">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
