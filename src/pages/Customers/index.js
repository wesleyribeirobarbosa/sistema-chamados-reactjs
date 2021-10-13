import { useState } from "react";
import "./style.css";
import Title from "../../components/Title";
import Header from "../../components/Header";
import { FiUser } from "react-icons/fi";
import firebase from "../../services/FirebaseConnection";
import { toast } from 'react-toastify';

export default function Customers() {
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");

  async function handleAdd(e) {
    e.preventDefault();
    if (nomeFantasia !== "" && cnpj !== "" && endereco !== "") {
      await firebase.firestore().collection("customers").add({
        nomeFantasia: nomeFantasia,
        cnpj: cnpj,
        endereco: endereco,
      }).then(() => {
        setNomeFantasia('');
        setCnpj('');
        setEndereco('');
        toast.success('Cliente cadastrado com sucesso!');
      }).catch((error) => {
       console.log(error);
       toast.error('Erro ao cadastrar cliente!');
      });
    } else {
     toast.error('Preencha todos os campos!');
    }
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Clientes">
          <FiUser size={25}></FiUser>
        </Title>
        <div className="container">
          <form onSubmit={handleAdd} className="form-profile customers">
            <label>Nome fantasia</label>
            <input
              type="text"
              placeholder="Nome da sua empresa"
              value={nomeFantasia}
              onChange={(e) => setNomeFantasia(e.target.value)}
            ></input>
            <label>CNPJ</label>
            <input
              type="text"
              placeholder="Seu CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            ></input>
            <label>Endereço</label>
            <input
              type="text"
              placeholder="Endereço da sua empresa"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            ></input>
            <button type="submit">Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
