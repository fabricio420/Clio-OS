import React, { useState, useMemo } from 'react';
import { HomeIcon, InfoIcon, CheckSquareIcon, ClockIcon, MicIcon, UsersIcon, ImageIcon, SearchIcon, BoxIcon, FileTextIcon } from './icons';

const DocSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="bg-slate-800 p-6 rounded-lg shadow-md mb-8">
    <div className="flex items-center mb-4">
      <div className="p-2 bg-slate-700 rounded-full mr-4">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-lime-400">{title}</h2>
    </div>
    <div className="prose prose-slate prose-invert max-w-none text-slate-300 space-y-3">
      {children}
    </div>
  </section>
);

const sections = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <HomeIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'central comando contagem regressiva métricas progresso atalhos',
    content: (
      <>
        <p>O Dashboard é a sua central de comando, oferecendo uma visão geral e em tempo real do status do seu evento.</p>
        <ul>
          <li><strong>Contagem Regressiva:</strong> Mostra exatamente quanto tempo falta para o grande dia, mantendo a equipe focada no prazo.</li>
          <li><strong>Métricas Principais:</strong> Caixas de estatísticas com números-chave, como artistas confirmados, tarefas pendentes, orçamento restante e o tamanho da equipe.</li>
          <li><strong>Gráficos de Progresso:</strong> Visualizações rápidas do avanço em áreas críticas: tarefas concluídas, orçamento gasto e a meta de artistas alcançada.</li>
          <li><strong>Atalhos Rápidos:</strong> Listas de tarefas pendentes e os próximos itens do cronograma para que você saiba no que focar.</li>
        </ul>
      </>
    )
  },
  {
    id: 'info',
    title: 'Informações do Evento',
    icon: <InfoIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'editar dados fundamentais local data metas colaborações',
    content: (
      <>
        <p>Esta seção centraliza todos os dados fundamentais do seu evento. Manter essas informações atualizadas é crucial, pois elas podem ser referenciadas em outras partes do sistema.</p>
        <ul>
          <li><strong>Edição Centralizada:</strong> Clique em "Editar Informações" para abrir um formulário onde você pode definir ou atualizar o nome do evento, descrição, local, data, e mais.</li>
          <li><strong>Detalhes Específicos:</strong> Defina metas como o número de artistas, os tipos de arte esperados e se haverá premiações. Essas informações ajudam a guiar o planejamento.</li>
          <li><strong>Colaborações:</strong> Se o seu evento é uma parceria, você pode destacar o coletivo colaborador aqui.</li>
        </ul>
      </>
    )
  },
  {
    id: 'tasks',
    title: 'Quadro de Tarefas (Kanban)',
    icon: <CheckSquareIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'kanban a fazer em andamento concluído arrastar soltar atribuir',
    content: (
      <>
        <p>Gerencie todas as atividades da equipe de forma visual e intuitiva com o quadro Kanban. Ele ajuda a organizar o fluxo de trabalho e a identificar gargalos.</p>
        <ul>
          <li><strong>Colunas de Status:</strong> As tarefas são organizadas em "A Fazer", "Em Andamento" e "Concluído".</li>
          <li><strong>Arrastar e Soltar:</strong> Mova facilmente um cartão de tarefa de uma coluna para outra para atualizar seu status.</li>
          <li><strong>Criação e Detalhamento:</strong> Crie novas tarefas definindo título, descrição, prazo e atribuindo a um membro da equipe.</li>
          <li><strong>Gerenciamento:</strong> Cada tarefa pode ser editada ou excluída através do menu de opções (ícone de três pontos).</li>
        </ul>
      </>
    )
  },
  {
    id: 'schedule',
    title: 'Cronograma',
    icon: <ClockIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'linha do tempo horário roteiro atividades responsável',
    content: (
      <>
        <p>O Cronograma é uma linha do tempo detalhada de tudo o que acontecerá durante o evento, desde a abertura dos portões até o encerramento.</p>
        <ul>
          <li><strong>Visualização Temporal:</strong> Os itens são organizados por horário, criando um roteiro claro para o dia do evento.</li>
          <li><strong>Adicionar Atividades:</strong> Adicione novas entradas especificando a hora, o título da atividade (ex: "Show da Banda X"), uma breve descrição e o membro da equipe responsável por garantir que ela aconteça.</li>
        </ul>
      </>
    )
  },
  {
    id: 'artists',
    title: 'Artistas',
    icon: <MicIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'banco de dados participantes contato whatsapp instagram mídia',
    content: (
      <>
        <p>Um banco de dados completo de todos os artistas e participantes do seu evento. Centralizar essas informações facilita o contato e a divulgação.</p>
        <ul>
          <li><strong>Cadastro Detalhado:</strong> Para cada artista, você pode registrar o nome, tipo de performance, contato principal (e-mail), notas importantes, WhatsApp e Instagram.</li>
          <li><strong>Links Rápidos:</strong> Os ícones de WhatsApp e Instagram são clicáveis, levando você diretamente para o perfil ou conversa com o artista.</li>
          <li><strong>Integração:</strong> As informações cadastradas aqui são usadas automaticamente no Hub de Mídia quando você associa um flyer a um artista.</li>
        </ul>
      </>
    )
  },
    {
    id: 'team_hub',
    title: 'Hub da Equipe',
    icon: <UsersIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'equipe membros perfis comunicação mural feed',
    content: (
      <>
        <p>O Hub da Equipe é o espaço central para a comunicação e gerenciamento dos membros do coletivo. Ele fortalece a colaboração e mantém todos na mesma página.</p>
        <ul>
          <li><strong>Perfis da Equipe:</strong> Visualize todos os membros da equipe de organização com suas fotos, nomes e funções. Clicar em um perfil permite editar essas informações.</li>
          <li><strong>Mural de Comunicação:</strong> Um feed de atualizações onde qualquer membro pode postar mensagens para toda a equipe, como um mini-mural de recados interno para compartilhar novidades, fazer perguntas ou celebrar conquistas.</li>
        </ul>
      </>
    )
  },
  {
    id: 'media',
    title: 'Hub de Mídia',
    icon: <ImageIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'mídia arquivos arte divulgação banner flyer imagens upload',
    content: (
      <>
        <p>Centralize todo o material de arte e divulgação do evento. Garanta que toda a equipe use sempre os arquivos corretos e atualizados.</p>
        <ul>
          <li><strong>Categorias:</strong> A mídia é organizada em "Divulgação Geral" (para banners e cartazes principais) e "Mídia dos Artistas" (para flyers individuais).</li>
          <li><strong>Upload Inteligente:</strong> Ao subir uma mídia de artista, você pode associá-la a um artista já cadastrado. O sistema então puxa automaticamente o nome, tipo de performance e contatos (WhatsApp, Instagram) do artista para o card da mídia.</li>
          <li><strong>Gerenciamento de Arquivos:</strong> Cada item de mídia pode ser baixado ou excluído facilmente.</li>
        </ul>
      </>
    )
  },
  {
    id: 'inventory',
    title: 'Inventário de Materiais',
    icon: <BoxIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'inventário materiais equipamentos estoque lista verificação',
    content: (
      <>
        <p>O Inventário é a sua ferramenta para gerenciar todos os materiais e equipamentos físicos necessários para o evento. Evite surpresas de última hora garantindo que tudo esteja contabilizado e no lugar certo.</p>
        <ul>
          <li><strong>Lista Centralizada:</strong> Cadastre tudo o que for preciso, desde equipamentos de som e luz até materiais de decoração e cabos.</li>
          <li><strong>Controle de Quantidade e Status:</strong> Para cada item, defina a quantidade necessária, o status atual ("Pendente", "Confirmado" ou "No Local") e atribua um responsável. Isso ajuda a saber quem contatar sobre cada material.</li>
          <li><strong>Organização Visual:</strong> A visualização em cartões permite uma rápida identificação do que ainda precisa de atenção. O status de cada item é destacado por uma cor para fácil visualização.</li>
        </ul>
      </>
    )
  },
  {
    id: 'reports',
    title: 'Relatórios',
    icon: <FileTextIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'relatório pdf imprimir resumo documento exportar consolidado',
    content: (
      <>
        <p>A seção de Relatórios consolida todas as informações do seu evento em um único documento profissional, pronto para ser compartilhado, impresso ou arquivado.</p>
        <ul>
          <li><strong>Visão Consolidada:</strong> Gera um resumo completo contendo: resumo do evento, status financeiro, progresso das tarefas, lista de artistas confirmados, cronograma completo e a equipe de organização.</li>
          <li><strong>Imprimir:</strong> O botão "Imprimir" formata o relatório para uma versão limpa, otimizada para impressão em papel, removendo todos os elementos de interface do aplicativo.</li>
          <li><strong>Baixar PDF:</strong> Clicando em "Baixar PDF", o sistema gera um arquivo PDF de alta qualidade do relatório completo, ideal para enviar por e-mail ou para guardar como um registro digital do planejamento do evento.</li>
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
        <h1 className="text-4xl font-bold text-white mb-2">Documentação do Collab Clio</h1>
        <p className="text-slate-400 max-w-3xl mx-auto">
          Bem-vindo ao guia completo do Collab Clio. Aqui você encontrará uma explicação detalhada sobre cada funcionalidade da plataforma, projetada para tornar a organização do seu evento cultural uma experiência fluida e colaborativa.
        </p>
      </header>

       <div className="relative mb-12 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Buscar na documentação..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-700 text-white p-3 pl-10 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
          <div className="text-center py-16 bg-slate-800 rounded-lg">
            <p className="text-slate-400 text-lg">Nenhum tópico encontrado para "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documentation;