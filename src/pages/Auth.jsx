import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import SignupFeatures from "../components/auth/SignupFeatures";

const Auth = () => {
  const [mode, setMode] = useState("login");

  return (
    <section className="min-h-screen bg-primary font-inter">
      <AnimatePresence mode="wait">
        {mode === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex items-center justify-center px-4 py-24"
          >
            <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-[32px] bg-white shadow-lg lg:h-[40rem] lg:flex-row lg:rounded-[40px]">
              <div className="flex w-full items-center px-5 py-8 sm:px-8 lg:w-[60%] lg:px-10">
                <LoginForm onSignup={() => setMode("signup")} />
              </div>
              <div className="mx-6 h-px bg-primary lg:mx-0 lg:h-[80%] lg:w-1 lg:self-center"></div>
              <div className="flex min-h-[220px] w-full justify-center items-center p-8 lg:w-1/2">
                <img
                  src="./DarkLogo.png"
                  alt="Logo"
                  className="h-40 object-contain sm:h-52 lg:h-68"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="min-h-screen flex flex-col lg:flex-row"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full bg-white lg:w-[40%]"
            >
              <SignupForm onLogin={() => setMode("login")} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full bg-primary lg:w-[60%]"
            >
              <SignupFeatures />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Auth;
