import React from "react";

const API_ENDPOINT = "your_api_endpoint_here";

const organisationName = "your_org_name";
const userName = "your_user_name";
const userEmail = "your_email@example.com";
const userPassword = "your_password";

// const navigate = (path: string) => {
//   // navigation logic here
// };

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  try {
    const response = await fetch(`${API_ENDPOINT}/organizations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: organisationName,
        user_name: userName,
        email: userEmail,
        password: userPassword,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Sign-up failed with status ${
          response.status
        }: ${await response.text()}`
      );
    }
    console.log("Sign-up successful");

    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));
    // navigate("/dashboard");
  } catch (error) {
    console.error("Sign-up failed:", error);
  }
};
