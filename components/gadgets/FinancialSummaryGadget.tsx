import React, { useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { DollarSignIcon } from '../icons';

const Stat: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>
            R$ {value.toFixed(2)}
        </p>
    </div>
);

const FinancialSummaryGadget: React.FC = () => {
    const { financialProjects } = useAppContext();

    const stats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        let totalIncome = 0;
        let totalExpenses = 0;
        let monthlyIncome = 0;
        let monthlyExpenses = 0;

        financialProjects.forEach(project => {
            project.transactions.forEach(t => {
                // Ensure date is valid before processing
                if (t.date && !isNaN(new Date(t.date).getTime())) {
                    const transactionDate = new Date(t.date);
                    if (t.type === 'income') {
                        totalIncome += t.amount;
                        if (transactionDate.getUTCMonth() === currentMonth && transactionDate.getUTCFullYear() === currentYear) {
                            monthlyIncome += t.amount;
                        }
                    } else {
                        totalExpenses += t.amount;
                        if (transactionDate.getUTCMonth() === currentMonth && transactionDate.getUTCFullYear() === currentYear) {
                            monthlyExpenses += t.amount;
                        }
                    }
                }
            });
        });
        const totalBalance = totalIncome - totalExpenses;
        return { totalBalance, monthlyIncome, monthlyExpenses };
    }, [financialProjects]);

    return (
        <div className="w-64 text-left p-2">
             <h3 className="text-sm text-slate-300 font-semibold mb-3 flex items-center gap-2">
                <DollarSignIcon className="w-4 h-4 text-lime-400" />
                Resumo Financeiro
            </h3>
            <div className="space-y-3">
                <Stat 
                    label="Saldo Total" 
                    value={stats.totalBalance} 
                    color={stats.totalBalance >= 0 ? 'text-lime-400' : 'text-red-400'}
                />
                <Stat 
                    label="Receitas (Mês)" 
                    value={stats.monthlyIncome} 
                    color="text-sky-400"
                />
                 <Stat 
                    label="Despesas (Mês)" 
                    value={stats.monthlyExpenses} 
                    color="text-red-400"
                />
            </div>
        </div>
    );
};

export default FinancialSummaryGadget;