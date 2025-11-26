// localStorage utility functions for persisting data

export interface StoredProfile {
  profile: any;
  createdAt: string;
}

export interface TaskStatus {
  [taskId: string]: {
    completed: boolean;
    completedAt?: string;
  };
}

export interface StoredBlueprint {
  tasks: any[];
  generatedAt: string;
}

// Profile management
export const saveProfile = (profile: any): void => {
  if (typeof window === 'undefined') return;
  try {
    const data: StoredProfile = {
      profile,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('startup_copilot_profile', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

export const getProfile = (): any | null => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('startup_copilot_profile');
    if (!data) return null;
    const parsed: StoredProfile = JSON.parse(data);
    return parsed.profile;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

export const clearProfile = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('startup_copilot_profile');
  } catch (error) {
    console.error('Error clearing profile:', error);
  }
};

// Blueprint management
export const saveBlueprint = (tasks: any[]): void => {
  if (typeof window === 'undefined') return;
  try {
    const data: StoredBlueprint = {
      tasks,
      generatedAt: new Date().toISOString(),
    };
    localStorage.setItem('startup_copilot_blueprint', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving blueprint:', error);
  }
};

export const getBlueprint = (): any[] | null => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('startup_copilot_blueprint');
    if (!data) return null;
    const parsed: StoredBlueprint = JSON.parse(data);
    return parsed.tasks;
  } catch (error) {
    console.error('Error getting blueprint:', error);
    return null;
  }
};

// Task status management
export const saveTaskStatus = (taskId: string, completed: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    const statuses = getTaskStatuses();
    statuses[taskId] = {
      completed,
      completedAt: completed ? new Date().toISOString() : undefined,
    };
    localStorage.setItem('startup_copilot_tasks', JSON.stringify(statuses));
  } catch (error) {
    console.error('Error saving task status:', error);
  }
};

export const getTaskStatuses = (): TaskStatus => {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem('startup_copilot_tasks');
    if (!data) return {};
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting task statuses:', error);
    return {};
  }
};

export const getTaskStatus = (taskId: string): boolean => {
  const statuses = getTaskStatuses();
  return statuses[taskId]?.completed || false;
};

// Auth mock
export const saveAuthUser = (user: { name: string; email: string }): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('startup_copilot_user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving auth user:', error);
  }
};

export const getAuthUser = (): { name: string; email: string } | null => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('startup_copilot_user');
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
};

export const clearAuth = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('startup_copilot_user');
  } catch (error) {
    console.error('Error clearing auth:', error);
  }
};

// Admin rules editor
export const saveCustomRules = (rules: any[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('startup_copilot_custom_rules', JSON.stringify(rules));
  } catch (error) {
    console.error('Error saving custom rules:', error);
  }
};

export const getCustomRules = (): any[] | null => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem('startup_copilot_custom_rules');
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting custom rules:', error);
    return null;
  }
};
