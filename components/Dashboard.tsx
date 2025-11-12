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
    <div className="bg-slate-800 p-4 rounded-lg flex items-center space-x-4">
        <div className={`p-3 rounded-full bg-slate-700 ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-slate-400">{label}</p>
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
    <div className="bg-slate-800 p-4 rounded-lg shadow-md flex flex-col justify-between">
        <div>
            <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-full bg-slate-700 ${colorClass}`}>{icon}</div>
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
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div className={`h-2 rounded-full ${colorClass}`} style={{ width: `${progress}%` }}></div>
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
    <div className="p-4 md:p-8 space-y-6">
        <div>
            <h2 className="text-3xl font-bold text-white">{eventInfo.eventName}</h2>
            <p className="text-slate-400 mt-1 flex items-center flex-wrap">
                <span>Organizado por <span className="font-semibold text-lime-400">{eventInfo.collectiveName}</span></span>
                {eventInfo.isCollab && eventInfo.collabDescription && (
                    <span className="text-sky-400 font-semibold before:content-['·'] before:text-slate-500 before:mx-2">
                        {eventInfo.collabDescription}
                    </span>
                )}
            </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow-lg text-center border-t-4 border-blue-500">
            <h3 className="text-lg font-semibold text-slate-300 mb-3">Contagem Regressiva para o Evento</h3>
            <div className="flex justify-center items-center space-x-4 md:space-x-8 text-white">
                {Object.entries(countdown).map(([unit, value]) => (
                    <div key={unit} className="flex flex-col items-center">
                        <span className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-lime-400 to-sky-400">{String(value).padStart(2, '0')}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-widest">{unit}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox 
                icon={<MicIcon className="h-6 w-6"/>}
                value={String(confirmedArtists)}
                label="Artistas Confirmados"
                colorClass="text-sky-400"
            />
            <StatBox 
                icon={<CheckSquareIcon className="h-6 w-6"/>}
                value={String(toDoTasks)}
                label="Tarefas a Fazer"
                colorClass="text-yellow-400"
            />
            <StatBox 
                icon={<DollarSignIcon className="h-6 w-6"/>}
                value={`R$ ${remainingBudget.toFixed(2)}`}
                label="Orçamento Restante"
                colorClass="text-lime-400"
            />
            <StatBox 
                icon={<UsersIcon className="h-6 w-6"/>}
                value={String(teamSize)}
                label="Membros da Equipe"
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
                value={`${schedule.length} atividades`}
                description="Itens planejados"
                colorClass="bg-yellow-500 text-white"
            />
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-lime-400">Tarefas Pendentes</h3>
          <ul className="space-y-3">
            {tasks.filter(t => t.status !== TaskStatus.Done).slice(0, 5).map(task => (
              <li key={task.id} className="bg-slate-700 p-3 rounded-md flex justify-between items-center">
                <span className="text-slate-200">{task.title}</span>
                <span className="text-xs text-slate-400">{task.dueDate}</span>
              </li>
            ))}
             {tasks.filter(t => t.status !== TaskStatus.Done).length === 0 && <p className="text-slate-400">Nenhuma tarefa pendente!</p>}
          </ul>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-sky-400">Próximos Itens do Cronograma</h3>
          <ul className="space-y-3">
            {sortedSchedule.slice(0, 4).map(item => (
              <li key={item.id} className="bg-slate-700 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">{item.time} - {item.title}</span>
                  <span className="text-xs text-slate-400">Resp: {item.responsible}</span>
                </div>
              </li>
            ))}
             {schedule.length === 0 && <p className="text-slate-400">O cronograma está vazio.</p>}
          </ul>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-md lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-lime-400">Equipe do Evento</h3>
            <div className="flex items-center -space-x-2">
                {members.map(member => (
                    <button
                        key={member.id}
                        onClick={() => onOpenModal('avatar_viewer', member)}
                        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 rounded-full transition-transform transform hover:scale-110"
                        title={`Ver perfil de ${member.name}`}
                    >
                        <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="w-10 h-10 rounded-full border-2 border-slate-600 object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
      </div>
      
      <section>
          <h3 className="text-xl font-semibold mb-4 text-lime-400">Mural da Equipe</h3>
          <div className="max-w-4xl">
             <TeamFeed posts={feedPosts} isReadOnly={true} />
          </div>
      </section>

    </div>
  );
};

export default memo(Dashboard);