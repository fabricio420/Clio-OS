
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
    keywords: 'introdução, boas vindas, visão geral',
    content: (
      <>
        <p>O <strong>Clio OS</strong> é o sistema operacional dedicado a coletivos culturais. Inspirado na eficiência de ferramentas corporativas, mas com a alma da arte, ele centraliza a produção, a comunicação e a governança do seu evento em um único lugar.</p>
        <p>Navegue pelos tópicos abaixo para dominar todas as ferramentas disponíveis.</p>
      </>
    )
  },
  {
    id: 'dashboard',
    title: 'Dashboard (Painel de Controle)',
    icon: <HomeIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'central comando contagem regressiva métricas progresso atalhos',
    content: (
      <>
        <p>O Dashboard é a sua visão panorâmica. Assim que você entra no sistema, ele te informa o que é mais urgente.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Contagem Regressiva:</strong> O coração pulsante do evento. Saiba exatamente quantos dias, horas e minutos faltam.</li>
          <li><strong>Métricas em Tempo Real:</strong> Visualize rapidamente quantos artistas estão confirmados, o saldo do orçamento e o progresso das tarefas.</li>
          <li><strong>Acesso Rápido:</strong> Atalhos para tarefas pendentes e os próximos itens do cronograma, garantindo que nada seja esquecido.</li>
        </ul>
      </>
    )
  },
  {
    id: 'tasks',
    title: 'Gestão de Tarefas (Kanban)',
    icon: <CheckSquareIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'kanban a fazer em andamento concluído arrastar soltar atribuir',
    content: (
      <>
        <p>Organize o caos criativo. O quadro Kanban permite visualizar o fluxo de trabalho da equipe.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Arrastar e Soltar:</strong> Mova tarefas entre "A Fazer", "Em Andamento" e "Concluído" intuitivamente.</li>
          <li><strong>Delegação:</strong> Ao criar uma tarefa, atribua um responsável da equipe e defina um prazo fatal.</li>
          <li><strong>Edição Rápida:</strong> Use o menu de opções no cartão da tarefa para editar detalhes ou excluí-la.</li>
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
        <p>Mantenha a sintonia fina entre os organizadores.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Status Ao Vivo:</strong> Atualize seu status ("Focando no design", "Em reunião externa") para que todos saibam sua disponibilidade. Isso reflete no gadget da área de trabalho.</li>
          <li><strong>Mural de Recados:</strong> Um feed exclusivo para a equipe postar avisos rápidos, atualizações ou celebrações.</li>
          <li><strong>Diretório de Membros:</strong> Acesse e edite os perfis de todos os membros, incluindo fotos e funções.</li>
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
        <p>O pilar de transparência e organização institucional do coletivo.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Documentos Coletivos:</strong> Repositório para arquivos essenciais como estatutos, editais, planilhas e contratos.</li>
          <li><strong>Atas de Reunião:</strong> Registre formalmente o que foi discutido. Marque a data, quem estava presente, as pautas e, principalmente, as decisões tomadas.</li>
          <li><strong>Sistema de Votação:</strong> Precisa decidir algo democraticamente? Crie uma votação, adicione opções e deixe os membros votarem. O sistema calcula os percentuais e permite encerrar a votação quando necessário.</li>
        </ul>
      </>
    )
  },
  {
    id: 'finances',
    title: 'Finanças & Orçamento',
    icon: <WalletIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'financeiro, orçamento, despesas, receitas, caixa, projetos, transações, dinheiro, csv',
    content: (
      <>
        <p>Controle rigoroso de cada centavo, organizado por projetos.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Projetos Financeiros (Caixas):</strong> Crie caixas separados para diferentes fins (ex: "Edital 2024", "Venda de Bar", "Caixinha do Coletivo").</li>
          <li><strong>Transações Detalhadas:</strong> Lance Receitas e Despesas com data, categoria e descrição.</li>
          <li><strong>Dashboard Financeiro:</strong> Visualize gráficos de despesas por categoria e o balanço geral.</li>
          <li><strong>Filtros e Exportação:</strong> Filtre por mês ou semana e exporte o extrato de qualquer projeto para CSV (Excel/Planilhas).</li>
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
        <p>O roteiro minuto a minuto do dia do evento.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Planejamento Temporal:</strong> Organize as atrações e atividades por horário.</li>
          <li><strong>Responsáveis:</strong> Defina quem da equipe é o "dono" daquela atividade, garantindo que ela aconteça na hora certa.</li>
        </ul>
      </>
    )
  },
  {
    id: 'artists',
    title: 'Banco de Artistas',
    icon: <MicIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'banco de dados participantes contato whatsapp instagram mídia',
    content: (
      <>
        <p>CRM cultural para gerenciar seus talentos.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Ficha Completa:</strong> Nome, performance, contato, CPF/RG e até upload de documento (foto).</li>
          <li><strong>Integração Social:</strong> Botões diretos para o WhatsApp e Instagram do artista.</li>
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
        <p>Centralize as artes gráficas para evitar o uso de logos antigos ou flyers errados.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Categorias:</strong> Separe o que é "Divulgação Geral" do evento e o que é "Mídia de Artista" específica.</li>
          <li><strong>Vínculo com Artistas:</strong> Ao subir um flyer de um artista, vincule-o ao perfil dele para acesso rápido aos dados de contato na mesma tela.</li>
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
        <p>A memória visual do coletivo.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Álbuns:</strong> Crie álbuns por evento ou tema.</li>
          <li><strong>Visualização Imersiva:</strong> Clique nas fotos para abrir em modo tela cheia (lightbox) e navegue com as setas do teclado.</li>
          <li><strong>Upload em Lote:</strong> Envie várias fotos de uma vez para agilizar o arquivamento.</li>
        </ul>
      </>
    )
  },
  {
    id: 'inventory',
    title: 'Inventário',
    icon: <BoxIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'inventário materiais equipamentos estoque lista verificação',
    content: (
      <>
        <p>Não esqueça nenhum cabo ou equipamento.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Status do Item:</strong> Marque como "Pendente", "Confirmado" ou "No Local".</li>
          <li><strong>Responsável:</strong> Saiba quem ficou de levar ou conseguir cada item.</li>
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
        <p>Gere dossiês automáticos do evento com um clique.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Consolidado:</strong> Reúne informações do evento, estatísticas financeiras, lista de tarefas, cronograma e equipe.</li>
          <li><strong>Exportação:</strong> Imprima direto ou baixe um PDF formatado profissionalmente para enviar a parceiros ou arquivar.</li>
        </ul>
      </>
    )
  },
  {
    id: 'notebooks',
    title: 'Cadernos de Notas',
    icon: <BookMarkedIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'notas, caderno, bloco de notas, editor de texto, escrever, ABNT, ideias',
    content: (
      <>
        <p>Espaço para brainstorming e rascunhos.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Editor Rico:</strong> Formatação de texto (negrito, itálico, justificado) para organizar suas ideias.</li>
          <li><strong>Múltiplos Cadernos:</strong> Crie cadernos separados por assunto (ex: "Ideias de Sarau", "Poesias", "Rascunhos de Edital").</li>
        </ul>
      </>
    )
  },
  {
    id: 'clio_player',
    title: 'Rádio & Player Clio',
    icon: <MusicIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'player, música, playlist, som, curadoria, mp3, trilha sonora, tocar, pausar',
    content: (
      <>
        <p>A trilha sonora do trabalho coletivo.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Curadoria:</strong> Vem com uma playlist padrão de artistas parceiros.</li>
          <li><strong>MP3 Player:</strong> Use o widget de música (nota musical no topo da tela) para carregar seus próprios arquivos MP3 locais.</li>
          <li><strong>Gadget de Rádio:</strong> Um widget de mesa para controle rápido da reprodução.</li>
        </ul>
      </>
    )
  },
  {
    id: 'personalize',
    title: 'Personalização & Gadgets',
    icon: <BrushIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'papel de parede, wallpaper, fundo, gadgets, widgets, customizar',
    content: (
      <>
        <p>Deixe o Clio OS com a sua cara e aumente sua produtividade.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Papel de Parede:</strong> Troque o fundo da área de trabalho (upload de imagem ou galeria).</li>
          <li><strong>Gadgets (Widgets):</strong> Adicione ferramentas flutuantes à sua área de trabalho:
            <ul className="list-circle pl-5 mt-1 text-sm text-slate-400">
               <li><em>Relógio Analógico</em></li>
               <li><em>Contagem Regressiva</em></li>
               <li><em>Notas Rápidas (Post-it)</em></li>
               <li><em>Resumo Financeiro</em></li>
               <li><em>Status da Equipe</em></li>
               <li><em>Rádio Clio</em></li>
            </ul>
          </li>
        </ul>
      </>
    )
  },
  {
    id: 'browser',
    title: 'Navegador',
    icon: <GlobeIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'browser, internet, comunicação externa',
    content: (
      <>
        <p>Ferramenta para manter o foco sem sair do app.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Navegador Interno:</strong> Para pesquisas rápidas e acesso a sistemas web simples.</li>
        </ul>
      </>
    )
  },
  {
    id: 'profile',
    title: 'Perfil & Segurança',
    icon: <UserIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'perfil, usuário, conta, senha, avatar',
    content: (
      <>
        <p>Gerencie sua identidade no sistema.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Dados Pessoais:</strong> Atualize seu nome, função e foto de perfil.</li>
          <li><strong>Segurança:</strong> Altere sua senha de acesso periodicamente.</li>
        </ul>
      </>
    )
  },
  {
    id: 'mobile',
    title: 'Versão Mobile (Celular)',
    icon: <MenuIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'celular, mobile, responsivo, touch, gestos',
    content: (
      <>
        <p>O Clio OS no seu bolso, otimizado para telas de toque.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Gaveta de Apps:</strong> Deslize para <strong>CIMA</strong> na parte inferior da tela para ver todos os aplicativos.</li>
          <li><strong>Centro de Controle:</strong> Deslize para <strong>BAIXO</strong> em qualquer lugar para ver o calendário, notificações e player de música.</li>
          <li><strong>Dock Rápido:</strong> Acesso inferior aos apps essenciais: Dashboard, Tarefas, Hub e Finanças.</li>
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
