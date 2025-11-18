import React, { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Plus, Trash2, X } from 'lucide-react';

// --- Configuração do Backend ---
const API_URL = 'http://localhost:8080/api/v1/transacoes';
const USER_ID = 'teste-user-001';

const PortfolioApp = () => {
    // Estado do App (Transações e Formulário)
    const [transactions, setTransactions] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('RECEITA');
    const [category, setCategory] = useState('Geral'); // Novo campo categoria
    const [gastosPorCategoria, setGastosPorCategoria] = useState([]);
    // Estados para os totais
    const [totais, setTotais] = useState({
        saldoTotal: 0,
        totalReceitas: 0,
        totalDespesas: 0
    });

    // Estados para Feedback da API
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Formata para R$ (Função auxiliar)
    const formatBRL = (value) => {
        const numberValue = parseFloat(value) || 0;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(numberValue);
    };

// ====================================================================
// FUNÇÃO PARA CALCULAR GASTOS POR CATEGORIA
// ====================================================================
const calcularGastosPorCategoria = useCallback(() => {
    const categorias = {};
    
    transactions.forEach(transaction => {
        if (transaction.tipo === 'DESPESA') {
            const categoria = transaction.categoria || 'Geral';
            const valor = parseFloat(transaction.valor) || 0;
            
            if (!categorias[categoria]) {
                categorias[categoria] = 0;
            }
            categorias[categoria] += valor;
        }
    });
    
    // Converte para array e ordena por valor (maior primeiro)
    const categoriasArray = Object.entries(categorias)
        .map(([nome, valor]) => ({ nome, valor }))
        .sort((a, b) => b.valor - a.valor);
    
    setGastosPorCategoria(categoriasArray);
}, [transactions]);










    // ====================================================================
    // FUNÇÃO PARA BUSCAR TOTAIS
    // ====================================================================
    const fetchTotais = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/totais?userId=${USER_ID}`);
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            setTotais(data);
        } catch (error) {
            console.error("Erro ao buscar totais:", error);
        }
    }, []);

    // ====================================================================
    // FUNÇÃO PARA BUSCAR TRANSAÇÕES (GET)
    // ====================================================================
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setMessage('Carregando transações do servidor...');
        try {
            const response = await fetch(`${API_URL}?userId=${USER_ID}`);
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            
            // Ordena por data (mais recente primeiro)
            const sortedData = data.sort((a, b) => new Date(b.data) - new Date(a.data));
            
            setTransactions(sortedData);
            setMessage(`Carregadas ${sortedData.length} transações do banco.`);
            
            // Busca os totais após carregar as transações
            await fetchTotais();
            
        } catch (error) {
            console.error("Erro ao buscar transações:", error);
            setMessage(`Erro ao carregar dados. Verifique se o backend está ativo: ${API_URL}`);
        } finally {
            setLoading(false);
        }
    }, [fetchTotais]);

    // Efeito para carregar os dados ao montar o componente
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

// ====================================================================
// 🔥 ADICIONE ESTE NOVO USEEFFECT AQUI (Tópico 3)
// ====================================================================
useEffect(() => {
    calcularGastosPorCategoria();
}, [calcularGastosPorCategoria]);


    // ====================================================================
    // FUNÇÃO PARA ADICIONAR TRANSAÇÃO (POST)
    // ====================================================================
    const addTransaction = async () => {
        if (!description || !amount || parseFloat(amount) <= 0) {
            setMessage('Preencha a descrição e um valor válido.');
            return;
        }

        setLoading(true);
        setMessage('Salvando transação no banco de dados...');

        const transactionToSend = {
            descricao: description,
            valor: parseFloat(amount), 
            tipo: type,
            data: new Date().toISOString().slice(0, 10),
            userId: USER_ID,
            categoria: category, // Usa o estado da categoria
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionToSend),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Falha ao inserir: ${response.status} - ${errorText}`);
            }

            // Recarrega a lista e os totais
            await fetchTransactions();
            
            // Limpa o formulário
            setDescription('');
            setAmount('');
            setType('RECEITA');
            setCategory('Geral');
            setMessage('Transação salva com sucesso!');

        } catch (error) {
            console.error("Erro ao salvar transação:", error);
            setMessage(`Erro ao salvar: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // ====================================================================
    // FUNÇÃO PARA DELETAR TRANSAÇÃO
    // ====================================================================
    const deleteTransaction = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir esta transação?')) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status} ao excluir transação`);
            }

            // Recarrega a lista e os totais
            await fetchTransactions();
            setMessage('Transação excluída com sucesso!');
            
        } catch (error) {
            console.error("Erro ao excluir transação:", error);
            setMessage(`Erro ao excluir: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="portfolio-app">
            <header className="app-header">
                <h1>💰 App Financeiro</h1>
                <p>Controle suas finanças de forma simples</p>
                {/* Feedback de status */}
                {message && (
                    <div className={`message ${message.includes('Erro') ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}
            </header>

            {/* ====================================================================
                 Usa os totais do backend em vez de calcular no frontend
            ==================================================================== */}
           <div className="balance-card">
            <span className="balance-label">Saldo Total</span>
            <span className={`balance-amount ${totais.saldoTotal >= 0 ? 'positive' : 'negative'}`}>
                {formatBRL(totais.saldoTotal)}
            </span>
        </div>

        <div className="totais-container">
            {/* Total de Receitas */}
            <div className="total-card receitas">
                <span className="total-label">Total de Receitas</span>
                <p className="total-value receitas">
                    {formatBRL(totais.totalReceitas)}
                </p>
            </div>

            {/* Total de Despesas */}
            <div className="total-card despesas">
                <span className="total-label">Total de Despesas</span>
                <p className="total-value despesas">
                    {formatBRL(totais.totalDespesas)}
                </p>
            </div>
        </div>

            <div className="transaction-form">
                <h3>Adicionar Transação {loading && <RefreshCw size={16} className="spinner" />}</h3>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Descrição"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                    />
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Valor (ex: 150.50)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={loading}
                    />
                    <select value={type} onChange={(e) => setType(e.target.value)} disabled={loading}>
                        <option value="RECEITA">Receita</option>
                        <option value="DESPESA">Despesa</option>
                    </select>
                    
                    <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={loading}>
                        <option value="Geral">Geral</option>
                        <option value="Salário">Salário</option>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Moradia">Moradia</option>
                        <option value="Transporte">Transporte</option>
                        <option value="Lazer">Lazer</option>
                        <option value="Saúde">Saúde</option>
                        <option value="Educação">Educação</option>
                    </select>
                    <button onClick={addTransaction} disabled={loading}>
                        <Plus size={16} className="mr-1 inline" />
                        {loading ? 'Salvando...' : 'Adicionar'}
                    </button>
                </div>
            </div>

            <div className="transactions-list">
                <h3>Histórico de Transações</h3>
                {loading && transactions.length === 0 ? (
                     <p className="loading-state">Carregando dados do servidor...</p>
                ) : transactions.length === 0 ? (
                    <p className="no-transactions">Nenhuma transação cadastrada</p>
                ) : (
                    <div className="transactions">
                        {transactions.map(transaction => {
                            const isExpense = transaction.tipo === 'DESPESA';
                            const value = parseFloat(transaction.valor) || 0;
                            const sign = isExpense ? '-' : '+';
                            
                            return (
                                <div key={transaction.id} className={`transaction ${isExpense ? 'expense' : 'income'}`}>
                                    <div className="transaction-info">
                                        <span className="description">{transaction.descricao}</span>
                                        <span className="category">Categoria: {transaction.categoria || 'Geral'}</span>
                                        <span className="date">{transaction.data}</span>
                                    </div>
                                    <div className="transaction-amount">
                                        <span className={`amount ${isExpense ? 'negative' : 'positive'}`}>
                                            {sign} {formatBRL(value)}
                                        </span>
                                        {/* BOTÃO DELETE AGORA FUNCIONAL */}
                                        <button 
                                            className="delete-btn"
                                            onClick={() => deleteTransaction(transaction.id)}
                                            disabled={loading}
                                            title="Excluir transação"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
{/* ====================================================================
    NOVA SEÇÃO: Gastos por Categoria
    ==================================================================== */}
<div className="gastos-categoria">
    <h3>Gastos por Categoria</h3>
    {gastosPorCategoria.length === 0 ? (
        <p className="no-transactions" style={{textAlign: 'center', padding: '40px'}}>
            Nenhuma despesa cadastrada
        </p>
    ) : (
        <div className="categorias-list">
            {gastosPorCategoria.map((categoria, index) => (
                <div key={categoria.nome} className="categoria-item">
                    <div className="categoria-info">
                        <div className={`categoria-bullet ${categoria.nome.toLowerCase()}`}></div>
                        <span className="categoria-nome">{categoria.nome}</span>
                    </div>
                    <span className="categoria-valor">
                        {formatBRL(categoria.valor)}
                    </span>
                </div>
            ))}
        </div>
    )}
</div>




            <div className="text-center mt-4">
                 <button onClick={fetchTransactions} disabled={loading} className="refresh-btn">
                    <RefreshCw size={16} className="mr-2 inline" />
                    Recarregar da API
                 </button>
            </div>
        </div>
    )
}

export default PortfolioApp;