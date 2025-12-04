"use client"

import { Download, FileText } from 'lucide-react';
import { Template } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const handleDownload = () => {
    // Generate a text file with the template content
    const blob = new Blob([template.content], { type: 'text/plain' });
    const fileUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${template.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileUrl);
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">{template.title}</CardTitle>
            <CardDescription className="mt-1">{template.description}</CardDescription>
          </div>
          <FileText className="h-8 w-8 text-teal-600" />
        </div>
      </CardHeader>
      
      <CardContent>
        <Badge variant="outline" className="bg-purple-50 text-purple-700">
          {template.category}
        </Badge>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleDownload}
          className="w-full gap-2 bg-teal-600 hover:bg-teal-700"
        >
          <Download className="h-4 w-4" />
          Download TXT
        </Button>
      </CardFooter>
    </Card>
  );
}