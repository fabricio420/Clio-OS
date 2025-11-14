import React, { useState, useMemo, memo } from 'react';
import type { FinancialProject, Transaction, ModalView, TransactionPeriod } from '../types';
import { PlusIcon, ChevronLeftIcon, MoreVerticalIcon, DownloadIcon, BarChartIcon, WalletIcon } from './icons';
import Modal from './Modal';
import { FinancialProjectForm } from './forms/FinancialProjectForm';
import { TransactionForm } from './forms/TransactionForm';
import Header from './Header';

// --- DASHBOARD HELPER COMPONENTS ---

const StatCard: React.FC<{ title: string; value: number; colorClass: string; }> = ({ title, value, colorClass }) => (
    <div className="bg-slate-900 p-4 rounded-lg shadow-md text-center border-t-2 border-slate-700">
        <p className="text-sm text-slate-400">{title}</p>
        <p className={`text-3xl font-bold ${colorClass}`}>R$ {value.toFixed(2)}</p>
    </div>
);

const CategoryChart: React.FC<{ data: { name: string; amount: number; percentage: number }[] }> = ({ data }) => {
    if (data.length === 0) {
        return <p className="text-slate-500 text-center py-4">Nenhuma despesa para exibir.</p>;
    }
    return (
        <div className="space-y-3">
            {data.map(item => (
                <div key={item.name} className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300 font-medium">{item.name}</span>
                        <span className="text-slate-400">R$ {item.amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---

const FinancialDashboard: React.FC<{ projects: FinancialProject[] }> = memo(({ projects }) => {
    const allTransactions = useMemo(() => projects.flatMap(p => p.transactions), [projects]);

    const { totalIncome, totalExpenses, balance } = useMemo(() => {
        const income = allTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = allTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return { totalIncome: income, totalExpenses: expenses, balance: income - expenses };
    }, [allTransactions]);

    const expensesByCategory = useMemo(() => {
        const categoryMap: { [key: string]: number } = {};
        allTransactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
            });

        if (Object.keys(categoryMap).length === 0) return [];

        const total = Object.values(categoryMap).reduce((sum, amount) => sum + amount, 0);
        
        return Object.entries(categoryMap)
            .map(([name, amount]) => ({ name, amount, percentage: total > 0 ? (amount / total) * 100 : 0 }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5); // Show top 5 categories
    }, [allTransactions]);


    return (
        <div className="space-y-8">
            <section>
                <h3 className="text-xl font-semibold text-white mb-4">Visão Geral</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total de Receitas" value={totalIncome} colorClass="text-lime-400" />
                    <StatCard title="Total de Despesas" value={totalExpenses} colorClass="text-red-400" />
                    <StatCard title="Saldo Geral" value={balance} colorClass={balance >= 0 ? 'text-white' : 'text-red-400'} />
                </div>
            </section>
            <section>
                <h3 className="text-xl font-semibold text-white mb-4">Maiores Despesas por Categoria</h3>
                <div className="bg-slate-900 p-6 rounded-lg shadow-md border-t border-slate-700">
                    <CategoryChart data={expensesByCategory} />
                </div>
            </section>
        </div>
    );
});


// --- PROJECT & TRANSACTION COMPONENTS ---

const ProjectCard: React.FC<{ project: FinancialProject; onSelect: () => void; onEdit: () => void; onDelete: () => void; }> = memo(({ project, onSelect, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    
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
        <div className="bg-slate-900 rounded-lg shadow-md text-left w-full border-t border-lime-400 relative transition-all duration-200 hover:ring-2 hover:ring-blue-500">
            <div className="absolute top-4 right-4 z-10">
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700">
                    <MoreVerticalIcon className="h-5 w-5" />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-slate-950 border border-slate-700 rounded-md shadow-lg z-10">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Editar</button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800">Excluir</button>
                    </div>
                )}
            </div>
            <button onClick={onSelect} className="p-6 w-full text-left focus:outline-none rounded-lg">
                <h3 className="text-xl font-bold text-white truncate pr-8">{project.name}</h3>
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
        </div>
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
                <p className="text-xs text-slate-400">{transaction.category} - {new Date(transaction.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
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

const TabButton: React.FC<{ label: string; icon: React.ReactNode; isActive: boolean; onClick: () => void; }> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-3 text-sm font-semibold transition-colors rounded-t-md ${
            isActive
                ? 'bg-slate-800 text-lime-400 border-b-2 border-lime-400'
                : 'text-slate-400 hover:text-white'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);


// --- MAIN APP COMPONENT ---

interface FinanceAppProps {
    financialProjects: FinancialProject[];
    handleSaveFinancialProject: (data: Omit<FinancialProject, 'id' | 'transactions'>, id?: string) => void;
    handleDeleteFinancialProject: (projectId: string) => void;
    handleSaveTransaction: (projectId: string, data: Omit<Transaction, 'id'>, id?: string) => void;
    handleDeleteTransaction: (projectId: string, transactionId: string) => void;
}

const FinanceApp: React.FC<FinanceAppProps> = ({ financialProjects, handleSaveFinancialProject, handleDeleteFinancialProject, handleSaveTransaction, handleDeleteTransaction }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'projects'>('dashboard');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [modalView, setModalView] = useState<ModalView | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
    const [period, setPeriod] = useState<TransactionPeriod>('all');
    const [projectMenuOpen, setProjectMenuOpen] = useState(false);

    const selectedProject = useMemo(() => financialProjects.find(p => p.id === selectedProjectId), [financialProjects, selectedProjectId]);
    
    const filteredTransactions = useMemo(() => {
        if (!selectedProject) return [];
        
        const sorted = [...selectedProject.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (period === 'all') return sorted;
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return sorted.filter(t => {
            const parts = t.date.split('-').map(p => parseInt(p, 10));
            const transactionDate = new Date(parts[0], parts[1] - 1, parts[2]);

            if (period === 'month') {
                return transactionDate.getMonth() === today.getMonth() && transactionDate.getFullYear() === today.getFullYear();
            }
            if (period === 'week') {
                const oneWeekAgo = new Date(today);
                oneWeekAgo.setDate(today.getDate() - 6);
                return transactionDate >= oneWeekAgo && transactionDate <= today;
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
    
    const PeriodButton: React.FC<{label:string, value: TransactionPeriod}> = ({label, value}) => (
        <button 
            onClick={() => setPeriod(value)}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition ${period === value ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
        >{label}</button>
    );

    const handleExportCSV = () => {
        if (!selectedProject) return;
        const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'];
        const rows = filteredTransactions
            .map(t => [
                new Date(t.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'}),
                `"${t.description.replace(/"/g, '""')}"`,
                t.category,
                t.type === 'income' ? 'Receita' : 'Despesa',
                t.amount.toFixed(2)
            ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(',') + "\n" 
            + rows.join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `transacoes-${selectedProject.name.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleConfirmDeleteProject = (projectId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este projeto e todas as suas transações?')) {
            handleDeleteFinancialProject(projectId);
            if (selectedProjectId === projectId) {
                setSelectedProjectId(null);
            }
        }
    };

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
    
    return (
        <div className="h-full flex flex-col">
            {selectedProject ? (
                <>
                    <header className="flex-shrink-0 px-4 md:px-8 pt-6">
                        <button onClick={() => setSelectedProjectId(null)} className="flex items-center space-x-2 text-sm text-sky-400 hover:text-sky-300 mb-2">
                            <ChevronLeftIcon className="h-4 w-4" />
                            <span>Voltar para todos os projetos</span>
                        </button>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                            <div className="flex items-start gap-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-white">{selectedProject.name}</h2>
                                    <p className="text-slate-400">{selectedProject.description}</p>
                                </div>
                                <div className="relative flex-shrink-0">
                                    <button onClick={() => setProjectMenuOpen(p => !p)} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-700">
                                        <MoreVerticalIcon className="w-5 h-5"/>
                                    </button>
                                    {projectMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-32 bg-slate-950 border border-slate-700 rounded-md shadow-lg z-10">
                                            <button onClick={() => { openModal('financial_project', selectedProject); setProjectMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Editar</button>
                                            <button onClick={() => { handleConfirmDeleteProject(selectedProject.id); setProjectMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800">Excluir</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 self-start sm:self-center">
                                <button onClick={() => openModal('transaction', null, 'income')} className="py-2 px-3 bg-lime-600 hover:bg-lime-700 text-white font-semibold rounded-md transition text-sm">Nova Receita</button>
                                <button onClick={() => openModal('transaction', null, 'expense')} className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition text-sm">Nova Despesa</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                            <StatCard title="Receitas" value={totalIncome} colorClass="text-lime-400" />
                            <StatCard title="Despesas" value={totalExpenses} colorClass="text-red-400" />
                            <StatCard title="Saldo" value={balance} colorClass={balance >= 0 ? 'text-white' : 'text-red-400'} />
                        </div>
                        <div className="flex items-center justify-between mt-4 border-t border-slate-700 pt-4">
                            <div className="flex items-center space-x-2">
                                <PeriodButton label="Tudo" value="all" />
                                <PeriodButton label="Este Mês" value="month" />
                                <PeriodButton label="Últimos 7 dias" value="week" />
                            </div>
                            <button onClick={handleExportCSV} className="flex items-center space-x-2 text-sm text-sky-400 hover:text-sky-300">
                                <DownloadIcon className="h-4 w-4" />
                                <span>Exportar CSV</span>
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 mt-4">
                        {filteredTransactions.length > 0 ? (
                            <div className="space-y-2">
                                {filteredTransactions
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
                            <div className="text-center py-16 bg-slate-900 rounded-lg border-t border-slate-700"><p className="text-slate-400">Nenhuma transação encontrada para este período.</p></div>
                        )}
                    </main>
                </>
            ) : (
                <>
                    <Header
                        title="Finanças"
                        subtitle="Gerencie os projetos financeiros e o fluxo de caixa do coletivo."
                        action={ activeTab === 'projects' && (
                            <button onClick={() => openModal('financial_project')} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition">
                                <PlusIcon className="h-5 w-5" />
                                <span>Novo Projeto</span>
                            </button>
                        )}
                    />
                    <div className="px-4 md:px-8 flex-shrink-0">
                        <div className="border-b border-slate-700 flex items-center">
                            <TabButton label="Dashboard" icon={<BarChartIcon className="w-5 h-5"/>} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                            <TabButton label="Projetos" icon={<WalletIcon className="w-5 h-5"/>} isActive={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
                        </div>
                    </div>

                    <main className="flex-1 overflow-y-auto px-4 md:px-8 pt-6 pb-8">
                        {activeTab === 'dashboard' && <FinancialDashboard projects={financialProjects} />}
                        {activeTab === 'projects' && (
                            financialProjects.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {financialProjects.map(project => (
                                        <ProjectCard 
                                            key={project.id} 
                                            project={project} 
                                            onSelect={() => setSelectedProjectId(project.id)}
                                            onEdit={() => openModal('financial_project', project)}
                                            onDelete={() => handleConfirmDeleteProject(project.id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-slate-900 rounded-lg border-t border-slate-700">
                                    <p className="text-slate-400">Nenhum projeto financeiro criado.</p>
                                    <p className="text-sm mt-2">Clique em "Novo Projeto" para começar a organizar suas finanças.</p>
                                </div>
                            )
                        )}
                    </main>
                </>
            )}

            <Modal isOpen={!!modalView} onClose={closeModal} title={modalView === 'financial_project' ? (editingItem ? 'Editar Projeto' : 'Novo Projeto') : (editingItem ? 'Editar Transação' : 'Nova Transação')}>
                {modalView === 'financial_project' && <FinancialProjectForm onSubmit={handleSaveAndClose((data, id) => handleSaveFinancialProject(data, id || editingItem?.id))} project={editingItem} />}
                {modalView === 'transaction' && selectedProjectId && <TransactionForm onSubmit={handleSaveAndClose((data, id) => handleSaveTransaction(selectedProjectId, {...data, type: transactionType }, id))} transaction={editingItem} type={transactionType} />}
            </Modal>
        </div>
    );
}

export default FinanceApp;
