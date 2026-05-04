import { Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<DashboardPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/products/:id" element={<ProductDetailsPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
