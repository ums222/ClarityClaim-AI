import { motion } from 'framer-motion';
import { ClaimStatus, STATUS_LABELS, STATUS_ORDER } from '../../lib/claims';

interface ClaimWorkflowProps {
  currentStatus: ClaimStatus;
  showAll?: boolean;
  compact?: boolean;
}

export function ClaimWorkflow({ 
  currentStatus, 
  showAll = false,
  compact = false 
}: ClaimWorkflowProps) {
  // Define workflow paths
  const mainPath: ClaimStatus[] = ['draft', 'pending_review', 'submitted', 'in_process', 'paid'];
  
  // Determine which path to show based on current status
  const isDenialPath = ['denied', 'partially_denied', 'appealed', 'appeal_won', 'appeal_lost'].includes(currentStatus);
  const path: ClaimStatus[] = showAll ? STATUS_ORDER : (isDenialPath 
    ? [...mainPath.slice(0, 4), 'denied', 'appealed', currentStatus === 'appeal_won' ? 'appeal_won' : currentStatus === 'appeal_lost' ? 'appeal_lost' : 'appeal_won']
    : mainPath);

  const getStatusIndex = (status: ClaimStatus) => path.indexOf(status);
  const currentIndex = getStatusIndex(currentStatus);

  const statusIcons: Partial<Record<ClaimStatus, React.ReactNode>> = {
    draft: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    pending_review: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    submitted: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    in_process: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    denied: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    paid: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    appealed: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    appeal_won: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    appeal_lost: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {path.map((status, index) => {
          const isActive = status === currentStatus;
          const isPast = index < currentIndex;
          const isDenied = status === 'denied' || status === 'appeal_lost';
          const isSuccess = status === 'paid' || status === 'appeal_won';

          return (
            <div key={status} className="flex items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  w-2 h-2 rounded-full
                  ${isActive ? 'ring-2 ring-offset-2 dark:ring-offset-neutral-900' : ''}
                  ${isDenied && (isActive || isPast) ? 'bg-red-500 ring-red-500' : ''}
                  ${isSuccess && (isActive || isPast) ? 'bg-emerald-500 ring-emerald-500' : ''}
                  ${!isDenied && !isSuccess && isActive ? 'bg-blue-500 ring-blue-500' : ''}
                  ${!isDenied && !isSuccess && isPast ? 'bg-blue-500' : ''}
                  ${!isActive && !isPast ? 'bg-neutral-300 dark:bg-neutral-600' : ''}
                `}
              />
              {index < path.length - 1 && (
                <div 
                  className={`w-4 h-0.5 ${
                    isPast ? 'bg-blue-500' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`} 
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {path.map((status, index) => {
          const isActive = status === currentStatus;
          const isPast = index < currentIndex;
          const isDenied = status === 'denied' || status === 'appeal_lost' || status === 'partially_denied';
          const isSuccess = status === 'paid' || status === 'appeal_won';

          return (
            <div key={status} className="flex-1 relative">
              {/* Connector line */}
              {index > 0 && (
                <div 
                  className={`
                    absolute top-5 right-1/2 w-full h-0.5 -translate-y-1/2
                    ${isPast || isActive ? 'bg-blue-500' : 'bg-neutral-300 dark:bg-neutral-600'}
                  `}
                  style={{ left: '-50%' }}
                />
              )}
              
              {/* Step */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center z-10
                    transition-all duration-200
                    ${isActive ? 'ring-4 ring-offset-2 dark:ring-offset-neutral-900' : ''}
                    ${isDenied && (isActive || isPast) 
                      ? 'bg-red-500 text-white ring-red-200 dark:ring-red-800' 
                      : ''}
                    ${isSuccess && (isActive || isPast) 
                      ? 'bg-emerald-500 text-white ring-emerald-200 dark:ring-emerald-800' 
                      : ''}
                    ${!isDenied && !isSuccess && isActive 
                      ? 'bg-blue-500 text-white ring-blue-200 dark:ring-blue-800' 
                      : ''}
                    ${!isDenied && !isSuccess && isPast 
                      ? 'bg-blue-500 text-white' 
                      : ''}
                    ${!isActive && !isPast 
                      ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400' 
                      : ''}
                  `}
                >
                  {statusIcons[status] || (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </motion.div>
                
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className={`
                    mt-2 text-xs font-medium text-center whitespace-nowrap
                    ${isActive 
                      ? 'text-neutral-900 dark:text-white' 
                      : 'text-neutral-500 dark:text-neutral-400'}
                  `}
                >
                  {STATUS_LABELS[status]}
                </motion.span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Mini workflow for table cells
export function WorkflowMini({ status }: { status: ClaimStatus }) {
  const steps: ClaimStatus[] = ['draft', 'submitted', 'in_process', 'paid'];
  const denialSteps: ClaimStatus[] = ['denied', 'appealed'];
  
  const isDenialPath = ['denied', 'partially_denied', 'appealed', 'appeal_won', 'appeal_lost'].includes(status);
  const displaySteps: ClaimStatus[] = isDenialPath ? [...steps.slice(0, 3), ...denialSteps] : steps;
  
  return (
    <div className="flex items-center gap-0.5">
      {displaySteps.map((s, i) => (
        <div
          key={s}
          className={`
            w-1.5 h-1.5 rounded-full
            ${s === status 
              ? (s === 'denied' || s === 'appeal_lost' 
                  ? 'bg-red-500' 
                  : s === 'paid' || s === 'appeal_won' 
                  ? 'bg-emerald-500' 
                  : 'bg-blue-500')
              : steps.indexOf(status) > i || (isDenialPath && denialSteps.indexOf(status) >= denialSteps.indexOf(s))
              ? 'bg-blue-400'
              : 'bg-neutral-300 dark:bg-neutral-600'
            }
          `}
        />
      ))}
    </div>
  );
}
