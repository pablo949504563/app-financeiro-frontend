import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Pie, Bar, Line } from "react-chartjs-2";

export default function Dashboard() {
  const [totais, setTotais] = useState(null);
  const [mensal, setMensal] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const userId = "teste-user-001";

    api.get(`/transacoes/totais?userId=${userId}`).then(res => {
      setTotais(res.data);
    });

    api.get(`/dashboard/mensal?userId=${userId}`).then(res => {
      setMensal(res.data);
    });

    api.get(`/dashboard/categorias?userId=${userId}`).then(res => {
      setCategorias(res.data);
    });
  }, []);

  if (!totais) return <h3>Carregando Dashboard...</h3>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard Financeiro</h1>

      <div className="kpis">
        <div className="kpi">Saldo Total: R$ {totais.saldoTotal}</div>
        <div className="kpi">Receitas: R$ {totais.totalReceitas}</div>
        <div className="kpi">Despesas: R$ {totais.totalDespesas}</div>
      </div>

      <h2>Despesas por Categoria</h2>
      <Pie
        data={{
          labels: categorias.map(c => c.categoria),
          datasets: [
            {
              data: categorias.map(c => c.total),
            },
          ],
        }}
      />

      <h2>Receitas x Despesas (Mensal)</h2>
      <Bar
        data={{
          labels: mensal.map(m => m.mes),
          datasets: [
            {
              label: "Receitas",
              data: mensal.map(m => m.receitas),
            },
            {
              label: "Despesas",
              data: mensal.map(m => m.despesas),
            },
          ],
        }}
      />
    </div>
  );
}
