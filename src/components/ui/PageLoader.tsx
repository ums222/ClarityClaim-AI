import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center",
      isDark ? "bg-neutral-950" : "bg-neutral-50"
    )}>
      <div className="text-center">
        {/* Animated Logo/Spinner */}
        <motion.div
          className={cn(
            "w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center",
            isDark ? "bg-teal-500/20" : "bg-teal-100"
          )}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className={cn(
              "w-8 h-8 rounded-lg",
              isDark ? "bg-teal-500" : "bg-teal-600"
            )}
            animate={{
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className={cn(
            "text-sm font-medium",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.p>

        {/* Progress Dots */}
        <div className="flex justify-center gap-1 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                isDark ? "bg-teal-500" : "bg-teal-600"
              )}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Minimal loader for smaller sections
export function SectionLoader() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        className={cn(
          "w-8 h-8 border-2 rounded-full",
          isDark 
            ? "border-teal-500/30 border-t-teal-500" 
            : "border-teal-600/30 border-t-teal-600"
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

export default PageLoader;
