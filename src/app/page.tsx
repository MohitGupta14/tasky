"use client";
import React from 'react';
import { Github } from 'lucide-react';
import { signIn } from "next-auth/react";
import './styles/globals.css';

const SignInPage = () => {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/calendar" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-black text-blue-800 mb-2 font-display tracking-tight">
            Tasky
          </h1>
          <p className="text-gray-600 mb-6 text-lg font-medium">
            Your Personal Productivity Companion
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-700 text-center mb-6">
            Sign In to Your Account
          </h2>

          <div className="space-y-4">
            <button 
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
            >
              <Github className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-gray-700">Continue with Google</span>
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-blue-600 hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-600 hover:underline font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;