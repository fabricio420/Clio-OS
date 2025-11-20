
import React, { useState, useMemo } from 'react';
import { HomeIcon, CheckSquareIcon, ClockIcon, MicIcon, UsersIcon, ImageIcon, SearchIcon, BoxIcon, FileTextIcon, WalletIcon, BriefcaseIcon, BrushIcon, BookMarkedIcon, GlobeIcon, UserIcon, MenuIcon, SparklesIcon, LifeBuoyIcon, DatabaseIcon } from './icons';

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
             <li>O acesso é controlado via código de convite na entrada.</li>
        </ul>

        <h4 className="text-lg font-bold text-white mt-4">2. Núcleo de Pessoas (`profiles`)</h4>
        <ul className="list-disc pl-5 text-sm">
             <li>Armazena todos os membros da plataforma.</li>
             <li>Sincronizado com o sistema de login (Auth).</li>
             <li>Dados: Nome, Função, Avatar e E-mail.</li>
        </ul>

        <h4 className="text-lg font-bold text-white mt-4">3. Produção (`tasks`, `schedule`, `artists`)</h4>
        <ul className="list-disc pl-5 text-sm">
             <li><strong>Tarefas:</strong> Gerenciadas via Kanban. Possuem status (A Fazer, Em Andamento, Concluído) e responsáveis.</li>
             <li><strong>Cronograma:</strong> Define a linha do tempo do evento (hora, atividade, responsável).</li>
             <li><strong>Artistas:</strong> Banco de dados de casting com contatos, documentos e links sociais.</li>
        </ul>

        <h4 className="text-lg font-bold text-white mt-4">4. Financeiro (`financial_projects`, `transactions`)</h4>
        <ul className="list-disc pl-5 text-sm">
             <li>O sistema separa finanças por "Projetos" (ex: Sarau Edição 1, Edital X).</li>
             <li>Transações são vinculadas a um projeto e a um coletivo.</li>
        </ul>
        
        <div className="mt-4 p-3 bg-slate-800 rounded border border-slate-700 text-xs font-mono text-sky-300">
            Status: Conectado ao Supabase Realtime. As alterações são refletidas instantaneamente para todos os membros do seu coletivo online.
        </div>
      </>
    )
  },
  {
    id: 'tips',
    title: 'Dicas de Produtividade',
    icon: <SparklesIcon className="h-6 w-6 text-yellow-400" />,
    keywords: 'dicas, atalhos, produtividade, truques',
    content: (
      <>
        <p>Maximize seu uso do Clio OS com estas dicas rápidas:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Compartilhe o Código:</strong> Para adicionar novos membros, basta passar o "Código do Coletivo" (visível na criação ou configurações) para que eles entrem na mesma área de trabalho.</li>
          <li><strong>Foco no Dashboard:</strong> Comece o dia olhando as "Tarefas Pendentes" no Dashboard para saber exatamente o que priorizar.</li>
          <li><strong>Status da Equipe:</strong> Mantenha seu status atualizado no "Hub da Equipe". Isso evita interrupções desnecessárias quando você estiver focado.</li>
          <li><strong>Centralize Arquivos:</strong> Sempre que receber a logo de um apoiador ou foto de um artista, suba imediatamente no "Hub de Mídia" para não perder no histórico de chat.</li>
        </ul>
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
          <li><strong>Navegação:</strong> Use as setas do teclado para navegar e <code>Enter</code> para abrir o item diretamente.</li>
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
          <li><strong>Termômetro do Evento:</strong> A contagem regressiva te mantém no tempo certo, enquanto as barras de progresso mostram visualmente o quanto falta para bater as metas de tarefas, orçamento e curadoria artística.</li>
          <li><strong>Alertas de Urgência:</strong> Tarefas atrasadas e os próximos compromissos do cronograma aparecem em destaque para que nada importante seja esquecido no calor do momento.</li>
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
          <li><strong>Agilidade:</strong> Edite ou exclua tarefas rapidamente direto no cartão.</li>
        </ul>
      </>
    )
  },
  {
    id: 'schedule',
    title: 'Cronograma & Roteiro',
    icon: <ClockIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'horário, lineup, roteiro, dia do evento, tempo, atrações',
    content: (
      <>
        <p>A partitura do seu evento. O Cronograma define o que acontece, quando e quem está no comando daquela ação.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Minuto a Minuto:</strong> Essencial para o dia do sarau. Organize a passagem de som, abertura dos portões, ordem das apresentações e encerramento.</li>
          <li><strong>Line-up Organizado:</strong> Garanta que os artistas saibam exatamente a hora de entrar em cena.</li>
        </ul>
      </>
    )
  },
  {
    id: 'artists',
    title: 'Banco de Artistas (Casting)',
    icon: <MicIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'artistas, poetas, músicos, cadastro, casting, contatos',
    content: (
      <>
        <p>Seu CRM cultural. Mantenha um banco de dados vivo de todos os poetas, músicos e performers que constroem o sarau com você.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Ficha Técnica Completa:</strong> Guarde infos vitais como nome artístico, minibio, contatos e especificidades técnicas.</li>
          <li><strong>Documentação:</strong> Armazene fotos de documentos (RG/CPF) para facilitar pagamentos e contratos.</li>
          <li><strong>Conexão Direta:</strong> Atalhos inteligentes para chamar no WhatsApp ou ver o Instagram do artista com um clique.</li>
        </ul>
      </>
    )
  },
  {
    id: 'team_hub',
    title: 'Hub da Equipe & Comunicação',
    icon: <UsersIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'equipe, chat, mural, status, membros, comunicação interna',
    content: (
      <>
        <p>A sala de estar virtual do coletivo. Mantenha a sintonia fina, mesmo à distância.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Status em Tempo Real:</strong> Atualize se está "Produzindo arte", "Em reunião" ou "Focando na planilha". O status aparece nos gadgets de todos.</li>
          <li><strong>Mural de Recados:</strong> Um feed estilo rede social para avisos gerais, enquetes rápidas ou para celebrar pequenas vitórias do dia a dia.</li>
          <li><strong>Quem é Quem:</strong> Diretório visual com foto e função de cada membro, fortalecendo o senso de pertencimento.</li>
        </ul>
      </>
    )
  },
  {
    id: 'collab_clio',
    title: 'Collab Clio (Governança & Memória)',
    icon: <BriefcaseIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'governança, atas, votação, democracia, documentos, estatuto, auditoria, log',
    content: (
      <>
        <p>Ferramentas para uma gestão horizontal, transparente e democrática.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Votações Digitais:</strong> Tome decisões difíceis de forma justa. Crie enquetes, acompanhe o voto da maioria e encerre votações para registrar o resultado final.</li>
          <li><strong>Memória Institucional (Auditoria):</strong> A aba "Memória" registra automaticamente quem fez o quê no sistema (criou tarefa, apagou documento, etc.), garantindo transparência total.</li>
          <li><strong>Atas de Reunião:</strong> Registre pautas e decisões. O sistema vincula os participantes presentes para facilitar a conferência de quórum.</li>
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
          <li><strong>Relatórios:</strong> Gere PDFs automáticos de prestação de contas ou exporte tabelas CSV para planilhas externas.</li>
        </ul>
      </>
    )
  },
  {
    id: 'media',
    title: 'Hub de Mídia & Divulgação',
    icon: <ImageIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'flyer, card, instagram, design, arquivos, marketing',
    content: (
      <>
        <p>O drive criativo do evento. Chega de pedir a logo no grupo de WhatsApp toda hora.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Centralização de Assets:</strong> Armazene logos, templates, flyers e vídeos de divulgação em alta qualidade.</li>
          <li><strong>Mídia dos Artistas:</strong> Vincule materiais de divulgação (fotos de divulgação) diretamente ao perfil do artista.</li>
        </ul>
      </>
    )
  },
  {
    id: 'inventory',
    title: 'Inventário & Logística',
    icon: <BoxIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'equipamentos, cabos, som, materiais, logística',
    content: (
      <>
        <p>Controle total sobre o material físico. Não chegue no evento faltando um cabo XLR.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Checklist de Equipamentos:</strong> Liste som, iluminação, decoração e itens de bar.</li>
          <li><strong>Rastreabilidade:</strong> Defina o status (Pendente, Confirmado, No Local) e quem ficou responsável por conseguir ou levar cada item.</li>
        </ul>
      </>
    )
  },
  {
    id: 'notebooks',
    title: 'Cadernos Criativos',
    icon: <BookMarkedIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'notas, escrita, poesia, rascunho, ideias, texto',
    content: (
      <>
        <p>Um espaço seguro para a sua criatividade fluir dentro da plataforma.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Organização Temática:</strong> Crie cadernos separados para "Poesias", "Roteiros de Apresentação", "Ideias de Projetos" e "Rascunhos de Editais".</li>
          <li><strong>Editor Rico:</strong> Ferramentas de formatação de texto para deixar suas notas organizadas e bonitas.</li>
        </ul>
      </>
    )
  },
  {
    id: 'gallery',
    title: 'Galeria de Memórias',
    icon: <ImageIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'fotos, álbuns, registro, memória, fotografia',
    content: (
      <>
        <p>A memória visual da sua trajetória.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Álbuns de Eventos:</strong> Crie álbuns para cada edição do sarau.</li>
          <li><strong>Visualização Imersiva:</strong> Lightbox em tela cheia para reviver os melhores momentos.</li>
          <li><strong>Upload em Lote:</strong> Suba dezenas de fotos de uma vez para manter o arquivo atualizado.</li>
        </ul>
      </>
    )
  },
  {
    id: 'reports',
    title: 'Relatórios Automáticos',
    icon: <FileTextIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'pdf, impressão, relatório final, dossiê, resumo',
    content: (
      <>
        <p>Transforme dados em documentos profissionais em segundos.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Dossiê do Evento:</strong> O sistema compila automaticamente as estatísticas, lista de artistas, cronograma, equipe e balanço financeiro em um layout pronto para impressão ou PDF.</li>
          <li><strong>Transparência:</strong> Ótimo para apresentar resultados para a equipe ou patrocinadores pós-evento.</li>
        </ul>
      </>
    )
  },
  {
    id: 'personalize',
    title: 'Personalização & Sistema',
    icon: <BrushIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'customização, wallpaper, widgets, área de trabalho, armazenamento, disco',
    content: (
      <>
        <p>Gerencie a aparência e a saúde técnica do seu Clio OS.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Identidade Visual:</strong> Troque o papel de parede por fotos do seu evento ou artes personalizadas.</li>
          <li><strong>Gadgets Produtivos:</strong> Adicione widgets flutuantes na área de trabalho: Relógio, Contagem Regressiva, Post-its e Resumos.</li>
          <li><strong>Monitoramento de Armazenamento:</strong> Na aba "Sistema" do app Personalizar, verifique quanto espaço o coletivo está usando na nuvem para não estourar a cota.</li>
        </ul>
      </>
    )
  },
  {
    id: 'browser',
    title: 'Navegador Interno',
    icon: <GlobeIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'internet, web, navegador',
    content: (
      <>
        <p>Acesse sistemas web externos sem sair do seu fluxo de trabalho no Clio OS.</p>
      </>
    )
  },
  {
    id: 'profile',
    title: 'Perfil & Segurança',
    icon: <UserIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'conta, senha, avatar, dados',
    content: (
      <>
        <p>Cuide da sua identidade no sistema.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Perfil Profissional:</strong> Mantenha sua foto e cargo atualizados para facilitar a identificação pela equipe.</li>
          <li><strong>Segurança:</strong> Troque sua senha periodicamente para manter os dados do coletivo seguros.</li>
        </ul>
      </>
    )
  },
  {
    id: 'mobile',
    title: 'Clio Mobile & Gestos',
    icon: <MenuIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'celular, smartphone, app, touch, swipe, gestos',
    content: (
      <>
        <p>O Clio OS foi desenhado para ser usado com uma mão só no celular, através de gestos intuitivos.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Navegação Lateral:</strong> Deslize para a direita ou esquerda na tela inicial para alternar entre páginas de gadgets.</li>
          <li><strong>Centro de Controle:</strong> Deslize de baixo para cima (swipe up) no meio da tela para ver o calendário rápido e notificações.</li>
          <li><strong>Gaveta de Apps:</strong> O botão central do menu abre todos os apps. Deslize de cima para baixo na gaveta para fechá-la rapidamente.</li>
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
            <li><strong>Fale Conosco:</strong> Entre em contato com o administrador do sistema ou reporte issues no repositório do projeto.</li>
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
