import React from "react";
import {
  LightbulbFill,
  Headset,
  ClipboardData,
  ChatSquareText,
} from "react-bootstrap-icons";
import Navbar from "./Navbar";
import { Footer } from "./Footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

function About() {
  // Animations
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1 } },
  };

  const slideFromRight = {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  const slideFromLeft = {
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  const [ref1, inView1] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref2, inView2] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref3, inView3] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div className="flex flex-col min-h-screen pt-4" {...fadeIn}>
      <div className="bg-transparent px-6 pt-1 border-b border-white">
        <div className="container mx-auto flex flex-col px-4 lg:px-20">
          <Navbar />

          {/* Main Content */}
          <div className="container mx-auto px-6 pt-[70px]">
            <section className="mb-4 px-8">
              <div className="container mx-auto text-center">
                <h2 className="text-4xl leading-10 font-extrabold text-gray-900 mb-10">
                  About Virtunotes
                </h2>

                <p className="text-lg leading-7 text-gray-500 mb-6">
                  At Virtunotes, we believe in the power of learning and the
                  limitless potential of the human mind. Our commitment goes
                  beyond technology—it's rooted deeply in making the learning
                  and comprehension process more streamlined, efficient, and
                  meaningful. In a world filled with abundant information, our
                  mission is to assist students, educators, and professionals in
                  distilling knowledge to its essence, ensuring that no key
                  point is ever missed.
                </p>

                <p className="text-lg leading-7 text-gray-500 mb-6">
                  Our advanced software listens attentively, absorbing class
                  lessons, business meetings, or any spoken content. It then
                  processes this data, extracting pivotal insights and
                  presenting them as easily digestible key points. But we don't
                  stop there. We delve deeper, crafting a comprehensive summary
                  that encapsulates the core essence of what was discussed. In
                  doing so, we aim to revolutionize the way individuals recall,
                  understand, and act upon information.
                </p>

                <p className="text-lg leading-7 text-gray-500">
                  At the heart of Virtunotes is a genuine desire to make a
                  difference. We envisage a world where information absorption
                  is no longer a challenge, but a pleasure. Where every
                  individual, irrespective of their background or profession,
                  has the tools at their disposal to harness the power of
                  knowledge. We're here not just to transform how you take
                  notes, but to reshape your learning journey. Because we
                  believe that understanding is the first step towards change.
                </p>
              </div>
            </section>
          </div>

          {/* Features */}
          <div className="py-12">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
              <div className="lg:text-center">
                <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 text-center">
                  Why Choose Virtunotes?
                </h3>
              </div>

              <div className="mt-10">
                <ul className="md:grid md:grid-cols-2 md:col-gap-8 md:row-gap-10">
                  <li className="mb-8">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <LightbulbFill className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg leading-6 font-medium text-gray-900">
                          Innovative Learning
                        </h4>
                        <p className="mt-2 text-base leading-6 text-gray-500">
                          Harnessing AI to reinvent the learning process,
                          ensuring effective and adaptive learning.
                        </p>
                      </div>
                    </div>
                  </li>

                  <li className="mt-10 md:mt-0">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Headset className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg leading-6 font-medium text-gray-900">
                          Active Listening
                        </h4>
                        <p className="mt-2 text-base leading-6 text-gray-500">
                          Our software listens meticulously, ensuring no detail,
                          however minor, is overlooked.
                        </p>
                      </div>
                    </div>
                  </li>

                  <li className="mt-10 md:mt-0">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ClipboardData className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg leading-6 font-medium text-gray-900">
                          Comprehensive Summaries
                        </h4>
                        <p className="mt-2 text-base leading-6 text-gray-500">
                          Dive into detailed summaries that encapsulate the core
                          insights and information, enhancing comprehension.
                        </p>
                      </div>
                    </div>
                  </li>

                  <li className="mt-10 md:mt-0">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ChatSquareText className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg leading-6 font-medium text-gray-900">
                          Community-Centric
                        </h4>
                        <p className="mt-2 text-base leading-6 text-gray-500">
                          Join a thriving community of learners, educators, and
                          professionals, all driven by the quest for knowledge.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}

export default About;
