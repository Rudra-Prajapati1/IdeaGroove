import React, { useEffect, useState } from "react";

const HeroSection = () => {
  const [username, setUsername] = useState("User"); // Default to "User"

  useEffect(() => {
    // 1. Get the user string from Local Storage
    const storedUser = localStorage.getItem("user");

    // 2. Parse it back into an object
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      // 3. Set the state (Use .Username or .Name based on your preference)
      if (userObj.Username) {
        setUsername(userObj.Username);
      }
    }
  }, []);
  return (
    <section>
      <div className=" text-primary pt-20 px-16 mt-20 mx-12">
        <h1 className="capitalize text-6xl font-extrabold mb-4">
          Hi {username}
        </h1>
        <div>
          <p className="text-xl font-thin italic">
            Welcome to your collective space.
          </p>
          <p className="text-xl font-thin italic mb-8">
            This is your hub to share and grow.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
