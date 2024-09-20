import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SingUpPage";

function App() {
  return (
   <Routes>
   <Route path="/"  element={<LoginPage/>}/>
   <Route path="/signup"  element={<SignUpPage/>}/>
   </Routes>
  );
}

export default App;
