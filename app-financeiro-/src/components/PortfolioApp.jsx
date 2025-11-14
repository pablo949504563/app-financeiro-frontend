import React, { useState } from 'react'
import '../App.css'

const PortfolioApp = () => {
  const [transactions, setTransactions] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('income')

  const addTransaction = () => {
    if (description && amount) {
      const newTransaction = {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        type,
        date: new Date().toLocaleDateString()
      }
      setTransactions([...transactions, newTransaction])
      setDescription('')
      setAmount('')
    }
  }

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id))
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <div className="portfolio-app">
      <header className="app-header">
        <h1>💰 App Financeiro</h1>
        <p>Controle suas finanças de forma simples</p>
      </header>

      <div className="financial-summary">
        <div className="balance-card">
          <h3>Saldo Total</h3>
          <span className={`balance-amount ${balance >= 0 ? 'positive' : 'negative'}`}>
            R$ {balance.toFixed(2)}
          </span>
        </div>
        
        <div className="summary-cards">
          <div className="summary-card income">
            <h4>Receitas</h4>
            <span className="amount positive">R$ {totalIncome.toFixed(2)}</span>
          </div>
          <div className="summary-card expense">
            <h4>Despesas</h4>
            <span className="amount negative">R$ {totalExpenses.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="transaction-form">
        <h3>Adicionar Transação</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Valor"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
          <button onClick={addTransaction}>Adicionar</button>
        </div>
      </div>

      <div className="transactions-list">
        <h3>Histórico de Transações</h3>
        {transactions.length === 0 ? (
          <p className="no-transactions">Nenhuma transação cadastrada</p>
        ) : (
          <div className="transactions">
            {transactions.map(transaction => (
              <div key={transaction.id} className={`transaction ${transaction.type}`}>
                <div className="transaction-info">
                  <span className="description">{transaction.description}</span>
                  <span className="date">{transaction.date}</span>
                </div>
                <div className="transaction-amount">
                  <span className={`amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                  </span>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PortfolioApp