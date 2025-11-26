"use client"

import { useState } from 'react';
import { Check, Clock, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { Task } from '@/lib/types';
import { saveTaskStatus } from '@/lib/localStorage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface TaskCardProps {
  task: Task;
  onStatusChange?: () => void;
}

const categoryColors = {
  legal: 'bg-purple-100 text-purple-800 border-purple-200',
  product: 'bg-blue-100 text-blue-800 border-blue-200',
  marketing: 'bg-green-100 text-green-800 border-green-200',
  fundraising: 'bg-orange-100 text-orange-800 border-orange-200',
  operations: 'bg-gray-100 text-gray-800 border-gray-200',
};

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

export default function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const [completed, setCompleted] = useState(task.completed || false);
  const [expanded, setExpanded] = useState(false);

  const handleToggleComplete = () => {
    const newStatus = !completed;
    setCompleted(newStatus);
    saveTaskStatus(task.id, newStatus);
    onStatusChange?.();
  };

  return (
    <Card className={`transition-all ${completed ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={categoryColors[task.category]}>
                {task.category}
              </Badge>
              <Badge variant="secondary" className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {task.estimatedHours}h
              </span>
            </div>
            <CardTitle className={`text-lg ${completed ? 'line-through' : ''}`}>
              {task.title}
            </CardTitle>
            <CardDescription className="mt-1">Week {task.week}</CardDescription>
          </div>
          <Button
            size="sm"
            variant={completed ? "default" : "outline"}
            onClick={handleToggleComplete}
            className={completed ? "bg-teal-600 hover:bg-teal-700" : ""}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-700">{task.description}</p>
        
        {(task.dependencies || task.resources) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="mt-3 gap-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show details
              </>
            )}
          </Button>
        )}
        
        {expanded && (
          <div className="mt-4 space-y-3 border-t pt-4">
            {task.dependencies && task.dependencies.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold text-gray-700">Dependencies:</h4>
                <ul className="list-inside list-disc space-y-1 text-xs text-gray-600">
                  {task.dependencies.map((dep) => (
                    <li key={dep}>Task {dep}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {task.resources && task.resources.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold text-gray-700">Resources:</h4>
                <div className="flex flex-wrap gap-2">
                  {task.resources.map((resourceId) => {
                    const isPlaybook = resourceId.startsWith('playbook-');
                    const isTemplate = resourceId.startsWith('template-');
                    
                    return (
                      <Link
                        key={resourceId}
                        href={
                          isPlaybook
                            ? `/playbook`
                            : isTemplate
                            ? `/templates`
                            : '#'
                        }
                        className="flex items-center gap-1 rounded-md bg-teal-50 px-2 py-1 text-xs text-teal-700 hover:bg-teal-100"
                      >
                        <BookOpen className="h-3 w-3" />
                        {isPlaybook ? 'Playbook Article' : 'Template'}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
