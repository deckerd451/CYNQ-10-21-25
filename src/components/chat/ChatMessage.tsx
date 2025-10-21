import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '../../../worker/types';
import { EmailDraftCard } from './EmailDraftCard';
interface ChatMessageProps {
  message: Message | { role: 'assistant'; content: string; id: string };
}
const parseMarkdown = (text: string) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let isList = false;
  lines.forEach((line, index) => {
    if (line.startsWith('* ')) {
      if (!isList) {
        isList = true;
        elements.push(<ul key={`ul-${index}`} className="list-disc pl-4 space-y-1"></ul>);
      }
      const list = elements[elements.length - 1] as React.ReactElement;
      const newChildren = React.Children.toArray(list.props.children);
      newChildren.push(<li key={index}>{line.substring(2)}</li>);
      elements[elements.length - 1] = React.cloneElement(list, {}, newChildren);
    } else {
      isList = false;
      const parts = line.split(/(\*\*.*?\*\*)/g);
      elements.push(
        <p key={index}>
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    }
  });
  return elements;
};
const parseEmailDraft = (content: string) => {
  const toMatch = content.match(/\*\*To:\*\*\s*(.*)/);
  const subjectMatch = content.match(/\*\*Subject:\*\*\s*(.*)/);
  const bodyMatch = content.match(/\n\n([\s\S]*)/);
  if (toMatch && subjectMatch && bodyMatch) {
    // Find the start of the body after the subject line
    const subjectLineEndIndex = content.indexOf(subjectMatch[0]) + subjectMatch[0].length;
    const body = content.substring(subjectLineEndIndex).trim();
    return {
      to: toMatch[1].trim(),
      subject: subjectMatch[1].trim(),
      body: body,
    };
  }
  return null;
};
export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isEmailDraft = !isUser && message.content.includes('**Drafting Email:**');
  const emailDraft = isEmailDraft ? parseEmailDraft(message.content) : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex items-start gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      )}
      <div
        className={cn(
          'max-w-md lg:max-w-xl px-4 py-3 rounded-2xl relative prose prose-sm dark:prose-invert prose-p:m-0',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted text-foreground rounded-bl-none'
        )}
      >
        {emailDraft ? (
          <EmailDraftCard to={emailDraft.to} subject={emailDraft.subject} body={emailDraft.body} />
        ) : (
          <div className="whitespace-pre-wrap text-base leading-relaxed">
            {parseMarkdown(message.content)}
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <User className="w-5 h-5 text-accent" />
        </div>
      )}
    </motion.div>
  );
};