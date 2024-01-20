import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Navbar from "./Navbar";
import { Footer } from "./Footer";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";

const faqData = [
  {
    question: "What technology powers VirtuNotes?",
    answer:
      "VirtuNotes is powered by cutting-edge AI and machine learning algorithms that have been trained on a vast corpus of educational and professional materials. This enables our tool to accurately identify and summarize key points from lectures and meetings.",
  },
  {
    question: "How secure is my data with VirtuNotes?",
    answer:
      "Security is a top priority at VirtuNotes. We utilize advanced encryption and a robust security framework to ensure that all data is securely stored and protected against unauthorized access.",
  },
  {
    question:
      "Can VirtuNotes integrate with other educational tools and platforms?",
    answer:
      "Yes, VirtuNotes is built to be interoperable and can seamlessly integrate with popular educational tools and platforms, enhancing and streamlining your learning or teaching experience.",
  },
  {
    question: "What kind of customer support does VirtuNotes offer?",
    answer:
      "We offer comprehensive customer support, including a dedicated help center, live chat, and email assistance. Our priority is to ensure that all users can navigate and utilize our platform with ease.",
  },
  {
    question: "Does VirtuNotes offer any training or resources for new users?",
    answer:
      "Absolutely. We provide a wealth of resources, including video tutorials, comprehensive guides, and webinars to help new users get started and make the most out of VirtuNotes.",
  },
  {
    question: "How does VirtuNotes contribute to academic success?",
    answer:
      "VirtuNotes is designed to enhance the learning process by providing tools for better note-taking, study, and revision. Our summaries help students focus on the essence of the material, promoting better understanding and retention.",
  },
  {
    question: "Is there a trial period for new users?",
    answer:
      "Yes, we offer a free trial period which allows new users to explore the full range of features available on VirtuNotes. We believe in providing value first, ensuring our users can make informed decisions about our service.",
  },
  {
    question: "What languages does VirtuNotes support?",
    answer:
      "Our platform supports transcription and summarization in over 69 languages, catering to a global audience and a diverse user base.",
  },
  {
    question: "How does VirtuNotes handle different accents and dialects?",
    answer:
      "Our AI is trained on a wide range of accents and dialects to ensure accuracy in transcription across various languages and regional pronunciations.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "We believe in flexibility and have made it easy for users to cancel their subscriptions at any time without any hidden fees or complications.",
  },
];

function FAQ() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqVariants = {
    open: { opacity: 1, height: "auto" },
    collapsed: { opacity: 0, height: 0 },
  };

  return (
    <motion.div className="flex flex-col min-h-screen pt-4 bg-gray-100">
      <div className="bg-transparent px-6 pt-1 border-b border-white">
        <div className="container mx-auto flex flex-col px-4 lg:px-20">
          <Navbar />

          <div className="container mx-auto px-4 lg:px-20 py-12 mb-10">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
              Frequently Asked Questions
            </h1>
            <div className="w-full max-w-4xl mx-auto">
              {faqData.map((faq, index) => (
                <motion.div
                  className="border-b border-gray-200 last:border-b-0"
                  key={index}
                  initial={false}
                  animate={{ opacity: 1 }}
                >
                  <div
                    className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-100 transition duration-150 ease-in-out"
                    onClick={() => toggleFAQ(index)}
                  >
                    <h2 className="text-xl font-semibold text-gray-700">
                      {faq.question}
                    </h2>
                    {openFAQ === index ? (
                      <IoIosArrowDropup className="text-2xl text-gray-700" />
                    ) : (
                      <IoIosArrowDropdown className="text-2xl text-gray-700" />
                    )}
                  </div>
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        key="content"
                        variants={faqVariants}
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        transition={{
                          duration: 0.8,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="p-5">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </motion.div>
  );
}

export default FAQ;
