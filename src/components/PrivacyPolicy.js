import React from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  EyeIcon,
  LockClosedIcon,
  UserGroupIcon,
  GlobeAltIcon,
  FingerPrintIcon,
  MailIcon,
} from "@heroicons/react/outline";
import { Footer } from "./Footer";

const privacySections = [
  {
    title: "Information Collection",
    content:
      "We collect personal information that you provide to us such as name, contact information, passwords and security data, and payment information. We collect personal information when you register for an account, use or request our service, sign up for our newsletter, or communicate with us.",
    icon: EyeIcon,
  },
  {
    title: "Use of Information",
    content:
      "We use the information we collect for various purposes, including to provide and maintain our services, to notify you about changes to our services, to allow you to participate in interactive features of our service when you choose to do so, for customer support, and to monitor the usage of our service.",
    icon: GlobeAltIcon,
  },
  {
    title: "Information Security",
    content:
      "We take the security of your personal information seriously and use appropriate technical and organizational measures to protect it from unauthorized access, alteration, disclosure, or destruction.",
    icon: LockClosedIcon,
  },

  {
    title: "Cookies and Tracking",
    content:
      "We use cookies and similar tracking technologies to track the activity on our service and we hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.",
    icon: FingerPrintIcon,
  },
  {
    title: "Contact Us",
    content:
      "For any questions about this Privacy Policy, please contact us at support@virtunotes.com.",
    icon: MailIcon,
  },
];

const Section = ({ title, content, Icon }) => (
  <div className="bg-white shadow sm:rounded-lg mb-4">
    <div className="px-4 py-5 sm:px-6 flex items-center">
      <Icon className="h-6 w-6 text-gray-500 mr-4" />
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
    </div>
    <div className="border-t border-gray-200">
      <dl>
        <dd className="px-4 py-5 sm:px-6 text-sm text-gray-700">{content}</dd>
      </dl>
    </div>
  </div>
);

const PrivacyPolicy = () => {
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <motion.div className="flex flex-col min-h-screen pt-4 bg-gray-100">
      <div className="bg-transparent px-6 pt-1 border-b border-white">
        <div className="container mx-auto flex flex-col px-4 lg:px-20">
          <Navbar />

          <div className="container mx-auto px-4 lg:px-20 py-12">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { scale: 0.8, opacity: 0 },
                  visible: { scale: 1, opacity: 1, transition: { delay: 0.4 } },
                }}
                className="mb-6"
              >
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
                  Privacy Policy
                </h1>
                <p className="text-gray-600 text-center">
                  Last updated: December 9, 2023
                </p>
              </motion.div>

              {privacySections.map(({ title, content, icon: Icon }, index) => (
                <Section
                  key={index}
                  title={title}
                  content={content}
                  Icon={Icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default PrivacyPolicy;
