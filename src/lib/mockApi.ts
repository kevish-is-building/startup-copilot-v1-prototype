import { MockData, Profile, Task, Template, PlaybookArticle, BlueprintRule } from './types';
import { saveBlueprint, getBlueprint, getTaskStatuses, getCustomRules } from './localStorage';

// Simulated API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch mock data from JSON file
let mockDataCache: MockData | null = null;

export const fetchMockData = async (): Promise<MockData> => {
  if (mockDataCache) return mockDataCache;
  
  await delay(300); // Simulate network latency
  
  try {
    const response = await fetch('/sampleData.json');
    if (!response.ok) throw new Error('Failed to fetch mock data');
    mockDataCache = await response.json();
    return mockDataCache!;
  } catch (error) {
    console.error('Error fetching mock data:', error);
    // Return minimal mock data as fallback
    return {
      sampleProfile: {
        id: 'sample-1',
        companyName: 'TechFlow AI',
        industry: 'SaaS',
        stage: 'idea',
        founderCount: 2,
        fundingGoal: 'seed',
        currentState: 'concept',
        goals: ['build_mvp', 'raise_funding', 'get_first_customers'],
        createdAt: new Date().toISOString(),
      },
      tasks: [],
      templates: [],
      playbook: [],
      blueprintRules: [],
    };
  }
};

// Rule engine: Generate personalized blueprint based on profile
export const generateBlueprint = async (profile: Profile): Promise<Task[]> => {
  await delay(500); // Simulate processing time
  
  const data = await fetchMockData();
  const customRules = getCustomRules();
  const rules = customRules || data.blueprintRules;
  
  // Find matching tasks based on rules
  const matchedTaskIds = new Set<string>();
  
  rules.forEach((rule: BlueprintRule) => {
    let matches = true;
    
    // Check stage condition
    if (rule.condition.stage && !rule.condition.stage.includes(profile.stage)) {
      matches = false;
    }
    
    // Check industry condition
    if (rule.condition.industry && !rule.condition.industry.includes(profile.industry)) {
      matches = false;
    }
    
    // Check funding goal condition
    if (rule.condition.fundingGoal && !rule.condition.fundingGoal.includes(profile.fundingGoal)) {
      matches = false;
    }
    
    // Check goals condition (at least one goal must match)
    if (rule.condition.goals) {
      const hasMatchingGoal = rule.condition.goals.some(goal => profile.goals.includes(goal));
      if (!hasMatchingGoal) {
        matches = false;
      }
    }
    
    // Add matching tasks
    if (matches) {
      rule.tasks.forEach(taskId => matchedTaskIds.add(taskId));
    }
  });
  
  // Get full task objects and sort by week
  const blueprint = data.tasks
    .filter(task => matchedTaskIds.has(task.id))
    .sort((a, b) => a.week - b.week);
  
  // Save to localStorage
  saveBlueprint(blueprint);
  
  return blueprint;
};

// Get blueprint with task statuses
export const getBlueprintWithStatus = async (): Promise<Task[]> => {
  await delay(200);
  
  const blueprint = getBlueprint();
  if (!blueprint) return [];
  
  const statuses = getTaskStatuses();
  
  return blueprint.map(task => ({
    ...task,
    completed: statuses[task.id]?.completed || false,
  }));
};

// Get all tasks (for tasks page)
export const getAllTasks = async (): Promise<Task[]> => {
  const data = await fetchMockData();
  const statuses = getTaskStatuses();
  
  await delay(300);
  
  return data.tasks.map(task => ({
    ...task,
    completed: statuses[task.id]?.completed || false,
  }));
};

// Get templates
export const getTemplates = async (): Promise<Template[]> => {
  const data = await fetchMockData();
  await delay(200);
  return data.templates;
};

// Get template by ID
export const getTemplateById = async (id: string): Promise<Template | null> => {
  const data = await fetchMockData();
  await delay(150);
  return data.templates.find(t => t.id === id) || null;
};

// Get playbook articles
export const getPlaybookArticles = async (): Promise<PlaybookArticle[]> => {
  const data = await fetchMockData();
  await delay(200);
  return data.playbook;
};

// Get playbook article by slug
export const getPlaybookArticle = async (slug: string): Promise<PlaybookArticle | null> => {
  const data = await fetchMockData();
  await delay(150);
  return data.playbook.find(a => a.slug === slug) || null;
};

// Get sample profile
export const getSampleProfile = async (): Promise<Profile> => {
  const data = await fetchMockData();
  await delay(100);
  return data.sampleProfile;
};

// Generate downloadable template file
export const generateTemplateFile = (template: Template): string => {
  const blob = new Blob([template.content], { type: 'text/plain' });
  return URL.createObjectURL(blob);
};

// Calculate progress statistics
export const calculateProgress = async (): Promise<{
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  weeksCovered: number;
}> => {
  const blueprint = await getBlueprintWithStatus();
  
  const totalTasks = blueprint.length;
  const completedTasks = blueprint.filter(t => t.completed).length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const weeksCovered = Math.max(...blueprint.map(t => t.week), 0);
  
  return {
    totalTasks,
    completedTasks,
    percentage,
    weeksCovered,
  };
};
