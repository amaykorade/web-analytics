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
    if (!stats || !stats.steps) return null;

    const maxUsers = Math.max(...stats.steps.map(step => step.users));

    // Prepare data for the chart
    const chartData = stats.steps.map((step, index) => ({
        name: `${step.type === 'url' ? 'Page' : 'Event'}: ${step.value}`,
        users: step.users,
        dropoff: index < stats.steps.length - 1 ? step.dropoff : 0,
        stepNumber: index + 1
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900">{label}</p>
                    <div className="mt-2 space-y-1">
                        <p className="text-indigo-600 flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Users: {payload[0].value}
                        </p>
                        {payload[1] && (
                            <p className="text-red-600 flex items-center">
                                <TrendingDown className="h-4 w-4 mr-2" />
                                Drop-off: {payload[1].value}%
                            </p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8">
            {/* Chart Visualization */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Funnel Flow Visualization</h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                interval={0}
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                tickLine={{ stroke: '#E5E7EB' }}
                            />
                            <YAxis 
                                yAxisId="left" 
                                orientation="left" 
                                stroke="#4F46E5"
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                tickLine={{ stroke: '#E5E7EB' }}
                            />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                stroke="#EF4444"
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                tickLine={{ stroke: '#E5E7EB' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                verticalAlign="top" 
                                height={36}
                                wrapperStyle={{ paddingBottom: '20px' }}
                            />
                            <Bar 
                                yAxisId="left"
                                dataKey="users" 
                                fill="#4F46E5" 
                                name="Users"
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                            />
                            <Line 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="dropoff" 
                                stroke="#EF4444" 
                                name="Drop-off Rate"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#EF4444' }}
                                animationDuration={1500}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Original Funnel Steps */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Funnel Analysis</h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <Users className="h-5 w-5 text-indigo-600 mr-2" />
                            <span className="text-sm text-gray-600">Total Users</span>
                        </div>
                        <div className="flex items-center">
                            <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
                            <span className="text-sm text-gray-600">Drop-off</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {stats.steps.map((step, index) => {
                        const width = (step.users / maxUsers) * 100;
                        const isLast = index === stats.steps.length - 1;

                        return (
                            <div key={index} className="relative">
                                {/* Step Label */}
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-900">
                                            {step.type === 'url' ? 'Page: ' : 'Event: '}
                                            {step.value}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm font-medium text-gray-900">
                                            {step.users} users
                                        </span>
                                        {!isLast && step.dropoff && (
                                            <span className="text-sm text-red-600">
                                                {step.dropoff}% drop-off
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Funnel Bar */}
                                <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-600 transition-all duration-1000 ease-in-out"
                                        style={{ width: `${width}%` }}
                                    />
                                </div>

                                {/* Arrow between steps */}
                                {!isLast && (
                                    <div className="flex justify-center my-2">
                                        <ArrowDown className="h-4 w-4 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Overall Conversion Rate */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">Overall Conversion Rate</span>
                        <span className="text-lg font-semibold text-indigo-600">{stats.conversionRate}%</span>
                    </div>
                </div>

                {/* Highest Drop-off Point */}
                {stats.highestDropoff && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center">
                            <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
                            <div>
                                <p className="text-sm font-medium text-red-900">Highest Drop-off Point</p>
                                <p className="text-sm text-red-600">
                                    Between steps {stats.highestDropoff.stepFrom + 1} and {stats.highestDropoff.stepTo + 1} ({stats.highestDropoff.dropoff}%)
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 