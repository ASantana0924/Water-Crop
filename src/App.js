import "./styles.css";
import React from "react";
import Counter from "./Counter";
import Name from "./Name";

export default function App() {
  return (
    <div className="App">
      <Name />
      <Counter />
    </div>
  );
}
