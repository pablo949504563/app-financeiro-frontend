import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Transacoes() {
  const [lista, setLista] = useState([]);

  useEffect(() => {
    api.get("/transacoes?userId=teste-user-001").then(res => {
      setLista(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Transações</h1>

      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Descrição</th>
            <th>Tipo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {lista.map(t => (
            <tr key={t.id}>
              <td>{t.categoria}</td>
              <td>{t.descricao}</td>
              <td>{t.tipo}</td>
              <td>R$ {t.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
