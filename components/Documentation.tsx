
import React, { useState, useMemo } from 'react';
import { HomeIcon, CheckSquareIcon, ClockIcon, MicIcon, UsersIcon, ImageIcon, SearchIcon, BoxIcon, FileTextIcon, WalletIcon, BriefcaseIcon, BrushIcon, BookMarkedIcon, GlobeIcon, UserIcon, MenuIcon, CloudCheckIcon, ActivityIcon } from './icons';

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
    keywords: 'introdução, nuvem, real-time, sincronização',
    content: (
      <>
        <p>O <strong>Clio OS</strong> é o sistema operacional definitivo para coletivos culturais. Agora operando 100% na nuvem, ele permite que toda a sua equipe trabalhe em sincronia perfeita, não importa onde estejam.</p>
        <p>Todas as alterações — de uma nova tarefa a um lançamento financeiro — são salvas automaticamente e aparecem instantaneamente para todos os membros do coletivo.</p>
      </>
    )
  },
  {
    id: 'collectives',
    title: 'Coletivos e Convites',
    icon: <UsersIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'criar coletivo, entrar, código, convite, id',
    content: (
      <>
        <p>O Clio OS funciona baseado em <strong>Coletivos</strong>. Você pode criar o seu próprio ou entrar em um existente.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Criar Coletivo:</strong> Ao se cadastrar, você pode fundar um novo espaço de trabalho. Você se torna automaticamente o Administrador.</li>
          <li><strong>Convidar Membros:</strong> Vá até o app <strong>Hub da Equipe</strong> e clique no botão "Copiar Código de Convite" no topo. Envie esse código para sua equipe.</li>
          <li><strong>Entrar em um Coletivo:</strong> Na tela inicial (após o login), escolha a opção "Já tenho convite" e cole o código recebido.</li>
        </ul>
      </>
    )
  },
  {
    id: 'finances',
    title: 'Finanças por Projetos',
    icon: <WalletIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'dinheiro, caixa, projetos, abas, contribuição, mensalidade',
    content: (
      <>
        <p>O módulo financeiro foi reestruturado para garantir transparência total e organização por centros de custo.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Projetos (Caixas):</strong> O dinheiro não fica misturado. Crie "Projetos" para separar as verbas (ex: "Edital Lei Paulo Gustavo", "Bar do Sarau", "Caixa Geral"). Cada projeto tem seu próprio saldo e extrato.</li>
          <li><strong>Transações:</strong> Lance receitas e despesas dentro de cada projeto. Use as categorias sugeridas para gerar gráficos automáticos.</li>
          <li><strong>Aba Contribuições:</strong> Uma visão dedicada para gerenciar mensalidades ou contribuições voluntárias da equipe. Defina um mês de referência e marque quem já apoiou o coletivo financeiramente.</li>
        </ul>
      </>
    )
  },
  {
    id: 'collab_clio',
    title: 'Collab Clio & Governança',
    icon: <BriefcaseIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'atas, votação, democracia, documentos, memória, auditoria',
    content: (
      <>
        <p>Ferramentas para uma gestão horizontal e democrática.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Votações:</strong> Crie pautas, adicione opções e deixe que o sistema compute os votos de cada membro de forma transparente.</li>
          <li><strong>Atas de Reunião:</strong> Registre o que foi decidido, quem estava presente e quais foram os encaminhamentos.</li>
          <li><strong>Documentos:</strong> Upload de arquivos importantes (PDFs, Editais, Estatutos).</li>
          <li><strong>Memória (Audit Log):</strong> A aba "Memória" registra automaticamente todas as ações críticas no sistema (quem criou, editou ou excluiu algo), garantindo responsabilidade e histórico.</li>
        </ul>
      </>
    )
  },
  {
    id: 'media_hub',
    title: 'Hub de Mídia e Nuvem',
    icon: <CloudCheckIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'upload, arquivos, fotos, drive, armazenamento',
    content: (
      <>
        <p>O Clio OS possui um sistema de armazenamento em nuvem integrado (Clio Drive).</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Hub de Mídia:</strong> Centralize flyers, logos e materiais de divulgação. Você pode vincular mídias a artistas específicos.</li>
          <li><strong>Documentos Seguros:</strong> No cadastro de Artistas, a foto do documento (RG/CPF) é salva em uma área segura e criptografada, acessível apenas via link temporário.</li>
          <li><strong>Galeria:</strong> Crie álbuns de fotos dos seus eventos para manter viva a memória do sarau.</li>
        </ul>
      </>
    )
  },
  {
    id: 'tasks_kanban',
    title: 'Gestão de Tarefas (Kanban)',
    icon: <CheckSquareIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'tarefas, produção, prazos, responsável, comentários',
    content: (
      <>
        <p>Transforme ideias em ação com o quadro Kanban.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Arrastar e Soltar:</strong> Mova cartões entre "A Fazer", "Em Andamento" e "Concluído".</li>
          <li><strong>Chat na Tarefa:</strong> Clique em uma tarefa para abrir os detalhes e usar a aba de comentários para discutir especificidades daquela demanda com a equipe.</li>
        </ul>
      </>
    )
  },
  {
    id: 'mobile_gestures',
    title: 'Clio Mobile e Gestos',
    icon: <MenuIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'celular, touch, swipe, deslizar, gaveta',
    content: (
      <>
        <p>A versão mobile foi desenhada para uso com uma mão e navegação por gestos.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Navegação Horizontal:</strong> Deslize para os lados na tela inicial para alternar entre as páginas de Gadgets.</li>
          <li><strong>Gaveta de Apps:</strong> Deslize de baixo para cima (a partir do rodapé) para abrir todos os aplicativos.</li>
          <li><strong>Centro de Controle:</strong> Deslize de cima para baixo (no topo da tela) para ver o calendário rápido e configurações.</li>
          <li><strong>Toque Longo:</strong> Segure o dedo sobre um Gadget para removê-lo ou trocá-lo.</li>
        </ul>
      </>
    )
  },
  {
    id: 'global_search',
    title: 'Busca Global (Ctrl + K)',
    icon: <SearchIcon className="h-6 w-6 text-sky-400" />,
    keywords: 'busca, encontrar, atalho, pesquisa',
    content: (
      <>
        <p>Encontre qualquer coisa no sistema instantaneamente.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Atalho:</strong> Pressione <code>Ctrl + K</code> (ou toque na lupa no topo da tela mobile).</li>
          <li><strong>Universal:</strong> A busca varre membros, tarefas, artistas, itens de inventário e projetos financeiros simultaneamente.</li>
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
          Guia de referência completo para organização, governança e produção cultural colaborativa na nuvem.
        </p>
      </header>

       <div className="relative mb-12 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="O que você quer aprender hoje?"
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
