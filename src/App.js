import { Toaster } from "react-hot-toast";
import "./App.css";
import EditorPage from "./components/EditorPage";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DataProvider from "./components/DataProvider";

function App() {
  return (
    <>
      <div>
        <Toaster position="top-center"></Toaster>
      </div>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor/:roomId" element={<EditorPage />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </>
  );
}

export default App;
