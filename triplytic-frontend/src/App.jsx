import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import BookingForm from "./components/BookingForm";

function App() {
  const userId = "some-logged-in-user-id"; // replace with real user id from login state

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard userId={userId} />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/booking" element={<BookingForm userId={userId} onRecommendation={(rec) => console.log(rec)} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
