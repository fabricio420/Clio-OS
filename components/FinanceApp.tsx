import React, { useState, useMemo, memo } from 'react';
import type { FinancialProject, Transaction, ModalView, TransactionPeriod } from '../types';
import { PlusIcon, ChevronLeftIcon, MoreVerticalIcon, DownloadIcon, BarChartIcon } from './icons';
import Modal from './Modal';
import { FinancialProjectForm } from './forms/FinancialProjectForm';
import { TransactionForm } from './forms/TransactionForm';
import Header from './Header';

interface FinanceAppProps {
    financialProjects: FinancialProject[];
    handleSaveFinancialProject: (data: Omit<FinancialProject, 'id' | 'transactions'>, id?: string) => void;
    handleDeleteFinancialProject: (projectId: string) => void;
    handleSaveTransaction: (projectId: string, data: Omit<Transaction, 'id'>, id?: string) => void;
    handleDeleteTransaction: (projectId: string, transactionId: string) => void;
}

const ProjectCard: React.FC<{ project: FinancialProject; onSelect: () => void; }> = memo(({ project, onSelect }) => {
    const { totalIncome, totalExpenses, balance } = useMemo(() => {
        const totalIncome = project.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = project.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpenses;
        return { totalIncome, totalExpenses, balance };
    }, [project.transactions]);

    const balanceColor = balance >= 0 ? 'text-lime-400' : 'text-red-400';

    return (
        <button onClick={onSelect} className="bg-slate-900 rounded-lg shadow-md p-6 text-left w-full hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 border-t border-lime-400">
            <h3 className="text-xl font-bold text-white truncate">{project.name}</h3>
            <p className="text-sm text-slate-400 mb-4 h-10 overflow-hidden">{project.description}</p>
            <div className="border-t border-slate-700 pt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                    <p className="text-xs text-slate-400">Receitas</p>
                    <p className="font-semibold text-lime-400">R$ {totalIncome.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">Despesas</p>
                    <p className="font-semibold text-red-400">R$ {totalExpenses.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">Saldo</p>
                    <p className={`font-bold text-lg ${balanceColor}`}>R$ {balance.toFixed(2)}</p>
                </div>
            </div>
        </button>
    );
});

const TransactionRow: React.FC<{ transaction: Transaction; onEdit: () => void; onDelete: () => void; }> = memo(({ transaction, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const isIncome = transaction.type === 'income';
    const amountColor = isIncome ? 'text-lime-400' : 'text-red-400';
    const sign = isIncome ? '+' : '-';

    return (
        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-md hover:bg-slate-800/50 group">
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-100 truncate">{transaction.description}</p>
                <p className="text-xs text-slate-400">{transaction.category} - {transaction.date}</p>
            </div>
            <div className="flex items-center space-x-4">
                <p className={`font-semibold ${amountColor}`}>{sign} R$ {transaction.amount.toFixed(2)}</p>
                <div className="relative">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVerticalIcon className="w-5 h-5"/>
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-slate-950 border border-slate-700 rounded-md shadow-lg z-10">
                            <button onClick={() => { onEdit(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Editar</button>
                            <button onClick={() => { onDelete(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800">Excluir</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

const FinanceApp: React.FC<FinanceAppProps> = ({ financialProjects, handleSaveFinancialProject, handleDeleteFinancialProject, handleSaveTransaction, handleDeleteTransaction }) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [modalView, setModalView] = useState<ModalView | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
    const [period, setPeriod] = useState<TransactionPeriod>('all');

    const selectedProject = useMemo(() => financialProjects.find(p => p.id === selectedProjectId), [financialProjects, selectedProjectId]);
    
    const filteredTransactions = useMemo(() => {
        if (!selectedProject) return [];
        if (period === 'all') return selectedProject.transactions;
        
        const now = new Date();
        return selectedProject.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            if(period === 'month') {
                return transactionDate.getUTCMonth() === now.getUTCMonth() && transactionDate.getUTCFullYear() === now.getUTCFullYear();
            }
            if(period === 'week') {
                const oneWeekAgo = new Date();
                oneWeekAgo.setUTCDate(now.getUTCDate() - 7);
                return transactionDate >= oneWeekAgo;
            }
            return true;
        });
    }, [selectedProject, period]);

    const { totalIncome, totalExpenses, balance } = useMemo(() => {
        const transactions = filteredTransactions || [];
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpenses;
        return { totalIncome, totalExpenses, balance };
    }, [filteredTransactions]);
    
    const openModal = (view: ModalView, data: any = null, type?: 'income' | 'expense') => {
        setModalView(view);
        setEditingItem(data);
        if (type) setTransactionType(type);
    };
    
    const closeModal = () => {
        setModalView(null);
        setEditingItem(null);
    };

    const handleSaveAndClose = (saveFn: (...args: any[]) => void) => (...args: any[]) => {
        saveFn(...args);
        closeModal();
    };
    
    if (selectedProject) {
        return (
             <div className="h-full flex flex-col">
                <header className="flex-shrink-0 px-4 md:px-8 pt-6">
                    <button onClick={() => setSelectedProjectId(null)} className="flex items-center space-x-2 text-sm text-sky-400 hover:text-sky-300 mb-2">
                        <ChevronLeftIcon className="h-4 w-4" />
                        <span>Voltar para todos os projetos</span>
                    </button>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white">{selectedProject.name}</h2>
                            <p className="text-slate-400">{selectedProject.description}</p>
                        </div>
                         <div className="flex items-center space-x-2 self-start sm:self-center">
                            <button onClick={() => openModal('transaction', null, 'income')} className="py-2 px-3 bg-lime-600 hover:bg-lime-700 text-white font-semibold rounded-md transition text-sm">Nova Receita</button>
                            <button onClick={() => openModal('transaction', null, 'expense')} className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition text-sm">Nova Despesa</button>
                        </div>
                    </div>
                     <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                         <div className="bg-slate-900 p-4 rounded-lg"><p className="text-xs text-slate-400">Receitas</p><p className="font-semibold text-lime-400 text-xl">R$ {totalIncome.toFixed(2)}</p></div>
                        <div className="bg-slate-900 p-4 rounded-lg"><p className="text-xs text-slate-400">Despesas</p><p className="font-semibold text-red-400 text-xl">R$ {totalExpenses.toFixed(2)}</p></div>
                        <div className="bg-slate-900 p-4 rounded-lg"><p className="text-xs text-slate-400">Saldo</p><p className={`font-bold text-2xl ${balance >= 0 ? 'text-lime-400' : 'text-red-400'}`}>R$ {balance.toFixed(2)}</p></div>
                    </div>
                </header>

                 <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 mt-2">
                    {filteredTransactions.length > 0 ? (
                        <div className="space-y-2">
                            {filteredTransactions
                                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map(t => (
                                <TransactionRow 
                                    key={t.id} 
                                    transaction={t} 
                                    onEdit={() => openModal('transaction', t, t.type)} 
                                    onDelete={() => handleDeleteTransaction(selectedProjectId, t.id)}
                                />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-16 bg-slate-900 rounded-lg border-t border-slate-700"><p className="text-slate-400">Nenhuma transação registrada.</p></div>
                    )}
                </main>
                <Modal isOpen={!!modalView} onClose={closeModal} title={modalView === 'financial_project' ? 'Projeto Financeiro' : 'Transação'}>
                    {modalView === 'financial_project' && <FinancialProjectForm onSubmit={handleSaveAndClose(handleSaveFinancialProject)} project={editingItem} />}
                    {modalView === 'transaction' && <TransactionForm onSubmit={handleSaveAndClose((data, id) => handleSaveTransaction(selectedProjectId!, {...data, type: transactionType }, id))} transaction={editingItem} type={transactionType} />}
                </Modal>
             </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <Header
                title="Finanças"
                subtitle="Gerencie os projetos financeiros e o fluxo de caixa do coletivo."
                action={
                    <button onClick={() => openModal('financial_project')} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition">
                        <PlusIcon className="h-5 w-5" />
                        <span>Novo Projeto</span>
                    </button>
                }
            />
            <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
                {financialProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {financialProjects.map(project => (
                            <ProjectCard key={project.id} project={project} onSelect={() => setSelectedProjectId(project.id)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-slate-900 rounded-lg border-t border-slate-700"><p className="text-slate-400">Nenhum projeto financeiro criado.</p></div>
                )}
            </div>
            <Modal isOpen={!!modalView} onClose={closeModal} title={modalView === 'financial_project' ? 'Projeto Financeiro' : 'Transação'}>
                {modalView === 'financial_project' && <FinancialProjectForm onSubmit={handleSaveAndClose(handleSaveFinancialProject)} project={editingItem} />}
                {modalView === 'transaction' && <TransactionForm onSubmit={handleSaveAndClose((data, id) => handleSaveTransaction(selectedProjectId!, {...data, type: transactionType }, id))} transaction={editingItem} type={transactionType} />}
            </Modal>
        </div>
    )
}

export default FinanceApp;