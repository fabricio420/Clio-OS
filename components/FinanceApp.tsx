

import React, { useState, useMemo, memo, useRef, useEffect } from 'react';
import type { FinancialProject, Transaction, ModalView, TransactionPeriod, Member } from '../types';
import { PlusIcon, ChevronLeftIcon, MoreVerticalIcon, DownloadIcon, BarChartIcon, WalletIcon, FileTextIcon, PrintIcon, UsersIcon, CheckSquareIcon, SparklesIcon } from './icons';
import Header from './Header';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

// --- CONTRIBUTIONS (FORMERLY DUES) COMPONENT ---

const MemberContributionCard: React.FC<{ 
    member: Member; 
    isPaid: boolean; 
    onPay: () => void; 
}> = ({ member, isPaid, onPay }) => {
    const [justPaid, setJustPaid] = useState(false);

    const handlePayClick = () => {
        setJustPaid(true);
        onPay();
        // Reset animation state after a delay (optional, mostly for repeated clicks if logic allows)
        setTimeout(() => setJustPaid(false), 1000);
    };

    return (
        <div 
            className={`relative p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all duration-500 ease-out
            ${isPaid 
                ? 'border-lime-500 bg-slate-800 shadow-[0_0_20px_rgba(132,204,22,0.15)]' 
                : 'border-slate-700 bg-slate-900/50 grayscale-[0.3] hover:grayscale-0 hover:border-slate-600 hover:bg-slate-800'
            }
            ${justPaid ? 'scale-105 ring-2 ring-lime-400 ring-offset-2 ring-offset-slate-900' : ''}
            `}
        >
            <div className="relative">
                <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className={`w-20 h-20 rounded-full object-cover border-4 transition-colors duration-500 ${isPaid ? 'border-lime-500' : 'border-slate-600'}`} 
                />
                {isPaid && (
                    <div className="absolute -bottom-1 -right-1 bg-lime-500 text-slate-900 rounded-full p-1 shadow-lg animate-in zoom-in">
                        <SparklesIcon className="w-4 h-4" />
                    </div>
                )}
            </div>
            
            <div className="text-center">
                <h4 className={`font-bold text-lg truncate max-w-[150px] ${isPaid ? 'text-white' : 'text-slate-300'}`}>{member.name}</h4>
                <p className="text-xs text-slate-500">{member.role}</p>
            </div>

            <div className="w-full mt-2">
                {isPaid ? (
                    <div className="w-full py-2 rounded-lg bg-lime-500/10 border border-lime-500/30 text-lime-400 text-sm font-semibold flex items-center justify-center gap-2">
                        <CheckSquareIcon className="w-4 h-4" />
                        <span>Contribuinte</span>
                    </div>
                ) : (
                    <button 
                        onClick={handlePayClick}
                        className="w-full py-2 rounded-lg bg-slate-700 hover:bg-lime-600 hover:text-white text-slate-300 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                        <WalletIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Confirmar</span>
                    </button>
                )}
            </div>
        </div>
    );
};

