"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/Header';
import TaskCard from '@/components/TaskCard';
import ProgressBar from '@/components/ProgressBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProfile } from '@/lib/localStorage';
import { getBlueprintWithStatus, calculateProgress } from '@/lib/mockApi';
import { Task } from '@/lib/types';

export default function BlueprintPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState({ percentage: 0, completedTasks: 0, totalTasks: 0 });
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1]));

  useEffect(() => {
    const loadData = async () => {
      const profile = getProfile();
      if (!profile) {
        router.push('/onboarding');
        return;
      }

      const blueprint = await getBlueprintWithStatus();
      setTasks(blueprint);
      
      const progressData = await calculateProgress();
      setProgress(progressData);

      setLoading(false);
    };

    loadData();
  }, [router]);

  const toggleWeek = (week: number) => {
    setExpandedWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(week)) {
        newSet.delete(week);
      } else {
        newSet.add(week);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allWeeks = [...new Set(tasks.map(t => t.week))];
    setExpandedWeeks(new Set(allWeeks));
  };

  const collapseAll = () => {
    setExpandedWeeks(new Set());
  };

  const handleTaskStatusChange = async () => {
    const blueprint = await getBlueprintWithStatus();
    setTasks(blueprint);
    const progressData = await calculateProgress();
    setProgress(progressData);
  };

  // Group tasks by week
  const tasksByWeek = tasks.reduce((acc, task) => {
    if (!acc[task.week]) {
      acc[task.week] = [];
    }
    acc[task.week].push(task);
    return acc;
  }, {} as Record<number, Task[]>);

  const weeks = Object.keys(tasksByWeek).map(Number).sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
            <p className="text-gray-600">Loading your blueprint...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Your 90-Day Blueprint</h1>
          <p className="text-gray-600">
            A personalized roadmap to take your startup from idea to execution
          </p>
        </div>

        {/* Progress Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar
              percentage={progress.percentage}
              label={`${progress.completedTasks} of ${progress.totalTasks} tasks completed`}
              size="lg"
            />
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="mb-6 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>

        {/* Week by Week Timeline */}
        <div className="space-y-6">
          {weeks.map((week) => {
            const weekTasks = tasksByWeek[week];
            const completedCount = weekTasks.filter(t => t.completed).length;
            const totalCount = weekTasks.length;
            const weekProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const isExpanded = expandedWeeks.has(week);

            return (
              <Card key={week}>
                <CardHeader className="cursor-pointer" onClick={() => toggleWeek(week)}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle>Week {week}</CardTitle>
                        <span className="text-sm text-gray-500">
                          {completedCount}/{totalCount} completed
                        </span>
                      </div>
                      <div className="mt-3">
                        <ProgressBar
                          percentage={weekProgress}
                          showPercentage={false}
                          size="sm"
                        />
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent>
                    <div className="space-y-4">
                      {weekTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStatusChange={handleTaskStatusChange}
                        />
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No tasks in your blueprint yet.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
