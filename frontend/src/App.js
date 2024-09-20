import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import "./tailwind.css";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // เรียก API ไปที่ backend
    fetch("http://localhost:8000/api/data")
      .then((response) => response.json())
      .then((data) => setData(data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>{data ? data : "Loading data..."}</p>
      </header>

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-sm p-6 mx-auto bg-white rounded-xl shadow-lg space-y-4">
          <h1 className="text-3xl font-bold text-blue-600">
            Tailwind CSS Test
          </h1>
          <p className="text-gray-7000">
            This is a test to ensure that Tailwind CSS is working correctly in
            your project.
          </p>
          <button className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600">
            Click Me
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
