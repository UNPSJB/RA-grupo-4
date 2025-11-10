import "./LoginPage.css"; 
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          // src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          src="https://www.oeco.org.br/wp-content/uploads/2015/04/22102010-albatroz-de-sobrancelha.jpg"
          alt="Usuario"
          className="login-avatar"
        />
        <p className="admin-text">Admin</p>
        <button className="login-button" onClick={handleLogin}>
          Ingresar
        </button>
      </div>
    </div>
  );
}

export default LoginPage;