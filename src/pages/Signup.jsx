import React from "react";

function Signup() {
  return (
    // Body replacement: Green background, centered content
    <div className="min-h-screen bg-green-700 flex justify-center items-center font-sans">
      
      {/* .signup-box replacement */}
      <div className="bg-white rounded-[40px] h-[25rem] w-[45rem] flex justify-between items-center overflow-hidden">
        
        {/* .logo and img replacement */}
        <div className="flex justify-center items-center">
          <img 
            src="./DarkLogo.png"
            alt="logo" 
            className="h-[20rem] w-[20rem] border-r-2 border-green-700 object-contain"
          />
        </div>

        {/* .idea-form replacement */}
        <div className="h-[25rem] mr-10 flex justify-center items-center flex-1 ml-10">
          
          {/* .idea-input-group replacement */}
          <form className="flex flex-col gap-[15px] w-full">
            
            {/* Form Groups */}
            <div className="flex flex-col">
              <label className="text-[18px] font-semibold">Your name :</label>
              <input 
                className="w-full p-3 text-[14px] border-2 border-gray-300 rounded-[10px] outline-none transition-colors duration-300 focus:border-green-700 box-border" 
                type="text" placeholder="Enter name" required autoFocus 
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[18px] font-semibold">Username :</label>
              <input 
                className="w-full p-3 text-[14px] border-2 border-gray-300 rounded-[10px] outline-none transition-colors duration-300 focus:border-green-700 box-border" 
                type="text" placeholder="Enter Username" required 
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[18px] font-semibold">College Name :</label>
              <input 
                className="w-full p-3 text-[14px] border-2 border-gray-300 rounded-[10px] outline-none transition-colors duration-300 focus:border-green-700 box-border" 
                type="text" placeholder="Enter college name" required 
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[18px] font-semibold">Degree :</label>
              <input 
                className="w-full p-3 text-[14px] border-2 border-gray-300 rounded-[10px] outline-none transition-colors duration-300 focus:border-green-700 box-border" 
                type="text" placeholder="Enter degree" required 
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[18px] font-semibold">Password</label>
              <input 
                className="w-full p-3 text-[14px] border-2 border-gray-300 rounded-[10px] outline-none transition-colors duration-300 focus:border-green-700 box-border" 
                type="password" placeholder="Enter password" 
              />
            </div>

            {/* .other-option replacement */}
            <div className="text-[13px] flex flex-col items-end text-blue-600">
              <a href="abc" className="hover:underline">Already have an account? Login</a>
            </div>

            {/* .idea-submit replacement */}
            <button 
              type="submit" 
              className="border-none rounded-[10px] bg-blue-600 text-white w-[7rem] cursor-pointer text-[1.1rem] p-2 shadow-[2px_2px_2px_rgba(0,0,0,0.3)] self-center mt-[15px] hover:bg-[#063280] transition-colors"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;