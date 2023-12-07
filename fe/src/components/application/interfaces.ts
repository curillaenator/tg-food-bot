import type { Application, Item } from '../../shared/interfaces';

export type EmergencyStatus = 'fire' | 'warn' | 'ok';

export type FullShowcaseItem = Item & { id: string; totalServicePrice: string; order: Item[]; adress: string };
export type ContentIndexes = Record<string, Record<string, number>>;

export interface UseDetailesProps {
  currentUserId: string;
  executorId: string;
  content: ContentIndexes;
}

interface CommonContent {
  id: string;
  customer: {
    name: string;
    adress: string;
    tel: string;
    tme: string;
  };
  placed: string;
  emergency: EmergencyStatus;
  executorId: string;
  content: Record<string, Record<string, number>>;
  status: Application['status'];
}

export interface UnpickedContentProps extends CommonContent {
  executorName: string;
  pickIsDisabled: boolean;
  onAplicationPick: () => void;
}

export interface PickedContentProps extends CommonContent {
  currentUserId: string;
  // details: FullShowcaseItem[];
  // totalApplicationPrice: number;
}
