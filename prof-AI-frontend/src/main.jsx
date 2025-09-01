import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { ChatProvider } from "./hooks/useChat";
import "./index.css";
import CoursesPage from "./components/CoursesPage";
// import home  from "./pages/home";
// import signup from "./pages/signup";
// import NotFound from "./pages/not-found";
// import Dashboard from "./pages/Dashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path ="/" element = {
          <CoursesPage/>
          } />,
        <Route path="/chat" element={
          <ChatProvider>
              <App />
          </ChatProvider>} />
        {/* <Route path="*" element={<NotFound/>}/> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
