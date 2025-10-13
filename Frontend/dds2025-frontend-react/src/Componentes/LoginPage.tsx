import "./LoginPage.css"; // importa los estilos ajustados
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // acá redirige al home o lo que corresponda
    navigate("/home");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="Usuario"
          className="login-avatar"
        />
        <button className="login-button" onClick={handleLogin}>
          Ingresar
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
