// import React from 'react'

// function Home() {
//   return (
//     <div class="container my-5">
//       <div class="position-relative p-5 text-center text-muted bg-body border border-dashed rounded-5">
//         <button type="button" class="position-absolute top-0 end-0 p-3 m-3 btn-close bg-secondary bg-opacity-10 rounded-pill" aria-label="Close"></button>
//         <h1 class="text-body-emphasis">Welcome to Simplified Communication App</h1>
//         <p class="col-lg-6 mx-auto mb-4">
//         Non nostrud esse aliquip laborum.Ea non minim occaecat cillum duis ipsum cillum sit in do sunt excepteur sunt adipisicing. Deserunt pariatur labore tempor laboris ut. Qui minim occaecat anim consectetur proident non in consectetur aliqua consectetur amet nulla irure. Do laborum velit reprehenderit in nulla qui qui fugiat ea velit.
//         </p>
//         <button class="btn btn-primary px-5 mb-5" type="button">
//           Call to action
//         </button>
//       </div>
//     </div>
//   )
// }

// export default Home

import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://localhost:5000/dashboard", {
          headers: {
            Authorization: token,
          },
        });
        console.log(response.data);
        setMessage(response.data.message);
        localStorage.setItem("user_name", response.data.username);
      } catch (error) {
        setMessage(error.response?.data?.message || "An error occurred.");
      }
    };

    fetchData();
  }, []);

  return (
    <div class="container my-5">
      <div class="position-relative p-5 text-center text-muted bg-body border border-dashed rounded-5">
        <button type="button" class="position-absolute top-0 end-0 p-3 m-3 btn-close bg-secondary bg-opacity-10 rounded-pill" aria-label="Close"></button>
        <h1 class="text-body-emphasis">{message}</h1>
        <p class="col-lg-6 mx-auto mb-4">
          Non nostrud esse aliquip laborum.Ea non minim occaecat cillum duis ipsum cillum sit in do sunt excepteur sunt adipisicing. Deserunt pariatur labore tempor laboris ut. Qui minim occaecat anim consectetur proident non in consectetur aliqua consectetur amet nulla irure. Do laborum velit reprehenderit in nulla qui qui fugiat ea velit.
        </p>
        <button class="btn btn-primary px-5 mb-5" type="button">
          Call to action
        </button>
      </div>
    </div>
  )
};

export default Home;
