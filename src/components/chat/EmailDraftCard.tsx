import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Copy, Mail } from 'lucide-react';
import { toast } from 'sonner';
interface EmailDraftCardProps {
  to: string;
  subject: string;
  body: string;
}
export const EmailDraftCard: React.FC<EmailDraftCardProps> = ({ to, subject, body }) => {
  const fullEmailContent = `Subject: ${subject}\n\n${body}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(fullEmailContent);
    toast.success('Email content copied to clipboard!');
  };
  return (
    <Card className="mt-2 bg-muted/50 border-primary/20 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          Email Draft
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="space-y-2">
          <div className="flex gap-2">
            <span className="font-semibold text-muted-foreground">To:</span>
            <span>{to}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-muted-foreground">Subject:</span>
            <span>{subject}</span>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="whitespace-pre-wrap text-foreground bg-background/50 p-3 rounded-md text-xs leading-relaxed">
          {body}
        </div>
        <div className="flex justify-end mt-3">
          <Button size="sm" variant="outline" onClick={handleCopy}>
            <Copy className="w-3 h-3 mr-1.5" />
            Copy Content
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};