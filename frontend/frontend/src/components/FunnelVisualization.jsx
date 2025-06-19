import React from 'react';
import { useSelector } from 'react-redux';
import { ArrowDown, Users, TrendingDown, ArrowRight } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
    ComposedChart
} from 'recharts';

export default function FunnelVisualization({ stats }) {
    console.log('FunnelVisualization stats:', stats);
    const steps = stats?.stats?.steps || stats?.steps || [];
    const conversionRate = stats?.stats?.conversionRate || stats?.conversionRate || 'N/A';
    if (!steps || steps.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8 text-center text-gray-300">
                No funnel data available for the selected funnel and date range.
            </div>
        );
    }

    // Helper to get type and value robustly
    const getStepType = (step) => step.step?.type ?? step.type;
    const getStepValue = (step) => step.step?.value ?? step.value;
    const parseDropoff = (dropoff) => {
        if (dropoff == null) return 0;
        if (typeof dropoff === 'number') return dropoff;
        if (typeof dropoff === 'string') return parseFloat(dropoff.replace('%', '')) || 0;
        return 0;
    };

    const maxUsers = Math.max(...steps.map(step => step.visitors));

    // Prepare data for the chart
    const chartData = steps.map((step, index) => ({
        name: `${getStepType(step) === 'url' ? 'Page' : 'Event'}: ${getStepValue(step)}`,
        users: step.visitors,
        dropoff: parseDropoff(step.dropoff),
        stepNumber: index + 1
    }));
    console.log('FunnelVisualization chartData:', chartData);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 p-4 border border-gray-700 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-200">{label}</p>
                    <div className="mt-2 space-y-1">
                        <p className="text-indigo-400 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Users: {payload[0].value}
                        </p>
                        {payload[1] && payload[1].value !== null && (
                            <p className="text-red-400 flex items-center">
                                <TrendingDown className="h-4 w-4 mr-2" />
                                Drop-off: {payload[1].value.toFixed(2)}%
                            </p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Overall Conversion Rate (above chart) */}
            <div className="flex justify-end mb-4">
                <div className="bg-gray-900 rounded-lg px-4 py-2 border border-gray-700 flex items-center space-x-2 shadow">
                    <span className="text-sm text-gray-400">Overall Conversion Rate:</span>
                    <span className="text-lg font-semibold text-indigo-400">{conversionRate}</span>
                </div>
            </div>
            {/* Chart Visualization */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4 md:p-8 flex flex-col items-center">
                <h3 className="text-xl font-semibold text-gray-200 mb-2 md:mb-4 self-start">Funnel Flow Visualization</h3>
                <div className="w-full" style={{ minHeight: 420, height: 480 }}>
                    <ResponsiveContainer width="100%" height="100%" minHeight={420}>
                        <ComposedChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                                dataKey="name" 
                                angle={0}
                                textAnchor="middle"
                                height={100}
                                interval={0}
                                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                stroke="#4B5563"
                            />
                            <YAxis 
                                yAxisId="left" 
                                orientation="left" 
                                stroke="#818CF8"
                                tick={{ fontSize: 13, fill: '#9CA3AF' }}
                                tickLine={{ stroke: '#4B5563' }}
                            />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                stroke="#F87171"
                                tick={{ fontSize: 13, fill: '#9CA3AF' }}
                                tickLine={{ stroke: '#4B5563' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                verticalAlign="top" 
                                height={36}
                                wrapperStyle={{ paddingBottom: '20px' }}
                                formatter={(value) => <span className="text-gray-300">{value}</span>}
                            />
                            <Bar 
                                yAxisId="left"
                                dataKey="users" 
                                fill="#818CF8" 
                                name="Users"
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                            />
                            <Line 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="dropoff" 
                                stroke="#F87171" 
                                name="Drop-off Rate"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#F87171' }}
                                animationDuration={1500}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Divider */}
            <div className="w-full border-t border-gray-700 my-2" />

            {/* Funnel Steps Timeline Analysis */}
            <div className="relative pl-8 space-y-10">
                {/* Vertical timeline line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-700 z-0" style={{ minHeight: 40, height: '100%' }} />
                {steps.map((step, index) => {
                    const width = (step.visitors / maxUsers) * 100;
                    const isLast = index === steps.length - 1;
                    return (
                        <div key={index} className="relative flex items-start z-10">
                            {/* Timeline Dot */}
                            <div className="flex flex-col items-center mr-4">
                                <span className="w-6 h-6 rounded-full bg-indigo-600 border-4 border-gray-900 flex items-center justify-center text-white font-bold text-sm shadow">
                                    {index + 1}
                                </span>
                                {!isLast && (
                                    <div className="flex-1 w-0.5 bg-gray-700" style={{ minHeight: 32 }} />
                                )}
                            </div>
                            {/* Step Card */}
                            <div className="flex-1 bg-gray-900 rounded-lg shadow p-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                                    <span className="text-base font-semibold text-gray-100">
                                        {getStepType(step) === 'url' ? 'Page: ' : 'Event: '}{getStepValue(step)}
                                    </span>
                                    <div className="flex items-center space-x-4">
                                        <span className="flex items-center text-indigo-400 text-sm font-medium">
                                            <Users className="h-4 w-4 mr-1" />
                                            {step.visitors} users
                                        </span>
                                        {!isLast && step.dropoff && (
                                            <span className="flex items-center text-red-400 text-sm font-medium">
                                                <TrendingDown className="h-4 w-4 mr-1" />
                                                {step.dropoff} drop-off
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="h-4 bg-gray-700 rounded overflow-hidden mt-1">
                                    <div
                                        className="h-full bg-indigo-600 transition-all duration-1000 ease-in-out"
                                        style={{ width: `${width}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Overall Conversion Rate (in analysis section) */}
            <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-gray-300">Overall Conversion Rate</span>
                    <span className="text-xl font-semibold text-indigo-400">{conversionRate}</span>
                </div>
            </div>

            {/* Highest Drop-off Point */}
            {stats.highestDropoff && (
                <div className="mt-4 p-4 bg-red-900/20 rounded-lg border border-red-800/50">
                    <div className="flex items-center">
                        <TrendingDown className="h-5 w-5 text-red-400 mr-2" />
                        <div>
                            <p className="text-sm font-medium text-red-200">Highest Drop-off Point</p>
                            <p className="text-sm text-red-400">
                                Between steps {stats.highestDropoff.stepFrom + 1} and {stats.highestDropoff.stepTo + 1} ({stats.highestDropoff.dropoff})
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 