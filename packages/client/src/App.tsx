import Sidebar from "$/components/Sidebar/Sidebar.tsx";
import HomePage from "$/pages/HomePage.tsx";
import TopicPage from "$/pages/TopicPage.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import cssClasses from "./App.module.scss";

export default function App() {
  return (
    <div className={cssClasses.App}>
      <BrowserRouter>
        <Sidebar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/topics/@/:slug" element={<TopicPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}