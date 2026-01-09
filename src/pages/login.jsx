import React from "react";

function Login() {
  return (
    // body replacement: min-h-screen bg-green-600 flex justify-center items-center
    <div className="min-h-screen bg-primary flex flex-col items-center pt-45 font-sans">
      
      {/* .idea-box replacement */}
      <div className="bg-white rounded-[40px] h-[25rem] w-[45rem] flex justify-between items-center overflow-hidden shadow-2xl">
        
        {/* .idea-form replacement */}
        <div className="h-full ml-10 flex justify-center items-center w-1/2">
          
          {/* .idea-input-group replacement */}
          <form className="flex flex-col gap-4 w-full pr-8">
            
            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">Username</label>
              <input 
                className="w-full padding-[12px] text-sm border-2 border-gray-300 rounded-xl outline-none transition-colors duration-300 focus:border-green-600 p-3" 
                type="text" 
                placeholder="Enter username" 
                required 
                autoFocus
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">Password</label>
              <input 
                className="w-full text-sm border-2 border-gray-300 rounded-xl outline-none transition-colors duration-300 focus:border-green-600 p-3" 
                type="password" 
                placeholder="Enter password" 
              />
            </div>

            {/* .other-option replacement */}
            <div className="text-[13px] flex flex-col items-start gap-1">
              <a href="abc" className="text-blue-600 hover:underline">Forget password?</a>
              <a href="abc" className="text-blue-600 hover:underline">Don't have any account? Signup</a>
            </div>

            {/* .idea-submit replacement */}
            <button 
              className="bg-blue-600 text-white w-28 cursor-pointer text-lg py-2 px-4 rounded-xl shadow-md self-center mt-4 transition-colors hover:bg-blue-800"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>

        {/* .logo and img replacement */}
        <div className="h-full w-1/2 flex justify-center items-center">
          <img 
            src="./DarkLogo.png" 
            alt="Logo"
            className="h-[17rem] w-[17rem] border-l-2 border-green-700 object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;