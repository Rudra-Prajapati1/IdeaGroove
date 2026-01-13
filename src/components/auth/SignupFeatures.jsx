import React, { useEffect, useState } from "react";
import { onboardingSteps } from "../../data/onboardingSteps";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import logo from "/DarkLogo.png";

const INTERVAL = 4500;

const SignupFeatures = () => {
  const [index, setIndex] = useState(0);
  const step = onboardingSteps[index];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % onboardingSteps.length);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-between gap-14 px-12">
      <div className="relative w-[18rem]">
        <Lottie
          animationData={step.lottie}
          loop
          className="w-100 h-100 rounded-2xl p-5 bg-white"
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl p-6 w-[320px] shadow-lg z-100"
        >
          <h3 className="text-4xl font-dm-sans font-semibold text-primary mb-2">
            {step.title}
          </h3>
          <p className="text-lg text-gray-600 font-inter">{step.text}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SignupFeatures;
