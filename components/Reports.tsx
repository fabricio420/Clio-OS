import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TaskStatus } from '../types';
import type { EventInfoData, Task, ScheduleItem, FinancialProject, Artist, Member } from '../types';
import { PrintIcon, DownloadIcon, CheckSquareIcon, CalendarIcon, DollarSignIcon, MicIcon, UsersIcon } from './icons';
import Header from './Header';

interface ReportsProps {
    eventInfo: EventInfoData;
    tasks: Task[];
    schedule: ScheduleItem[];
    financialProjects: FinancialProject[];
    totalBudget: number;
    artists: Artist[];
    members: Member[];
}

const ReportSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <section className={`bg-slate-900 p-6 rounded-lg shadow-md mb-6 break-inside-avoid border-t border-lime-400 ${className}`}>
        <h3 className="text-xl font-bold text-lime-400 border-b-2 border-slate-700 pb-2 mb-4">{title}</h3>
        <div className="space-y-4 text-slate-300">{children}</div>
    </section>
);

const ReportStatBox: React.FC<{ icon: React.ReactNode; value: string; label: string; colorClass: string; }> = ({ icon, value, label, colorClass }) => (
    <div className="bg-slate-700 p-4 rounded-lg flex items-center space-x-4">
        <div className={`p-3 rounded-full bg-slate-600 ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-slate-400">{label}</p>
        </div>
    </div>
);

const ReportMetricCard: React.FC<{ title: string; value: string; description: string; progress?: number; colorClass: string; icon: React.ReactNode }> = ({ icon, title, value, description, progress, colorClass }) => (
     <div className="bg-slate-700 p-4 rounded-lg shadow-md flex flex-col justify-between break-inside-avoid">
        <div>
            <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-full bg-slate-600 ${colorClass}`}>{icon}</div>
                <div>
                    <p className="text-sm text-slate-400">{title}</p>
                    <p className="text-xl font-bold text-white">{value}</p>
                </div>
            </div>
        </div>
        <div>
            {typeof progress === 'number' ? (
                <>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>{description}</span>
                        <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                        <div className={`h-2 rounded-full ${colorClass.replace('text', 'bg')}`} style={{ width: `${progress}%` }}></div>
                    </div>
                </>
            ) : (
                 <p className="text-xs text-slate-400 mt-2">{description}</p>
            )}
        </div>
    </div>
);


