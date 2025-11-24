
import React, { useState, useMemo } from 'react';
import { HomeIcon, CheckSquareIcon, ClockIcon, MicIcon, UsersIcon, ImageIcon, SearchIcon, BoxIcon, FileTextIcon, WalletIcon, BriefcaseIcon, BrushIcon, BookMarkedIcon, GlobeIcon, UserIcon, MenuIcon, SparklesIcon, LifeBuoyIcon, DatabaseIcon, ZapIcon, PowerIcon } from './icons';

const DocSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="bg-slate-900 p-6 rounded-lg shadow-md mb-8 border-t border-lime-400">
    <div className="flex items-center mb-4">
      <div className="p-2 bg-slate-800 rounded-full mr-4">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-lime-400">{title}</h2>
    </div>
    <div className="prose prose-slate prose-invert max-w-none text-slate-300 space-y-3 leading-relaxed">
      {children}
    </div>
  </section>
);

const sections = [
  {
    id: 'intro',
    title: 'Bem-vindo ao Clio OS',
    icon: <GlobeIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'introdução, boas vindas, visão geral, cultura, produção, coletivos',
    content: (
      <>
        <p>O <strong>Clio OS</strong> é o sistema operacional definitivo para coletivos culturais. Focado na colaboração humana e na eficiência da produção, ele centraliza a comunicação, o financeiro e a governança democrática do seu sarau.</p>
        <p><strong>Agora Multi-Coletivo:</strong> O sistema permite que múltiplos grupos existam independentemente. Ao fazer login, você entra na "Sede Virtual" específica do seu coletivo, garantindo que seus dados, tarefas e finanças sejam visíveis apenas para os seus colaboradores.</p>
      </>
    )
  },
  {
    id: 'mobile',
    title: 'Experiência Móvel (Clio QuickDock)',
    icon: <ZapIcon className="h-6 w-6 text-yellow-400" />,
    keywords: 'celular, smartphone, app, dock, speed dial, ações rápidas, gestos',
    content: (
      <>
        <p>O Clio OS foi redesenhado para ser usado em movimento, com uma mão só.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Clio QuickDock:</strong> A barra inferior agora é persistente. Navegue entre Dashboard, Tarefas e Chat sem precisar voltar para a tela inicial.</li>
          <li><strong>Botão Speed Dial (+):</strong> O botão central pulsante é mágico. Toque nele para abrir o menu de <strong>Ações Rápidas</strong>. Crie uma nova despesa, adicione um artista ou suba um documento instantaneamente, de qualquer lugar do app.</li>
          <li><strong>Gestão de Gadgets:</strong> Na tela inicial móvel, segure o dedo (long press) sobre qualquer Widget para abrir o menu de opções (Trocar ou Remover).</li>
          <li><strong>Navegação por Gestos:</strong> Deslize para os lados para trocar páginas de widgets. Deslize de cima para baixo na gaveta de apps para fechá-la.</li>
        </ul>
      </>
    )
  },
  {
    id: 'tips',
    title: 'Dicas de Ouro para Produtividade',
    icon: <SparklesIcon className="h-6 w-6 text-lime-400" />,
    keywords: 'dicas, atalhos, produtividade, truques, melhor funcionamento',
    content: (
      <>
        <p>Para um funcionamento fluido e sem estresse, siga estas práticas:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Capture na Hora:</strong> Gastou com Uber ou comprou fitas adesivas? Use o <em>Speed Dial</em> no celular e lance a "Nova Despesa" imediatamente. Deixar para lançar tudo no fim do mês gera furos no caixa.</li>
          <li><strong>Status é Comunicação:</strong> Mantenha seu status no "Hub da Equipe" atualizado (ex: "Em trânsito", "Focado na Arte"). Isso aparece nos gadgets dos outros membros e evita cobranças desnecessárias.</li>
          <li><strong>Centralize Arquivos:</strong> Recebeu a logo de um apoiador no WhatsApp? Não deixe lá. Suba imediatamente no "Hub de Mídia" para que o designer do grupo tenha acesso fácil.</li>
          <li><strong>Compartilhe o Código:</strong> Para adicionar novos membros, basta passar o "Código do Coletivo" (visível na criação ou configurações) para que eles entrem na mesma área de trabalho.</li>
        </ul>
      </>
    )
  },
  {
    id: 'tech',
    title: 'Referência Técnica & Banco de Dados',
    icon: <DatabaseIcon className="h-6 w-6 text-emerald-400" />,
    keywords: 'banco de dados, sql, tabelas, esquema, técnico, supabase, collective_id',
    content: (
      <>
        <p>Este sistema opera com um banco de dados SQL em tempo real via Supabase. Abaixo estão as principais estruturas de dados que conectam o coletivo:</p>
        
        <h4 className="text-lg font-bold text-white mt-4">1. Arquitetura de Coletivos (`collective_id`)</h4>
        <ul className="list-disc pl-5 text-sm">
             <li><strong>Isolamento de Dados:</strong> Todas as tabelas (tarefas, artistas, finanças) possuem uma coluna `collective_id`.</li>
             <li>Isso garante que o Coletivo A não veja os dados do Coletivo B, mesmo estando no mesmo banco de dados (Multi-Tenancy).</li>
        </ul>

        <h4 className="text-lg font-bold text-white mt-4">2. Memória Institucional (`audit_logs`)</h4>
        <ul className="list-disc pl-5 text-sm">
             <li>O sistema grava automaticamente ações críticas (Quem criou a tarefa? Quem apagou o documento?).</li>
             <li>Isso garante transparência e resolve disputas internas sobre responsabilidades.</li>
        </ul>

        <div className="mt-4 p-3 bg-slate-800 rounded border border-slate-700 text-xs font-mono text-sky-300">
            Status: Conectado ao Supabase Realtime. As alterações são refletidas instantaneamente para todos os membros do seu coletivo online.
        </div>
      </>
    )
  },
  {
    id: 'global_search',
    title: 'Busca Global (Ctrl + K)',
    icon: <SearchIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'busca, encontrar, atalho, teclado, pesquisa',
    content: (
      <>
        <p>Encontre qualquer coisa no sistema instantaneamente sem tirar as mãos do teclado.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Atalho Rápido:</strong> Pressione <code>Ctrl + K</code> (ou <code>Cmd + K</code> no Mac) em qualquer lugar para abrir a busca.</li>
          <li><strong>Busca Universal:</strong> Localize membros da equipe, tarefas específicas, artistas, itens de inventário ou projetos financeiros dentro do seu coletivo atual.</li>
        </ul>
      </>
    )
  },
  {
    id: 'dashboard',
    title: 'Dashboard (Central de Comando)',
    icon: <HomeIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'dashboard, home, inicio, métricas, resumo, urgências',
    content: (
      <>
        <p>O seu ponto de partida. O Dashboard oferece um raio-X instantâneo da saúde do evento.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Termômetro do Evento:</strong> A contagem regressiva te mantém no tempo certo, enquanto as barras de progresso mostram visualmente o quanto falta para bater as metas.</li>
          <li><strong>Alertas de Urgência:</strong> Tarefas atrasadas aparecem em destaque para que nada importante seja esquecido.</li>
        </ul>
      </>
    )
  },
  {
    id: 'tasks',
    title: 'Gestão de Tarefas (Kanban)',
    icon: <CheckSquareIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'tarefas, kanban, a fazer, produção, checklist, prazos',
    content: (
      <>
        <p>Transforme o "tem que ver isso aí" em ação concreta. O quadro Kanban visualiza o fluxo de trabalho do coletivo.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Fluxo Visual:</strong> Arraste cartões de "A Fazer" para "Em Andamento" e celebre quando chegarem em "Concluído".</li>
          <li><strong>Responsabilidade Clara:</strong> Cada tarefa tem um dono e um prazo (deadline). Isso evita o clássico "achei que fulano ia fazer".</li>
        </ul>
      </>
    )
  },
  {
    id: 'finances',
    title: 'Finanças & Contribuições',
    icon: <WalletIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'dinheiro, caixa, orçamento, gastos, receitas, projetos, csv, mensalidade, contribuição',
    content: (
      <>
        <p>Gestão profissional dos recursos do coletivo.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Projetos & Caixas:</strong> Separe o dinheiro por projeto (ex: "Edital 2024", "Bar do Evento") para não misturar as contas.</li>
          <li><strong>Gestão de Contribuições:</strong> Acompanhe visualmente quem já pagou a mensalidade ou contribuição voluntária do mês na aba "Contribuições".</li>
        </ul>
      </>
    )
  },
  {
    id: 'collab_clio',
    title: 'Collab Clio (Governança)',
    icon: <BriefcaseIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'governança, atas, votação, democracia, documentos, estatuto, auditoria, log',
    content: (
      <>
        <p>Ferramentas para uma gestão horizontal, transparente e democrática.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Votações Digitais:</strong> Tome decisões difíceis de forma justa. Crie enquetes e acompanhe o voto da maioria.</li>
          <li><strong>Atas de Reunião:</strong> Registre pautas e decisões para que o que foi acordado não se perca.</li>
        </ul>
      </>
    )
  },
  {
    id: 'support',
    title: 'Suporte & Ajuda',
    icon: <LifeBuoyIcon className="h-6 w-6 text-red-400" />,
    keywords: 'ajuda, suporte, erro, bug, contato',
    content: (
      <>
        <p>Encontrou um bug ou precisa de ajuda?</p>
        <ul className="list-disc pl-5 space-y-2">
            <li><strong>Erros de Carregamento:</strong> Se o app não carregar, tente atualizar a página (F5). Limpar o cache do navegador também pode ajudar.</li>
            <li><strong>Dados não Salvando:</strong> Verifique sua conexão com a internet. O ícone de "Nuvem" no topo da tela deve estar verde.</li>
        </ul>
      </>
    )
  }
];

const Documentation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) {
      return sections;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return sections.filter(section =>
      section.title.toLowerCase().includes(lowercasedFilter) ||
      section.keywords.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm]);

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Documentação do Clio OS</h1>
        <p className="text-slate-400 max-w-3xl mx-auto">
          Guia de referência completo para organização, governança e produção cultural colaborativa.
        </p>
      </header>

       <div className="relative mb-12 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Buscar na documentação..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-700 text-white p-3 pl-10 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder:text-slate-400"
          aria-label="Buscar na documentação"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-slate-400" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {filteredSections.length > 0 ? (
          filteredSections.map(section => (
            <DocSection key={section.id} title={section.title} icon={section.icon}>
              {section.content}
            </DocSection>
          ))
        ) : (
          <div className="text-center py-16 bg-slate-900 rounded-lg border-t border-slate-700">
            <p className="text-slate-400 text-lg">Nenhum tópico encontrado para "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documentation;
