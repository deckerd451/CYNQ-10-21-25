import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { useEcosystemStore } from '@/stores/ecosystemStore';
import {
  calculateConnectionDensity,
  findMostConnectedItem,
  calculateCategoryDistribution,
  getAllEcosystemItems,
} from '@/lib/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LayoutDashboard, Users, Link as LinkIcon, GitMerge, Star } from 'lucide-react';
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; description: string }> = ({ title, value, icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);
export function DashboardPage() {
  const profile = useUserProfileStore();
  const ecosystem = useEcosystemStore();
  const ecosystemData = {
    ...profile,
    ...ecosystem,
    criticalPath: ecosystem.criticalPaths.find(p => p.id === ecosystem.activeCriticalPathId) || null,
  };
  const allItems = getAllEcosystemItems(ecosystemData);
  const totalItems = allItems.length;
  const totalConnections = ecosystem.relationships.length;
  const connectionDensity = calculateConnectionDensity(totalItems, totalConnections);
  const mostConnected = findMostConnectedItem(allItems, ecosystem.relationships);
  const categoryDistribution = calculateCategoryDistribution(ecosystem.relationships);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto"
    >
      <div className="flex-shrink-0 mb-6">
        <h1 className="text-3xl font-display flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          Ecosystem Dashboard
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          An analytical overview of your personal and professional ecosystem.
        </p>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Items"
            value={totalItems}
            icon={<Users className="h-4 w-4" />}
            description="All entities in your ecosystem"
          />
          <StatCard
            title="Total Connections"
            value={totalConnections}
            icon={<LinkIcon className="h-4 w-4" />}
            description="Relationships you've defined"
          />
          <StatCard
            title="Connection Density"
            value={`${connectionDensity.toFixed(1)}%`}
            icon={<GitMerge className="h-4 w-4" />}
            description="How interconnected your ecosystem is"
          />
          <StatCard
            title="Key Player"
            value={mostConnected ? mostConnected.name : 'N/A'}
            icon={<Star className="h-4 w-4" />}
            description={mostConnected ? `Most connected ${mostConnected.type}` : 'No connections yet'}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Connection Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}