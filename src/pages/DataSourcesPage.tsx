import React from 'react';
import { motion } from 'framer-motion';
import { DataSourceList } from '@/components/ecosystem/DataSourceList';
import { Database } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
export function DataSourcesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto"
    >
      <ScrollArea className="h-full pr-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex-shrink-0 mb-6">
            <h1 className="text-3xl font-display flex items-center gap-3">
              <Database className="w-8 h-8 text-primary" />
              Data Sources
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              Connect third-party services to enrich your ecosystem. Live integrations are coming soon.
            </p>
          </div>
          <DataSourceList />
        </div>
      </ScrollArea>
    </motion.div>
  );
}