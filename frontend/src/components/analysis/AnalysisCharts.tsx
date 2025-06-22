"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import type { CompetitorPrice, PriceTrendPoint, MarketSharePoint } from '@/lib/api';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, subtitle }) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-lg h-[400px]">
    <div className="mb-6">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
    </div>
    <ResponsiveContainer width="100%" height="100%">
      {children as React.ReactElement}
    </ResponsiveContainer>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-md p-3 text-sm">
        <p className="label text-white font-bold">{`${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MarketShareTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-md p-3 text-sm">
        <p className="label text-white font-bold">{`${label}`}</p>
        <p style={{ color: payload[0].fill }}>{`Market Share: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
}

interface AnalysisChartsProps {
  competitorData: CompetitorPrice[];
  priceTrendData: PriceTrendPoint[];
  marketShareData: MarketSharePoint[];
}

export const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ competitorData, priceTrendData, marketShareData }) => {
  // Format competitor data - convert cents to dollars and filter out target game
  const competitors = competitorData
    .filter(d => !d.isTarget)
    .map(d => ({ 
      ...d, 
      price: d.price / 100,
      displayName: d.name || 'Unknown Game'
    }))
    .sort((a, b) => b.price - a.price);

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">Detailed Analysis</h2>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
          Visualizing market dynamics, competitive landscape, and pricing trends.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ChartCard 
          title="Competitor Price Comparison" 
          subtitle={`Your game vs ${competitors.length} similar titles`}
        >
          <BarChart data={competitors} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              type="number" 
              stroke="#9ca3af" 
              domain={[0, 'dataMax + 5']} 
              tickFormatter={(tick: number) => `$${tick}`} 
            />
            <YAxis type="category" dataKey="displayName" stroke="#9ca3af" width={120} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}/>
            <Bar dataKey="price" name="Price" fill="#3b82f6" />
          </BarChart>
        </ChartCard>
        
        <ChartCard title="Price Trend Analysis" subtitle="Historical and projected pricing trends">
          <LineChart data={priceTrendData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" tickFormatter={(tick: number) => `$${tick}`} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4b5563', strokeWidth: 1 }}/>
            <Legend />
            <Line type="monotone" dataKey="currentPrice" name="Current Price" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="recommendedPrice" name="Recommended" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>
      </div>
      
      {/* Market Share Chart */}
      <ChartCard 
        title="Market Share Analysis" 
        subtitle={`Market positioning among ${marketShareData.length} key competitors`}
      >
        <BarChart data={marketShareData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" tickFormatter={(tick: number) => `${tick}%`} />
          <Tooltip content={<MarketShareTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}/>
          <Bar dataKey="marketShare" name="Market Share" fill="#8b5cf6" />
        </BarChart>
      </ChartCard>
    </section>
  );
}; 