import { ImageIcon } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../../context/context";

const Header = () => {
  const { user, logout } = useContext(userContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
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
          <div className="flex items-center gap-8">
            {user && (
              <Link
                to="/uploaded-image"
                className="text-lg font-semibold text-gray-700"
              >
                Uploads
              </Link>
            )}
            <div>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
