import "./style.css";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiPlusCircle } from "react-icons/fi";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import firebase from "../../services/FirebaseConnection";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";

export default function New() {
  const { id } = useParams();
  const history = useHistory();
  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customerSelected, setCustomerSelected] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [assunto, setAssunto] = useState("Suporte");
  const [status, setStatus] = useState("Aberto");
  const [complemento, setComplemento] = useState("");
  const [idCustomer, setIdCustomer] = useState(false);

  const { user } = useContext(AuthContext);

  async function loadId(lista) {
    await firebase
      .firestore()
      .collection("chamados")
      .doc(id)
      .get()
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto);
        setStatus(snapshot.data().status);
        setComplemento(snapshot.data().complemento);

        let index = lista.findIndex(
          (item) => item.id === snapshot.data().clienteId
        );
        setCustomerSelected(index);
        setIdCustomer(true);
      })
      .catch((error) => {
        console.log("Erro no ID passado!");
        setIdCustomer(false);
      });
  }

  useEffect(() => {
    async function loadCustomers() {
      await firebase
        .firestore()
        .collection("customers")
        .get()
        .then((snapshot) => {
          let lista = [];
          snapshot.forEach((element) => {
            lista.push({
              id: element.id,
              nomeFantasia: element.data().nomeFantasia,
            });
          });

          if (lista.length === 0) {
            console.log("Nenhuma empresa encontrada!");
            setLoadCustomers(false);
            setCustomers([{ id: "1", nomeFantasia: "FREELA" }]);
            return;
          }

          setCustomers(lista);
          setLoadCustomers(false);

          if (id) {
            loadId(lista);
          }
        })
        .catch((error) => {
          console.log("Erro ao buscar clientes", error);
          setLoadCustomers(false);
          setCustomers([{ id: 1, nomeFantasia: "FREELA" }]);
        });
    }

    loadCustomers();
  }, [id]);

  async function handleRegister(e) {
    e.preventDefault();

    if (idCustomer) {
      await firebase.firestore().collection("chamados").doc(id).update({
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid,
      }).then(() => {
       toast.success('Chamado atualizado!');
       setCustomerSelected(0);
       setComplemento('');
       history.push('/dashboard');
      }).catch((error) => {
       toast.error('Ops! Erro ao editar chamado!');
      });

      return;
    }

    await firebase
      .firestore()
      .collection("chamados")
      .add({
        created: new Date(),
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid,
      })
      .then(() => {
        toast.success("Chamado registrado!");
        setComplemento("");
        setCustomerSelected(0);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Ops, erro ao registrar chamado!");
      });
  }

  function handleChangeSelect(e) {
    setAssunto(e.target.value);
  }

  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  function handleChangeCustomers(e) {
    setCustomerSelected(e.target.value);
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Novo chamado">
          <FiPlusCircle size={25}></FiPlusCircle>
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Cliente</label>
            {loadCustomers ? (
              <input
                type="text"
                disabled={true}
                value="Carregando clientes ..."
              ></input>
            ) : (
              <select value={customerSelected} onChange={handleChangeCustomers}>
                {customers.map((item, index) => {
                  return (
                    <option key={item.id} value={index}>
                      {item.nomeFantasia}
                    </option>
                  );
                })}
              </select>
            )}
            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value={"Suporte"}>Suporte</option>
              <option value={"Visita Tecnica"}>Visita T??cnica</option>
              <option value={"Financeiro"}>Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={status === "Aberto"}
              ></input>
              <span>Em Aberto</span>
              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={status === "Progresso"}
              ></input>
              <span>Progresso</span>
              <input
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionChange}
                checked={status === "Atendido"}
              ></input>
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema (opcional)"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            ></textarea>

            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
