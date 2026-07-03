export type MoodType = 'آرام' | 'خوشحال' | 'غمگین' | 'نگران' | 'خسته' | 'انرژی دار';

export type JournalEntry = {
  id: string;
  title: string;
  reflection: string;
  mood: MoodType;
  weather?: string;
  location?: string;
  tags?: string[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
};

export type JournalStats = {
  totalEntries: number;
  lastEntry?: JournalEntry;
  moodCounts: Record<MoodType, number>;
  entriesThisMonth: number;
  entriesThisWeek: number;
};
