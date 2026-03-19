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
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 px-6 py-10 lg:flex-row lg:justify-between lg:gap-14 lg:px-12">
      <div className="relative w-full max-w-[18rem]">
        <Lottie
          animationData={step.lottie}
          loop
          className="h-auto w-full rounded-2xl bg-white p-5"
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="z-100 w-full max-w-[320px] rounded-2xl bg-white p-6 text-center shadow-lg lg:text-left"
        >
          <h3 className="mb-2 text-3xl font-dm-sans font-semibold text-primary sm:text-4xl">
            {step.title}
          </h3>
          <p className="font-inter text-base text-gray-600 sm:text-lg">
            {step.text}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SignupFeatures;
