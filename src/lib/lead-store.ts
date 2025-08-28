import { create } from 'zustand';

export interface Lead {
  name: string;
  email: string;
  industry: string;
  submitted_at: string;
}

interface LeadStore {
  submitted: boolean;
  sessionLeads: Lead[];
  error: string | null;
  isLoading: boolean;
  setSubmitted: (submitted: boolean) => void;
  addLead: (lead: Lead) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useLeadStore = create<LeadStore>((set, get) => ({
  submitted: false,
  sessionLeads: [],
  error: null,
  isLoading: false,

  setSubmitted: (submitted: boolean) => {
    set({ submitted });
  },

  addLead: (lead: Lead) => {
    try {
      // Validate lead data
      if (!lead.name || !lead.email) {
        throw new Error('Invalid lead data: name and email are required');
      }

      // Check for duplicate email in current session
      const existingLead = get().sessionLeads.find(l => l.email === lead.email);
      if (existingLead) {
        throw new Error('A lead with this email already exists in this session');
      }

      set((state) => ({
        sessionLeads: [...state.sessionLeads, lead],
        error: null, // Clear any previous errors
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add lead' 
      });
      console.error('Error adding lead:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));