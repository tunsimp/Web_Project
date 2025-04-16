// Home.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/route/home", { withCredentials: true })
      .then((res) => {
        if (res.data.message === "valid") {
          setName(res.data.user_name);
        }
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  return (
    <div>
      <h1>Hello {name}</h1>
      <h1>Welcome to the Homepage</h1>
      <p>This is a basic React homepage.</p>
    </div>
  );
};

export default Home;