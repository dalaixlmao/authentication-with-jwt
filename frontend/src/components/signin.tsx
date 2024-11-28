import InputBox from "./inputbox";
import Button from "./button";
import axios from "axios";
import React, { useState } from "react";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col items-center bg-black/20 py-5 pb-10 rounded-xl">
      <div className="text-3xl font-bold">Signin</div>
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
        title={loading?"Loading...":"Signin"}
        onClick={async () => {
            setLoading(true)
          console.log(email, password);
          console.log(email, password);
          const res = await axios.post("http://localhost:8000/signin", {
            email,
            password,
          });
          console.log(res.data);
          localStorage.setItem("token", res.data.token);
          setLoading(false)
        }}
      />
    </div>
  );
}
