import React from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import PlanPricing from "./PlanPricing";

function SubscriptionPlans() {
  return (
    <motion.div className="flex flex-col min-h-screen pt-4 bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-[250px]">
        {/* Main Content */}
        <div className="bg-transparent px-6 pt-1 border-b border-white">
          <div className="container mx-auto flex flex-col px-4 lg:px-[30px]">
            <PlanPricing />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default SubscriptionPlans;
