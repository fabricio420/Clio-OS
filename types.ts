
export enum TaskStatus {
  ToDo = 'A Fazer',
  InProgress = 'Em Andamento',
  Done = 'Concluído',
}

export interface Collective {
  id: string;
  name: string;
  code?: string; // Used for sharing/joining
  description?: string;
  // Public Profile Fields
  isPublic?: boolean;
  instagram?: string;
  tags?: string[];
  coverImage?: string;
  ownerId?: string;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
  password?: string;
  collectiveId?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId?: string;
  dueDate: string;
  collectiveId?: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  responsible: string;
  collectiveId?: string;
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
  collectiveId?: string;
}

export interface FeedPost {
  id: string;
  author: Member;
  content: string;
  timestamp: string;
  collectiveId?: string;
}

export interface NetworkPost {
    id: string;
    content: string;
    created_at: string;
    likes_count: number;
    author: {
        id: string;
        name: string;
        avatar: string;
        role: string;
    };
    collective: {
        id: string;
        name: string;
    };
    isLikedByMe?: boolean;
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
    collectiveId?: string;
    // Public Settings
    isPublic?: boolean;
    instagram?: string;
    coverImage?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  category: 'general' | 'artist';
  fileDataUrl: string;
  fileName: string;
  artistId?: string;
  collectiveId?: string;
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
    collectiveId?: string;
}

export type TransactionType = 'income' | 'expense';

export const TRANSACTION_CATEGORIES = {
  income: [
    'Vendas', 'Doações', 'Patrocínio', 'Ingressos', 'Outras Receitas', 'Contribuição', 'Mensalidade'
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
  collectiveId?: string;
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
  collectiveId?: string;
}

export interface TeamStatus {
  memberId: string;
  status: string;
  collectiveId?: string;
}

export type GadgetType = 'analog_clock' | 'countdown' | 'quick_note' | 'financial_summary' | 'team_status' | 'weather';

export interface GadgetData {
    content?: string;
}

export interface Gadget {
  id: string;
  type: GadgetType;
  position: { x: number; y: number };
  data?: GadgetData;
  collectiveId?: string;
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
  collectiveId?: string;
}

export interface CollectiveDocument {
  id: string;
  name: string;
  fileDataUrl: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  uploaderId: string;
  collectiveId?: string;
}

export interface MeetingMinute {
  id: string;
  date: string; // ISO string for date
  attendeeIds: string[];
  agenda: string; // Can be simple text or markdown/html
  decisions: string; // Can be simple text or markdown/html
  collectiveId?: string;
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
  collectiveId?: string;
}

export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    entity: string;
    details: string;
    timestamp: string;
    collectiveId?: string;
}

// --- CLIO PULSE NOTIFICATION TYPES ---
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationAction {
    label: string;
    onClick: () => void;
}

export interface ClioNotification {
    id: string;
    title: string;
    message?: string;
    type: NotificationType;
    timestamp: number;
    duration?: number; // in ms
    action?: NotificationAction;
    read: boolean;
}

export type ModalView = 'task' | 'schedule' | 'artist' | 'info' | 'media' | 'inventory' | 'member' | 'avatar_viewer' | 'financial_project' | 'transaction' | 'notebook' | 'photo_album' | 'photo' | 'collective_document' | 'meeting_minute' | 'voting_topic' | 'profile';