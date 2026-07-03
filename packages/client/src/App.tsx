import HomePage from "$/pages/HomePage.tsx";
import TopicPage from "$/pages/TopicPage.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<HomePage />} />
        <Route path="topics/:slug" element={<TopicPage />} />
      </Routes>
    </BrowserRouter>
  );
}