import { ImageIcon } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../../context/context";

const Header = () => {
  const { user, logout } = useContext(userContext);
  const navigate= useNavigate()

  const handleLogout = () => {
    logout();
    navigate('/')
    
  };
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <ImageIcon className="h-8 w-8 text-blue-500 mr-2" />
            <span className="font-bold text-xl text-gray-800">
              ImageUploader
            </span>
          </Link>
          <div>
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
