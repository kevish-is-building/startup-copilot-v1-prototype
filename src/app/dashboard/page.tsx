"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, TrendingUp, CheckCircle2, Clock, Target, Rocket } from 'lucide-react';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProfile } from '@/lib/localStorage';
import { calculateProgress, getBlueprintWithStatus } from '@/lib/mockApi';
import { Task } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState({
    totalTasks: 0,
    completedTasks: 0,
    percentage: 0,
    weeksCovered: 0,
  });
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const userProfile = getProfile();
      if (!userProfile) {
        router.push('/onboarding');
        return;
      }

      setProfile(userProfile);
      const progressData = await calculateProgress();
      setProgress(progressData);

      const blueprint = await getBlueprintWithStatus();
      const upcoming = blueprint.filter(t => !t.completed).slice(0, 3);
      setUpcomingTasks(upcoming);

      setLoading(false);
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Here's your progress on {profile?.companyName}'s 90-day journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.percentage}%</div>
              <p className="text-xs text-gray-500">
                {progress.completedTasks} of {progress.totalTasks} tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.completedTasks}</div>
              <p className="text-xs text-gray-500">Keep up the momentum!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Remaining</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {progress.totalTasks - progress.completedTasks}
              </div>
              <p className="text-xs text-gray-500">Focus on what matters</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Timeline</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progress.weeksCovered} weeks</div>
              <p className="text-xs text-gray-500">~90 day plan</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>Track your journey from idea to execution</CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressBar
                percentage={progress.percentage}
                label="Overall Completion"
                size="lg"
              />
              <div className="mt-6 flex justify-between gap-4">
                <Link href="/blueprint" className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Full Blueprint
                  </Button>
                </Link>
                <Link href="/tasks" className="flex-1">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Go to Tasks
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Next Up</h2>
            <Link href="/tasks" className="text-sm font-medium text-teal-600 hover:text-teal-700">
              View all tasks <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>
          
          {upcomingTasks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {upcomingTasks.map((task) => (
                <Card key={task.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-teal-600">Week {task.week}</span>
                      <span className="text-xs text-gray-500">{task.estimatedHours}h</span>
                    </div>
                    <CardTitle className="text-base">{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-gray-600">{task.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">All Caught Up!</h3>
                <p className="text-gray-600">You've completed all your tasks. Great work!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Resources</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/legal">
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span>📋</span>
                    Legal Toolkit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Essential legal documents and checklists
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/templates">
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span>📄</span>
                    Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Download ready-to-use business templates
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/playbook">
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span>📚</span>
                    Playbook
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Learn from expert guides and articles
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
