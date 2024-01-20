import React from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import {
  InformationCircleIcon,
  ShieldExclamationIcon,
  AcademicCapIcon,
  UserIcon,
  BadgeCheckIcon,
  UploadIcon,
  BanIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  RefreshIcon,
  UserRemoveIcon,
  ScaleIcon,
  MailIcon,
} from "@heroicons/react/outline";
import { Footer } from "./Footer";

const termsSections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing VirtuNotes and using our services, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree with any part of the terms, you may not use our services.",
    icon: ShieldExclamationIcon,
  },
  {
    title: "Educational Use",
    content:
      "The tools and services provided by VirtuNotes are intended for educational purposes only. Users are expected to uphold academic integrity and use these services responsibly.",
    icon: AcademicCapIcon,
  },
  {
    title: "User Accounts",
    content:
      "When creating an account with VirtuNotes, you agree to provide accurate and complete information. You are responsible for safeguarding the password and for all activities that occur under your account.",
    icon: UserIcon,
  },
  {
    title: "Intellectual Property Rights",
    content:
      "All contents of VirtuNotes, including text, graphics, logos, and software are the property of VirtuNotes or its content suppliers and protected by international copyright laws.",
    icon: BadgeCheckIcon,
  },
  {
    title: "User Contributions",
    content:
      "Any content you upload to VirtuNotes remains your intellectual property. However, by posting content, you grant us a worldwide, royalty-free license to use, reproduce, and distribute said content.",
    icon: UploadIcon,
  },
  {
    title: "Prohibited Conduct",
    content:
      "You may not access or use VirtuNotes for any purpose other than that for which we make it available. Prohibited activities include cheating, plagiarism, or violating academic policies of your institution.",
    icon: BanIcon,
  },
  {
    title: "Disclaimer of Warranties",
    content:
      'VirtuNotes is provided "as is" and "as available" without any warranties of any kind, including the implied warranties of merchantability, fitness for a particular purpose, or non-infringement.',
    icon: XCircleIcon,
  },
  {
    title: "Limitation of Liability",
    content:
      "VirtuNotes shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use of or inability to use our services.",
    icon: ExclamationCircleIcon,
  },
  {
    title: "Amendments to Terms",
    content:
      "We may amend these terms at any time by posting the updated terms on the site. It is your responsibility to review these terms periodically.",
    icon: RefreshIcon,
  },
  {
    title: "Termination",
    content:
      "We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including a breach of the terms.",
    icon: UserRemoveIcon,
  },
  {
    title: "Governing Law",
    content:
      "These terms shall be governed by and defined following the laws of New York State. VirtuNotes and yourself irrevocably consent that the courts of New York State shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.",
    icon: ScaleIcon,
  },
  {
    title: "Contact Information",
    content:
      "For any questions about these terms, please contact us via support@virtunotes.com",
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

const TermsAndConditions = () => {
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <motion.div className="flex flex-col min-h-screen pt-4 bg-gray-100">
      <div className="bg-transparent px-6 pt-1 border-b border-white">
        <div className="container mx-auto flex flex-col px-4 lg:px-20">
          <Navbar />

          <div className="flex-grow container mx-auto px-4 lg:px-20 py-12">
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
                  Terms and Conditions
                </h1>
                <p className="text-gray-600 text-center">
                  Last updated: December 9, 2023
                </p>
              </motion.div>

              {termsSections.map(({ title, content, icon: Icon }, index) => (
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

export default TermsAndConditions;
