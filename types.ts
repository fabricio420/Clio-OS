

export enum TaskStatus {
  ToDo = 'A Fazer',
  InProgress = 'Em Andamento',
  Done = 'Concluído',
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
  password?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId?: string;
  dueDate: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  responsible: string;
}

export interface Artist {
  id:string;
  name: string;
  performanceType: string;
  contact: string;
  notes: string;
  instagram?: string;
  whatsapp?: string;
  cpf?: string;
  rg?: string;
  documentImage?: string;
}

export interface FeedPost {
  id: string;
  author: Member;
  content: string;
  timestamp: string;
}

export interface EventInfoData {
    eventName: string;
    collectiveName: string;
    description: string;
    venueName: string;
    venueAddress: string;
    eventDate: string;
    artistGoal: number;
    artTypes: string[];
    hasAwards: boolean;
    awardsDescription: string;
    isCollab: boolean;
    collabDescription: string;
}

export interface MediaItem {
  id: string;
  title: string;
  category: 'general' | 'artist';
  fileDataUrl: string;
  fileName: string;
  artistId?: string;
}

export enum InventoryStatus {
    Pending = 'Pendente',
    Confirmed = 'Confirmado',
    OnSite = 'No Local',
}

export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    status: InventoryStatus;
    responsibleId?: string;
}

export type TransactionType = 'income' | 'expense';

export const TRANSACTION_CATEGORIES = {
  income: [
    'Vendas', 'Doações', 'Patrocínio', 'Ingressos', 'Outras Receitas'
  ],
  expense: [
    'Alimentação', 'Transporte', 'Aluguel de Equipamento', 'Cachê Artista', 'Divulgação', 'Material de Consumo', 'Taxas', 'Outras Despesas'
  ]
};


export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  category: string;
}

export interface FinancialProject {
  id: string;
  name: string;
  description: string;
  transactions: Transaction[];
}

export interface Note {
  id: string;
  title: string;
  content: string; // Will store HTML content
  updatedAt: string;
}

export interface Notebook {
  id: string;
  name: string;
  notes: Note[];
}

export interface Track {
  name: string;
  artist: string;
  url: string;
  artwork: string;
  duration: number;
}

export interface TeamStatus {
  memberId: string;
  status: string;
}

export type GadgetType = 'analog_clock' | 'countdown' | 'quick_note' | 'financial_summary' | 'team_status' | 'radio_clio';

export interface GadgetData {
    content?: string;
}

export interface Gadget {
  id: string;
  type: GadgetType;
  position: { x: number; y: number };
  data?: GadgetData;
}

export type TransactionPeriod = 'all' | 'month' | 'week';

export interface Photo {
  id: string;
  dataUrl: string;
  caption: string;
  fileName: string;
}

export interface PhotoAlbum {
  id: string;
  name: string;
  description: string;
  photos: Photo[];
}

export interface CollectiveDocument {
  id: string;
  name: string;
  fileDataUrl: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  uploaderId: string;
}

export interface MeetingMinute {
  id: string;
  date: string; // ISO string for date
  attendeeIds: string[];
  agenda: string; // Can be simple text or markdown/html
  decisions: string; // Can be simple text or markdown/html
}

export interface VoteOption {
  id: string;
  text: string;
  voterIds: string[];
}

export interface VotingTopic {
  id: string;
  title: string;
  description: string;
  options: VoteOption[];
  creatorId: string;
  createdAt: string; // ISO string
  status: 'open' | 'closed';
}

export type ModalView = 'task' | 'schedule' | 'artist' | 'info' | 'media' | 'inventory' | 'member' | 'avatar_viewer' | 'financial_project' | 'transaction' | 'notebook' | 'photo_album' | 'photo' | 'collective_document' | 'meeting_minute' | 'voting_topic' | 'profile';