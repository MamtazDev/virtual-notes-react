import React from "react";
import { Footer } from "./Footer";

import Navbar from "./Navbar";
import { motion } from "framer-motion";
import PlanPricing from "./PlanPricing";

function Pricing() {
  return (
    <motion.div className="flex flex-col min-h-screen pt-4 bg-gray-100">
      <div className="bg-transparent px-6 pt-1 border-b border-white">
        <div className="container mx-auto flex flex-col px-4 lg:px-20">
          <Navbar />

          <PlanPricing />
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </motion.div>
  );
}

export default Pricing;
