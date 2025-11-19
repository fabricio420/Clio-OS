import React, { memo } from 'react';
import type { Task, ScheduleItem, EventInfoData, Artist, Member, ModalView, FeedPost, FinancialProject } from '../types';
import { TaskStatus } from '../types';
import { CheckSquareIcon, CalendarIcon, DollarSignIcon, MicIcon, UsersIcon } from './icons';
import TeamFeed from './TeamFeed';
import { useCountdown } from '../hooks/useCountdown';

interface DashboardProps {
  onOpenModal: (view: ModalView, data: any) => void;
  eventInfo: EventInfoData;
  tasks: Task[];
  schedule: ScheduleItem[];
  financialProjects: FinancialProject[];
  totalBudget: number;
  artists: Artist[];
  members: Member[];
  feedPosts: FeedPost[];
}

const StatBox: React.FC<{
    icon: React.ReactNode;
    value: string;
    label: string;
    colorClass: string;
}> = memo(({ icon, value, label, colorClass }) => (
    <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl flex items-center space-x-4 border border-white/5 hover:bg-white/10 transition-colors duration-300">
        <div className={`p-3 rounded-xl bg-slate-900/50 shadow-inner ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
            <p className="text-sm text-slate-400 font-medium">{label}</p>
        </div>
    </div>
));

const MetricCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    description: string;
    progress?: number;
    colorClass: string;
}> = memo(({ icon, title, value, description, progress, colorClass }) => (
    <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all duration-300 group">
        <div>
            <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg shadow-sm ${colorClass} bg-opacity-20 text-${colorClass.split('-')[1]}-400`}>{icon}</div>
                <div>
                    <p className="text-sm text-slate-400 font-medium">{title}</p>
                    <p className="text-xl font-bold text-white">{value}</p>
                </div>
            </div>
        </div>
        <div>
            {typeof progress === 'number' ? (
                <>
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span>{description}</span>
                        <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-700/30 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-1.5 rounded-full ${colorClass.replace('text-white', '')} opacity-80 shadow-[0_0_10px_currentColor]`} style={{ width: `${progress}%` }}></div>
                    </div>
                </>
            ) : (
                 <p className="text-xs text-slate-400 mt-2">{description}</p>
            )}
        </div>
    </div>
));


const Dashboard: React.FC<DashboardProps> = ({ onOpenModal, eventInfo, tasks, schedule, financialProjects, totalBudget, artists, members, feedPosts }) => {
  const countdown = useCountdown(eventInfo.eventDate);
  
  const completedTasks = tasks.filter(t => t.status === TaskStatus.Done).length;
  const totalTasks = tasks.length;
  const tasksProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const expenses = financialProjects.flatMap(p => p.transactions.filter(t => t.type === 'expense'));
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 100;
  const remainingBudget = totalBudget - totalSpent;

  const confirmedArtists = artists.length;
  const artistGoal = eventInfo.artistGoal;
  const artistsProgress = artistGoal > 0 ? (confirmedArtists / artistGoal) * 100 : 0;
  
  const toDoTasks = tasks.filter(t => t.status === TaskStatus.ToDo).length;
  const teamSize = members.length;

  const sortedSchedule = [...schedule].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="p-6 md:p-8 space-y-8">
        <div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{eventInfo.eventName}</h2>
            <p className="text-slate-400 mt-2 flex items-center flex-wrap text-lg">
                <span>Organizado por <span className="font-semibold text-lime-400">{eventInfo.collectiveName}</span></span>
                {eventInfo.isCollab && eventInfo.collabDescription && (
                    <span className="text-sky-400 font-semibold before:content-['·'] before:text-slate-600 before:mx-3">
                        {eventInfo.collabDescription}
                    </span>
                )}
            </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950/50 border border-white/10 shadow-2xl p-8 text-center group">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-6">Contagem Regressiva</h3>
                <div className="flex justify-center items-center gap-4 md:gap-12 text-white">
                    {Object.entries(countdown).map(([unit, value]) => (
                        <div key={unit} className="flex flex-col items-center">
                            <span className="text-5xl md:text-7xl font-bold tracking-tighter drop-shadow-lg">
                                {String(value).padStart(2, '0')}
                            </span>
                            <span className="text-xs text-slate-400 uppercase tracking-widest mt-2">{unit}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox 
                icon={<MicIcon className="h-6 w-6"/>}
                value={String(confirmedArtists)}
                label="Artistas"
                colorClass="text-sky-400"
            />
            <StatBox 
                icon={<CheckSquareIcon className="h-6 w-6"/>}
                value={String(toDoTasks)}
                label="A Fazer"
                colorClass="text-yellow-400"
            />
            <StatBox 
                icon={<DollarSignIcon className="h-6 w-6"/>}
                value={`R$ ${remainingBudget.toFixed(0)}`}
                label="Restante"
                colorClass="text-lime-400"
            />
            <StatBox 
                icon={<UsersIcon className="h-6 w-6"/>}
                value={String(teamSize)}
                label="Equipe"
                colorClass="text-blue-400"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <MetricCard 
                icon={<CheckSquareIcon className="h-5 w-5" />}
                title="Tarefas"
                value={`${completedTasks}/${totalTasks}`}
                description="Concluídas"
                progress={tasksProgress}
                colorClass="bg-lime-500 text-white"
            />
            <MetricCard 
                icon={<DollarSignIcon className="h-5 w-5" />}
                title="Orçamento"
                value={`R$ ${totalSpent.toFixed(2)}`}
                description={`de R$ ${totalBudget.toFixed(2)}`}
                progress={budgetProgress}
                colorClass="bg-blue-500 text-white"
            />
            <MetricCard 
                icon={<MicIcon className="h-5 w-5" />}
                title="Artistas"
                value={`${confirmedArtists}/${artistGoal}`}
                description="Meta"
                progress={artistsProgress}
                colorClass="bg-sky-500 text-white"
            />
            <MetricCard 
                icon={<CalendarIcon className="h-5 w-5" />}
                title="Cronograma"
                value={`${schedule.length} itens`}
                description="Atividades"
                colorClass="bg-yellow-500 text-white"
            />
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-lime-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400"></span> Tarefas Pendentes
          </h3>
          <ul className="space-y-3">
            {tasks.filter(t => t.status !== TaskStatus.Done).slice(0, 5).map(task => (
              <li key={task.id} className="bg-slate-800/40 p-3 rounded-xl flex justify-between items-center hover:bg-slate-800/60 transition-colors border border-white/5">
                <span className="text-slate-200 font-medium">{task.title}</span>
                <span className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded-md border border-white/5">{task.dueDate}</span>
              </li>
            ))}
             {tasks.filter(t => t.status !== TaskStatus.Done).length === 0 && <p className="text-slate-500 italic text-center py-4">Tudo em dia por aqui!</p>}
          </ul>
        </div>
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-sky-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span> Próximo no Cronograma
          </h3>
          <ul className="space-y-3">
            {sortedSchedule.slice(0, 4).map(item => (
              <li key={item.id} className="bg-slate-800/40 p-3 rounded-xl hover:bg-slate-800/60 transition-colors border border-white/5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200"><span className="text-sky-300 mr-2">{item.time}</span> {item.title}</span>
                  <span className="text-xs text-slate-500">{item.responsible}</span>
                </div>
              </li>
            ))}
             {schedule.length === 0 && <p className="text-slate-500 italic text-center py-4">O cronograma está vazio.</p>}
          </ul>
        </div>
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-lg lg:col-span-2">
            <h3 className="text-lg font-bold mb-4 text-slate-200">Equipe do Evento</h3>
            <div className="flex items-center -space-x-3 pl-2">
                {members.map(member => (
                    <button
                        key={member.id}
                        onClick={() => onOpenModal('avatar_viewer', member)}
                        className="relative transition-transform transform hover:scale-110 hover:z-10 focus:outline-none"
                        title={`Ver perfil de ${member.name}`}
                    >
                        <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="w-12 h-12 rounded-full border-4 border-slate-900 object-cover shadow-md"
                        />
                    </button>
                ))}
            </div>
        </div>
      </div>
      
      <section>
          <h3 className="text-xl font-bold mb-4 text-white pl-1">Mural da Equipe</h3>
          <div className="max-w-4xl">
             <TeamFeed posts={feedPosts} isReadOnly={true} />
          </div>
      </section>

    </div>
  );
};

export default memo(Dashboard);