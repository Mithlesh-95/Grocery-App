import { motion } from "framer-motion";

export default function GroceryLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="relative"
      >
        <svg
          width="120"
          height="120"
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
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.circle
            cx="9"
            cy="20"
            r="1"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          />
          <motion.circle
            cx="17"
            cy="20"
            r="1"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 }}
          />
        </svg>
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading...
        </motion.div>
      </motion.div>
    </div>
  );
}
