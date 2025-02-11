import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

export default function GroceryLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col items-center"
      >
        <motion.div
          variants={itemVariants}
          className="relative h-24 w-24 mb-8"
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <motion.path
              d="M3 6h19l-3 10H6L3 6zm0 0l-1-3h3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                transition: {
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: 0.5
                }
              }}
            />
            <motion.circle
              cx="9"
              cy="20"
              r="1"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                transition: {
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 0.5
                }
              }}
            />
            <motion.circle
              cx="17"
              cy="20"
              r="1"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                transition: {
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  delay: 0.2
                }
              }}
            />
          </svg>
        </motion.div>
        <motion.div 
          variants={itemVariants}
          className="flex flex-col items-center space-y-2"
        >
          <span className="text-2xl font-bold text-primary">GroceryAI</span>
          <span className="text-sm text-muted-foreground">Loading your smart pantry...</span>
        </motion.div>
      </motion.div>
    </div>
  );
}