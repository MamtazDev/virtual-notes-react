import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center text-center space-y-4 p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out"
    >
      <img src={icon} alt={title} className="w-20 h-20" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