const Reports: React.FC<ReportsProps> = ({ eventInfo, tasks, schedule, financialProjects, totalBudget, artists, members }) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownloadPdf = async () => {
        if (!reportRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(reportRef.current, { 
                scale: 2,
                backgroundColor: '#1e293b', // bg-slate-800
                useCORS: true
            });
            const imgData = canvas.toDataURL('image/png');
            
            const pdfWidth = 595.28; 
            const pageHeight = 841.89;
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / pdfWidth;
            const totalPdfHeight = imgHeight / ratio;
            
            const pdf = new jsPDF('p', 'pt', 'a4');
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, totalPdfHeight);

            let heightLeft = totalPdfHeight;
            while(heightLeft >= 0) {
              position = heightLeft - totalPdfHeight;
              pdf.addPage();
              pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
              heightLeft -= pageHeight;
            }
            if (pdf.getNumberOfPages() > Math.ceil(totalPdfHeight / pageHeight)) {
                pdf.deletePage(pdf.getNumberOfPages());
            }

            const fileName = `relatorio-${eventInfo.eventName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
            pdf.save(fileName);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Ocorreu um erro ao gerar o PDF.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };
    
    // Calculate all metrics
    const expenses = financialProjects.flatMap(p => p.transactions.filter(t => t.type === 'expense'));
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBudget = totalBudget - totalSpent;
    const budgetProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 100;

    const completedTasks = tasks.filter(t => t.status === TaskStatus.Done).length;
    const totalTasks = tasks.length;
    const tasksProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const toDoTasks = tasks.filter(t => t.status === TaskStatus.ToDo).length;
    const pendingTasks = tasks.filter(t => t.status !== TaskStatus.Done);

    const confirmedArtists = artists.length;
    const artistGoal = eventInfo.artistGoal;
    const artistsProgress = artistGoal > 0 ? (confirmedArtists / artistGoal) * 100 : 0;

    const teamSize = members.length;
    const sortedSchedule = [...schedule].sort((a, b) => a.time.localeCompare(b.time));

    return (
        <>
            <style>
                {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-area, #print-area * {
                        visibility: visible;
                    }
                    #print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        color: #cbd5e1 !important; /* text-slate-300 */
                        background-color: #1e293b !important; /* bg-slate-800 */
                    }
                     #print-area h1, #print-area h2, #print-area h3, #print-area h4 {
                        color: white !important;
                    }
                    .no-print {
                        display: none;
                    }
                    .break-inside-avoid {
                        page-break-inside: avoid;
                    }
                }
                `}
            </style>
            <div className="h-full flex flex-col">
                <div className="no-print">
                    <Header
                        title="Relatório do Evento"
                        subtitle="Visão consolidada de todas as informações para impressão ou PDF."
                        action={
                            <div className="flex items-center space-x-2">
                                <button onClick={handlePrint} className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-md transition">
                                    <PrintIcon className="h-5 w-5" />
                                    <span>Imprimir</span>
                                </button>
                                <button
                                    onClick={handleDownloadPdf}
                                    disabled={isGenerating}
                                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:bg-blue-800 disabled:cursor-not-allowed"
                                >
                                    <DownloadIcon className="h-5 w-5" />
                                    <span>{isGenerating ? 'Gerando...' : 'Baixar PDF'}</span>
                                </button>
                            </div>
                        }
                    />
                </div>

                <div id="print-area" className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
                     <div ref={reportRef} className="bg-slate-800 md:p-8">
                        <div className="text-center mb-8 break-inside-avoid">
                           <h1 className="text-4xl font-bold text-white">{eventInfo.eventName}</h1>
                           <p className="text-slate-400 mt-1">Organizado por <span className="font-semibold text-lime-400">{eventInfo.collectiveName}</span></p>
                           <p className="text-sm text-slate-500 mt-2">Relatório gerado em: {new Date().toLocaleString('pt-BR')}</p>
                       </div>
                    
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 break-inside-avoid">
                            <ReportStatBox icon={<MicIcon className="h-6 w-6"/>} value={String(confirmedArtists)} label="Artistas Confirmados" colorClass="text-sky-400" />
                            <ReportStatBox icon={<CheckSquareIcon className="h-6 w-6"/>} value={String(toDoTasks)} label="Tarefas a Fazer" colorClass="text-yellow-400" />
                            <ReportStatBox icon={<DollarSignIcon className="h-6 w-6"/>} value={`R$ ${remainingBudget.toFixed(2)}`} label="Orçamento Restante" colorClass="text-lime-400" />
                            <ReportStatBox icon={<UsersIcon className="h-6 w-6"/>} value={String(teamSize)} label="Membros da Equipe" colorClass="text-blue-400" />
                        </div>
                        
                        <ReportSection title="Visão Geral do Progresso">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <ReportMetricCard icon={<CheckSquareIcon className="h-5 w-5" />} title="Tarefas" value={`${completedTasks}/${totalTasks}`} description="Concluídas" progress={tasksProgress} colorClass="text-lime-500" />
                                <ReportMetricCard icon={<DollarSignIcon className="h-5 w-5" />} title="Orçamento" value={`R$ ${totalSpent.toFixed(2)}`} description={`de R$ ${totalBudget.toFixed(2)}`} progress={budgetProgress} colorClass="text-blue-500" />
                                <ReportMetricCard icon={<MicIcon className="h-5 w-5" />} title="Artistas" value={`${confirmedArtists}/${artistGoal}`} description="Meta" progress={artistsProgress} colorClass="text-sky-500" />
                                <ReportMetricCard icon={<CalendarIcon className="h-5 w-5" />} title="Cronograma" value={`${schedule.length} atividades`} description="Itens planejados" colorClass="text-yellow-500" />
                            </div>
                        </ReportSection>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ReportSection title="Tarefas Pendentes">
                                {pendingTasks.length > 0 ? (
                                    <ul className="list-disc pl-5 space-y-1">
                                        {pendingTasks.map(t => <li key={t.id}>{t.title} (Prazo: {t.dueDate})</li>)}
                                    </ul>
                                ) : <p className="text-slate-400">Todas as tarefas foram concluídas!</p>}
                            </ReportSection>

                            <ReportSection title="Próximos Itens do Cronograma">
                                {sortedSchedule.length > 0 ? (
                                    <ul className="divide-y divide-slate-700">
                                        {sortedSchedule.slice(0, 5).map(s => (
                                            <li key={s.id} className="py-2">
                                                <p><span className="font-bold text-blue-300">{s.time}</span> - {s.title}</p>
                                                <p className="text-xs text-slate-400 pl-2">Resp: {s.responsible}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-slate-400">Cronograma não definido.</p>}
                            </ReportSection>
                             
                            <ReportSection title="Despesas Detalhadas" className="md:col-span-2">
                                {expenses.length > 0 ? (
                                    <ul className="list-disc pl-5 space-y-1">
                                        {expenses.map(e => <li key={e.id}>{e.description} ({e.category}): <span className="text-red-400">R$ {e.amount.toFixed(2)}</span></li>)}
                                    </ul>
                                ) : <p className="text-slate-400">Nenhuma despesa registrada.</p>}
                            </ReportSection>

                            <ReportSection title="Artistas Confirmados" className="md:col-span-2">
                                {artists.length > 0 ? (
                                    <ul className="divide-y divide-slate-700">
                                        {artists.map(a => (
                                            <li key={a.id} className="py-2">
                                                <p className="font-bold">{a.name} - <span className="font-normal text-lime-300">{a.performanceType}</span></p>
                                                <p className="text-xs text-slate-400">Contato: {a.contact}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-slate-400">Nenhum artista confirmado.</p>}
                            </ReportSection>

                            <ReportSection title="Equipe de Organização" className="md:col-span-2">
                                {members.length > 0 ? (
                                    <ul className="list-disc pl-5 columns-2">
                                        {members.map(m => <li key={m.id}>{m.name} - <span className="text-sky-400">{m.role}</span></li>)}
                                    </ul>
                                ) : <p className="text-slate-400">Nenhum membro na equipe.</p>}
                            </ReportSection>
                         </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reports;