const ContributionsView: React.FC<{ 
    members: Member[], 
    projects: FinancialProject[], 
    onRegisterPayment: (projectId: string, memberName: string, amount: number, date: string) => void 
}> = ({ members, projects, onRegisterPayment }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [amount, setAmount] = useState(50);
    
    // Automatically select the first project (usually General Fund)
    const targetProject = projects.length > 0 ? projects[0] : null;

    const paymentStatus = useMemo(() => {
        if (!targetProject) return {};
        
        const statusMap: Record<string, boolean> = {};
        
        members.forEach(member => {
            // Check if there is a transaction for this member, this month, with category "Contribuição"
            const hasPaid = targetProject.transactions.some(t => 
                t.type === 'income' &&
                (t.category === 'Contribuição' || t.category === 'Mensalidade') && // Support legacy category
                t.description.includes(member.name) &&
                t.date.startsWith(selectedMonth)
            );
            statusMap[member.id] = hasPaid;
        });
        
        return statusMap;
    }, [members, targetProject, selectedMonth]);

    const paidCount = Object.values(paymentStatus).filter(Boolean).length;
    const totalMembers = members.length;
    const progress = totalMembers > 0 ? (paidCount / totalMembers) * 100 : 0;

    const handlePay = (member: Member) => {
        if (!targetProject) return;
        // Create a date string for the current day or default 10th
        const today = new Date();
        const currentMonthStr = today.toISOString().slice(0, 7);
        let paymentDate = `${selectedMonth}-10`; 
        
        if (selectedMonth === currentMonthStr) {
             paymentDate = today.toISOString().slice(0, 10);
        }

        onRegisterPayment(targetProject.id, member.name, amount, paymentDate);
    };

    if (!targetProject) {
        return (
            <div className="text-center py-16 bg-slate-900 rounded-lg border-t border-slate-700">
                <p className="text-slate-400">Para gerenciar contribuições, crie primeiro um Caixa (Projeto Financeiro).</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
             <div className="bg-slate-900/50 p-6 rounded-2xl shadow-lg border border-slate-700/50 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="flex gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mês de Referência</label>
                            <input 
                                type="month" 
                                value={selectedMonth} 
                                onChange={(e) => setSelectedMonth(e.target.value)} 
                                className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-600 focus:ring-2 focus:ring-lime-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Valor Sugerido</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-400">R$</span>
                                <input 
                                    type="number" 
                                    value={amount} 
                                    onChange={(e) => setAmount(parseFloat(e.target.value))} 
                                    className="w-24 bg-slate-800 text-white pl-8 pr-2 py-2 rounded-lg border border-slate-600 focus:ring-2 focus:ring-lime-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-400">Destino: <span className="text-lime-400 font-semibold">{targetProject.name}</span></p>
                        <p className="text-3xl font-bold text-white mt-1">R$ {(paidCount * amount).toFixed(2)} <span className="text-sm font-normal text-slate-500">arrecadados</span></p>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between text-sm text-slate-300 mb-2 font-medium">
                        <span>Adesão da Equipe</span>
                        <span>{paidCount} de {totalMembers} apoiaram</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-lime-600 to-lime-400 h-3 rounded-full transition-all duration-700 ease-out relative" 
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {members.map(member => (
                        <MemberContributionCard 
                            key={member.id}
                            member={member}
                            isPaid={!!paymentStatus[member.id]}
                            onPay={() => handlePay(member)}
                        />
                    ))}
                </div>
                
                {members.length === 0 && (
                    <p className="text-center text-slate-500 py-8">Nenhum membro na equipe para exibir.</p>
                )}
             </div>
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
    onOpenModal: (view: ModalView, data?: any) => void;
    financialProjects: FinancialProject[];
    members?: Member[];
    handleSaveFinancialProject: (data: Omit<FinancialProject, 'id' | 'transactions'>, id?: string) => void;
    handleDeleteFinancialProject: (projectId: string) => void;
    handleSaveTransaction: (projectId: string, data: Omit<Transaction, 'id'>, id?: string) => void;
    handleDeleteTransaction: (projectId: string, transactionId: string) => void;
}

const FinanceApp: React.FC<FinanceAppProps> = ({ onOpenModal, financialProjects, members = [], handleSaveFinancialProject, handleDeleteFinancialProject, handleSaveTransaction, handleDeleteTransaction }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'dues'>('dashboard');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [period, setPeriod] = useState<TransactionPeriod>('all');
    const [projectMenuOpen, setProjectMenuOpen] = useState(false);
    
    const reportRef = useRef<HTMLDivElement>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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

        const csvContent = "\uFEFF" + headers.join(',') + "\n" + rows.join("\n");
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `transacoes-${selectedProject.name.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = async () => {
        if (!reportRef.current || !selectedProject) return;
        setIsGeneratingPdf(true);
        try {
            reportRef.current.style.display = 'block';
            
            const canvas = await html2canvas(reportRef.current, { 
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true
            });
            
            reportRef.current.style.display = 'none';

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = pdfWidth / imgWidth;
            const canvasHeight = imgHeight * ratio;
            
            let heightLeft = canvasHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeight);
            heightLeft -= pdfHeight;

            while (heightLeft >= 0) {
                position = heightLeft - canvasHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeight);
                heightLeft -= pdfHeight;
            }
            
            pdf.save(`relatorio-financeiro-${selectedProject.name.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("Erro ao gerar PDF", error);
            alert("Erro ao gerar PDF");
        } finally {
            setIsGeneratingPdf(false);
        }
    };
    
    const handleConfirmDeleteProject = (projectId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este projeto e todas as suas transações?')) {
            handleDeleteFinancialProject(projectId);
            if (selectedProjectId === projectId) {
                setSelectedProjectId(null);
            }
        }
    };
    
    const handleRegisterDues = (projectId: string, memberName: string, amount: number, date: string) => {
        handleSaveTransaction(projectId, {
            description: `Contribuição - ${memberName}`,
            amount: amount,
            category: 'Contribuição',
            date: date,
            type: 'income'
        });
    };
    
    return (
        <div className="h-full flex flex-col">
            {selectedProject ? (
                <>
                    <div className="fixed left-[-9999px] top-0 w-[800px] bg-white text-slate-900 p-8 font-sans" ref={reportRef} style={{ display: 'none' }}>
                        <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">{selectedProject.name}</h1>
                                <p className="text-slate-500">Relatório Financeiro - Clio OS</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500">Gerado em</p>
                                <p className="font-semibold">{new Date().toLocaleString('pt-BR')}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-8">
                            <div className="flex-1 p-4 bg-slate-100 rounded-lg border border-slate-200 text-center">
                                <p className="text-xs font-bold text-slate-500 uppercase">Receitas</p>
                                <p className="text-2xl font-bold text-green-600">R$ {totalIncome.toFixed(2)}</p>
                            </div>
                            <div className="flex-1 p-4 bg-slate-100 rounded-lg border border-slate-200 text-center">
                                <p className="text-xs font-bold text-slate-500 uppercase">Despesas</p>
                                <p className="text-2xl font-bold text-red-600">R$ {totalExpenses.toFixed(2)}</p>
                            </div>
                            <div className="flex-1 p-4 bg-slate-100 rounded-lg border border-slate-200 text-center">
                                <p className="text-xs font-bold text-slate-500 uppercase">Saldo</p>
                                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>R$ {balance.toFixed(2)}</p>
                            </div>
                        </div>

                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-800 text-white">
                                <tr>
                                    <th className="p-3 rounded-tl-lg">Data</th>
                                    <th className="p-3">Descrição</th>
                                    <th className="p-3">Categoria</th>
                                    <th className="p-3 text-right rounded-tr-lg">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredTransactions.map((t, i) => (
                                    <tr key={t.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className="p-3 text-slate-600">{new Date(t.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                                        <td className="p-3 font-medium text-slate-800">{t.description}</td>
                                        <td className="p-3 text-slate-500">{t.category}</td>
                                        <td className={`p-3 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
                            Documento gerado automaticamente pela plataforma Clio OS.
                        </div>
                    </div>

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
                                            <button onClick={() => { onOpenModal('financial_project', selectedProject); setProjectMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Editar</button>
                                            <button onClick={() => { handleConfirmDeleteProject(selectedProject.id); setProjectMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800">Excluir</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 self-start sm:self-center">
                                <button onClick={() => onOpenModal('transaction', { projectId: selectedProject.id, type: 'income' })} className="py-2 px-3 bg-lime-600 hover:bg-lime-700 text-white font-semibold rounded-md transition text-sm">Nova Receita</button>
                                <button onClick={() => onOpenModal('transaction', { projectId: selectedProject.id, type: 'expense' })} className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition text-sm">Nova Despesa</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                            <StatCard title="Receitas" value={totalIncome} colorClass="text-lime-400" />
                            <StatCard title="Despesas" value={totalExpenses} colorClass="text-red-400" />
                            <StatCard title="Saldo" value={balance} colorClass={balance >= 0 ? 'text-white' : 'text-red-400'} />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 border-t border-slate-700 pt-4 gap-4">
                            <div className="flex items-center space-x-2">
                                <PeriodButton label="Tudo" value="all" />
                                <PeriodButton label="Este Mês" value="month" />
                                <PeriodButton label="Últimos 7 dias" value="week" />
                            </div>
                            <div className="flex items-center space-x-4">
                                <button onClick={handleExportCSV} className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition">
                                    <FileTextIcon className="h-4 w-4" />
                                    <span>CSV (Dados)</span>
                                </button>
                                <button onClick={handleExportPDF} disabled={isGeneratingPdf} className="flex items-center space-x-2 text-sm text-sky-400 hover:text-sky-300 transition font-bold">
                                    <PrintIcon className="h-4 w-4" />
                                    <span>{isGeneratingPdf ? 'Gerando PDF...' : 'Relatório PDF'}</span>
                                </button>
                            </div>
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
                                        onEdit={() => onOpenModal('transaction', { ...t, projectId: selectedProject.id })} 
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
                            <button onClick={() => onOpenModal('financial_project')} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition">
                                <PlusIcon className="h-5 w-5" />
                                <span>Novo Projeto</span>
                            </button>
                        )}
                    />
                    <div className="px-4 md:px-8 flex-shrink-0">
                        <div className="border-b border-slate-700 flex items-center">
                            <TabButton label="Dashboard" icon={<BarChartIcon className="w-5 h-5"/>} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                            <TabButton label="Projetos" icon={<WalletIcon className="w-5 h-5"/>} isActive={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
                            <TabButton label="Contribuições" icon={<UsersIcon className="w-5 h-5"/>} isActive={activeTab === 'dues'} onClick={() => setActiveTab('dues')} />
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
                                            onEdit={() => onOpenModal('financial_project', project)}
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
                        {activeTab === 'dues' && (
                            <ContributionsView 
                                members={members} 
                                projects={financialProjects} 
                                onRegisterPayment={handleRegisterDues}
                            />
                        )}
                    </main>
                </>
            )}
        </div>
    );
}

export default FinanceApp;