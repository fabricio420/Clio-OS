
import React, { useState, useMemo } from 'react';
import { HomeIcon, InfoIcon, CheckSquareIcon, ClockIcon, MicIcon, UsersIcon, ImageIcon, SearchIcon, BoxIcon, FileTextIcon, WalletIcon, BriefcaseIcon, BrushIcon, BookMarkedIcon, GlobeIcon, UserIcon, RadioIcon, MusicIcon, WhatsappIcon, MenuIcon } from './icons';

const DocSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="bg-slate-900 p-6 rounded-lg shadow-md mb-8 border-t border-lime-400">
    <div className="flex items-center mb-4">
      <div className="p-2 bg-slate-800 rounded-full mr-4">
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
    keywords: 'equipe membros perfis comunicação mural feed status',
    content: (
      <>
        <p>O Hub da Equipe é o espaço central para a comunicação e gerenciamento dos membros do coletivo. Ele fortalece a colaboração e mantém todos na mesma página.</p>
        <ul>
          <li><strong>Atualização de Status:</strong> Permite que cada membro compartilhe no que está trabalhando no momento (ex: "Focando na arte do flyer"), mantendo a equipe ciente das atividades em tempo real.</li>
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
  },
  {
    id: 'finances',
    title: 'Finanças',
    icon: <WalletIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'financeiro, orçamento, despesas, receitas, caixa, projetos, transações, dinheiro, csv',
    content: (
      <>
        <p>O aplicativo de Finanças é uma ferramenta poderosa para gerenciar todos os aspectos monetários do seu evento. Ele permite um controle detalhado sobre o fluxo de caixa, garantindo transparência e organização.</p>
        <ul>
          <li><strong>Projetos Financeiros:</strong> Crie diferentes "caixas" ou projetos para separar orçamentos (ex: "Caixa Geral do Evento", "Verba de Alimentação"). Isso ajuda a rastrear de onde o dinheiro vem e para onde vai com mais clareza.</li>
          <li><strong>Registro de Transações:</strong> Dentro de cada projeto, você pode adicionar receitas (entradas) e despesas (saídas), especificando descrição, valor, data e categoria.</li>
          <li><strong>Balanço Automático:</strong> O sistema calcula automaticamente o total de receitas, despesas e o saldo final para cada projeto, oferecendo uma visão clara da saúde financeira a qualquer momento.</li>
          <li><strong>Exportação CSV:</strong> Exporte o histórico de transações de um projeto para um arquivo CSV, facilitando a análise em planilhas externas como Excel ou Google Sheets.</li>
        </ul>
      </>
    )
  },
  {
    id: 'gallery',
    title: 'Galeria de Fotos',
    icon: <ImageIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'fotos, galeria, álbum, imagens, recordações, upload, lightbox',
    content: (
      <>
        <p>A Galeria de Fotos é o seu espaço para criar um acervo visual e afetivo dos seus eventos. Organize e compartilhe as memórias do coletivo de forma elegante.</p>
        <ul>
          <li><strong>Criação de Álbuns:</strong> Organize suas fotos em álbuns temáticos (ex: "Sarau das Vozes Urbanas - Edição I", "Bastidores").</li>
          <li><strong>Upload em Lote:</strong> Envie múltiplas fotos de uma só vez para um álbum, agilizando o processo de catalogação.</li>
          <li><strong>Visualização Lightbox:</strong> Ao clicar em uma foto, ela é exibida em tela cheia (lightbox), permitindo navegar por todas as imagens do álbum com as setas do teclado ou clicando na tela.</li>
          <li><strong>Gerenciamento Simples:</strong> Exclua fotos individuais de um álbum facilmente.</li>
        </ul>
      </>
    )
  },
  {
    id: 'collab_clio',
    title: 'Collab Clio (Governança)',
    icon: <BriefcaseIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'governança, documentos, atas, votação, decisões, coletivo, colaboração',
    content: (
      <>
        <p>O Collab Clio é o centro de governança do seu coletivo. É aqui que a organização interna, as decisões formais e o acervo intelectual são gerenciados, garantindo transparência e registro histórico.</p>
        <ul>
          <li><strong>Documentos:</strong> Uma área para armazenar arquivos importantes do coletivo, como estatutos, editais, propostas de projetos e outros documentos oficiais. Faça upload e baixe quando precisar.</li>
          <li><strong>Atas de Reunião:</strong> Crie registros formais de suas reuniões. Adicione a data, os participantes presentes, as pautas discutidas e as decisões tomadas. Mantenha um histórico claro do que foi decidido.</li>
          <li><strong>Votações:</strong> Tome decisões democráticas. Crie tópicos de votação com múltiplas opções. Os membros podem votar, e os resultados são exibidos em tempo real. O criador da votação pode encerrá-la quando o prazo acabar.</li>
        </ul>
      </>
    )
  },
  {
    id: 'notebooks',
    title: 'Cadernos de Anotações',
    icon: <BookMarkedIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'notas, caderno, bloco de notas, editor de texto, escrever, ABNT, ideias',
    content: (
      <>
        <p>O aplicativo de Cadernos é o seu espaço pessoal e colaborativo para anotações, brainstorms, escrita de poesias e o que mais a sua criatividade permitir. Mantenha tudo organizado em um só lugar.</p>
        <ul>
          <li><strong>Múltiplos Cadernos:</strong> Crie diferentes cadernos para organizar suas notas por tema (ex: "Ideias para o Sarau", "Poesias", "Contatos").</li>
          <li><strong>Editor de Texto:</strong> Cada nota possui um editor de texto simples que permite formatação básica, como negrito, itálico, sublinhado e justificação de texto, seguindo um estilo visual limpo.</li>
          <li><strong>Salvamento Automático:</strong> Suas alterações nas notas são salvas automaticamente enquanto você digita, para que você nunca perca uma ideia.</li>
        </ul>
      </>
    )
  },
  {
    id: 'clio_player',
    title: 'Player de Música Clio',
    icon: <MusicIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'player, música, playlist, som, curadoria, mp3, trilha sonora, tocar, pausar',
    content: (
      <>
        <p>O Player Clio é a trilha sonora oficial do coletivo, uma ferramenta para inspirar a criatividade e embalar os encontros. Diferente de uma rádio passiva, aqui você tem o controle.</p>
        <ul>
            <li><strong>Playlist do Coletivo:</strong> O player vem com uma seleção de músicas curadas para o evento, prontas para tocar.</li>
            <li><strong>Controle Total:</strong> Você pode tocar, pausar, avançar e retroceder as faixas. Use a barra de progresso para pular para sua parte favorita da música.</li>
            <li><strong>Seleção Interativa:</strong> Clique em qualquer música na lista de reprodução para começar a ouvi-la imediatamente.</li>
        </ul>
      </>
    )
  },
  {
    id: 'browser',
    title: 'Navegador Web',
    icon: <GlobeIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'browser, internet, web, site, url, pesquisa',
    content: (
      <>
        <p>Um navegador web simples integrado ao Clio OS para pesquisas rápidas e acesso a sites sem precisar sair do ambiente de trabalho do coletivo.</p>
        <ul>
          <li><strong>Navegação Básica:</strong> Digite uma URL na barra de endereço para carregar uma página da web.</li>
          <li><strong>Aviso de Compatibilidade:</strong> Por razões de segurança, alguns sites complexos (como redes sociais, serviços do Google, etc.) podem bloquear o carregamento dentro de aplicativos de terceiros. Use-o para pesquisas e acesso a sites mais simples.</li>
        </ul>
      </>
    )
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    icon: <WhatsappIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'whatsapp, mensagem, chat, conversa, comunicação',
    content: (
      <>
        <p>Acesse o WhatsApp Web diretamente de dentro do Clio OS para manter a comunicação com artistas e fornecedores sem trocar de aba.</p>
        <ul>
          <li><strong>Acesso Rápido:</strong> Uma janela dedicada para suas conversas do WhatsApp.</li>
          <li><strong>Privacidade:</strong> O login é mantido localmente no seu navegador, garantindo que suas mensagens permaneçam privadas.</li>
          <li><strong>Nota de Compatibilidade:</strong> Devido a políticas de segurança modernas dos navegadores, alguns recursos podem ser limitados ou requerer re-autenticação dependendo das configurações.</li>
        </ul>
      </>
    )
  },
  {
    id: 'profile',
    title: 'Meu Perfil',
    icon: <UserIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'perfil, usuário, conta, senha, avatar, foto, pessoal',
    content: (
      <>
        <p>Gerencie suas informações pessoais e de segurança dentro do Clio OS. Mantenha seus dados sempre atualizados.</p>
        <ul>
          <li><strong>Informações Pessoais:</strong> Atualize seu nome e sua função/cargo dentro do coletivo. Essas informações aparecerão em outras partes do sistema, como na atribuição de tarefas.</li>
          <li><strong>Foto de Perfil:</strong> Altere sua foto de perfil (avatar) enviando uma nova imagem do seu computador.</li>
          <li><strong>Alteração de Senha:</strong> Por segurança, você pode alterar sua senha de acesso ao sistema a qualquer momento.</li>
        </ul>
      </>
    )
  },
  {
    id: 'personalize',
    title: 'Personalizar',
    icon: <BrushIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'papel de parede, wallpaper, fundo, tela de login, gadgets, relógio, widgets, customizar, aparência',
    content: (
      <>
        <p>Deixe o Clio OS com a sua cara. A personalização permite que você altere a aparência da sua área de trabalho e adicione ferramentas para agilizar seu dia a dia.</p>
        <ul>
          <li><strong>Papel de Parede:</strong> Escolha uma imagem da galeria padrão ou envie seu próprio papel de parede para a área de trabalho e também para a tela de login.</li>
          <li><strong>Gadgets:</strong> Adicione "widgets" flutuantes à sua área de trabalho: Relógio Analógico, Contagem Regressiva, Notas Rápidas, Resumo Financeiro, Status da Equipe e o Mini Player da Rádio Clio. Você pode arrastá-los e posicioná-los onde quiser.</li>
        </ul>
      </>
    )
  },
  {
    id: 'mobile',
    title: 'Versão Mobile',
    icon: <MenuIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'celular, mobile, responsivo, touch, smartphone, android, iphone',
    content: (
      <>
        <p>O Clio OS foi desenhado para acompanhar você em qualquer lugar. A versão mobile oferece uma interface adaptada para telas pequenas, perfeita para o dia do evento.</p>
        <ul>
          <li><strong>Navegação por Gestos:</strong> Deslize para cima na parte inferior da tela para abrir a gaveta de aplicativos e deslize para baixo para acessar o Centro de Controle.</li>
          <li><strong>Dock Inferior:</strong> Acesso rápido e fácil aos apps mais importantes: Dashboard, Tarefas, Hub da Equipe e Finanças.</li>
          <li><strong>Widgets na Tela Inicial:</strong> Visualize a contagem regressiva para o evento e o status atual da equipe logo ao abrir o aplicativo no celular.</li>
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
          <div className="text-center py-16 bg-slate-900 rounded-lg border-t border-slate-700">
            <p className="text-slate-400 text-lg">Nenhum tópico encontrado para "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documentation;
