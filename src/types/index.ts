export interface SDG {
  id: number;
  title: string;
  description: string;
  color: string;
  icon: string;
  targets: string[];
  progress: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  sdg_id: number;
  creator_id: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  target_amount?: number;
  current_amount?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Contribution {
  id: string;
  user_id: string;
  project_id: string;
  amount: number;
  type: 'monetary' | 'time' | 'resource';
  description: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}