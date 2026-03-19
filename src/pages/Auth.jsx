import React, { useState } from "react";
import toast from "react-hot-toast";
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
            className="min-h-screen flex items-center justify-center"
          >
            <div className="bg-white rounded-[40px] h-100 w-180 flex overflow-hidden shadow-lg">
              <div className="w-[60%] flex items-center px-10">
                <LoginForm onSignup={() => setMode("signup")} />
              </div>
              <div className="h-[80%] bg-primary w-1 self-center"></div>
              <div className="w-1/2 flex justify-center items-center">
                <img
                  src="./DarkLogo.png"
                  alt="Logo"
                  className="h-68 object-contain"
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
            className="min-h-screen flex"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-[40%] bg-white"
            >
              <SignupForm onLogin={() => setMode("login")} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-[60%] bg-primary"
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
