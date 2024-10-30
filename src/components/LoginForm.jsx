"use client";
import React, { useState } from "react"; // Import useState to manage form state
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../../lib/uitls";
import { account } from '../../appwrite'; // Import your Appwrite client
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandFacebook
} from "@tabler/icons-react";

export function SignupFormDemo() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      // Create a new user with the provided details
      const user = await account.create('unique()', email, password, name);
      console.log("User created:", user);
     
      window.location.href = '/dashboard'; 
    } catch (error) {
      setError(error.message); 
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await account.createOAuth2Session(
        'google',
        import.meta.env.NEXT_PUBLIC_SUCCESS_REDIRECT_URL, // Use import.meta.env for Vite-based apps
        import.meta.env.NEXT_PUBLIC_FAILURE_REDIRECT_URL
      );
    } catch (error) {
      setError(error.message);
    }
  };
  
  

  return (
    <div className="flex flex-col items-center max-w-2xl lg:ml-[5%] space-y-4 p-6 bg-[#1a211e] w-full">
      <h2 className="font-bold text-2xl text-green-700">
        Welcome to GreenFuture
      </h2>
      <p className="text-[#fff] text-sm max-w-sm mt-2 text-center">
        Together for a Greener Tomorrow!
      </p>

      {error && <p className="text-red-500">{error}</p>} 

      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <LabelInputContainer 
          className="space-y-2"
          >
          <label htmlFor="firstname" className="text-[#fff]">Name</label>
          <Input 
            id="firstname" 
            placeholder="Tyler" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </LabelInputContainer>

        <LabelInputContainer 
          className="space-y-2">
          <label htmlFor="email" className="text-[#fff]">Email Address</label>
          <Input 
            id="email" 
            placeholder="projectmayhem@fc.com" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </LabelInputContainer>

        <LabelInputContainer 
          className="space-y-2">
          <label htmlFor="password" className="text-[#fff]">Password</label>
          <Input 
            id="password" 
            placeholder="••••••••" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br from-green-600 to-green-800 w-full text-white rounded-md py-2 font-medium"
          type="submit"
        >
          Sign up &rarr;
        </button>

        <div className="my-4 border-b border-gray-300 w-full" />

        <div className="flex lg:flex-row flex-col justify-center gap-3">
          <button
            className="flex items-center space-x-2 px-4 lg:w-[200px] w-auto bg-gray-100 text-gray-700 rounded-full h-10 font-medium shadow-md"
            type="button"
            onClick={handleGoogleAuth} 
          >
            <IconBrandGoogle />
            <span className="text-gray-700 text-sm">Google</span>
          </button>

          
          {[ 
            { icon: <IconBrandGithub />, label: "GitHub" },
            { icon: <IconBrandFacebook />, label: "Facebook" },
          ].map(({ icon, label }, index) => (
            <button
              key={index}
              className="flex items-center space-x-2 px-4 lg:w-[200px] w-auto bg-gray-100 text-gray-700 rounded-full h-10 font-medium shadow-md"
              type="button"
            >
              {icon}
              <span className="text-gray-700 text-sm">{label}</span>
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>
);
