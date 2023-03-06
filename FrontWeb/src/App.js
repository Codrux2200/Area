import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import All from "./pages/All";
import Workspace from "./pages/Workspace";
import My_workflow from "./pages/My_workflow";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/all" element={<All />} />
        <Route path="/Workspace" element={<Workspace />} />
        <Route path="/My_workflow" element={<My_workflow />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
