import InputBox from "./inputbox";
import Button from "./button";
import React, { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col items-center bg-black/20 py-5 pb-10 rounded-xl">
      <div className="text-3xl font-bold">Signup</div>
      <InputBox
        label="Name"
        type="text"
        placeholder="Enter your name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <InputBox
        label="Email"
        type="email"
        placeholder="Enter your email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <InputBox
        label="Password"
        type="password"
        placeholder="Enter your password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <Button
        title={loading ? "Loading..." : "Signup"}
        onClick={async () => {
          setLoading(true);
          console.log(name, email, password);
          const res = await axios.post("http://localhost:8000/signup", {
            name,
            email,
            password,
          });
          console.log(res.data);
          localStorage.setItem("token", res.data.token);
          setLoading(false);
        }}
      />
    </div>
  );
}
