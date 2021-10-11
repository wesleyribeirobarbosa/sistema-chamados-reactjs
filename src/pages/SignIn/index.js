import { useState } from "react";
import { Link } from 'react-router-dom';
import "./style.css";
import logo from '../../assets/logo.png';

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
   e.preventDefault();
   alert('CLICOU');
  };

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
         <img src={logo} alt="Sistema logo"></img>
        </div>
        <form onSubmit={handleSubmit}>
         <h1>Entrar</h1>
         <input type="text" placeholder="email@email.com" value={email} onChange={(e) => setEmail(e.target.value)}></input>
         <input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)}></input>
         <button type="submit">Acessar</button>
        </form>
        <Link to="/register">Criar uma conta</Link>
      </div>
    </div>
  );
}

export default SignIn;
