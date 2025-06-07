import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { createFunnelThunk, getFunnelsThunk, updateFunnelThunk, deleteFunnelThunk, getFunnelStatsThunk } from '../features/funnel/funnelSlice';
import { userData, getScriptThunk } from '../features/script/scriptSlice';
import DateRangePicker from './DateRangePicker';
import FunnelVisualization from './FunnelVisualization';

export default function FunnelManager() {
    const dispatch = useDispatch();
    const scriptData = useSelector(userData);
    const { funnels, loading, error, funnelStats } = useSelector(state => state.funnel);
    const [selectedFunnel, setSelectedFunnel] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newFunnel, setNewFunnel] = useState({
        funnelName: '',
        steps: [{ type: 'url', value: '' }]
    });

    const userId = scriptData?.scripts?.[0]?.userId;
    const websiteName = scriptData?.scripts?.[0]?.websiteName;

    // Fetch script data when component mounts
    useEffect(() => {
        dispatch(getScriptThunk());
    }, [dispatch]);

    // Fetch funnels when userId and websiteName are available
    useEffect(() => {
        if (userId && websiteName) {
            dispatch(getFunnelsThunk({ userId, websiteName }));
        }
    }, [dispatch, userId, websiteName]);

    // Fetch funnel stats when a funnel is selected
    useEffect(() => {
        if (selectedFunnel && userId && websiteName) {
            dispatch(getFunnelStatsThunk({
                funnelId: selectedFunnel._id,
                userId,
                websiteName,
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                endDate: new Date()
            }));
        }
    }, [dispatch, selectedFunnel, userId, websiteName]);

    const handleAddStep = () => {
        if (newFunnel.steps.length < 5) {
            setNewFunnel(prev => ({
                ...prev,
                steps: [...prev.steps, { type: 'url', value: '' }]
            }));
        }
    };

    const handleRemoveStep = (index) => {
        setNewFunnel(prev => ({
            ...prev,
            steps: prev.steps.filter((_, i) => i !== index)
        }));
    };

    const handleStepChange = (index, field, value) => {
        setNewFunnel(prev => ({
            ...prev,
            steps: prev.steps.map((step, i) => 
                i === index ? { ...step, [field]: value } : step
            )
        }));
    };

    const handleCreateFunnel = async () => {
        if (!newFunnel.funnelName || newFunnel.steps.some(step => !step.value)) {
            alert('Please fill in all fields');
            return;
        }

        // Log all required fields before creating funnel
        console.log('Required Fields Check:', {
            funnelName: newFunnel.funnelName,
            steps: newFunnel.steps,
            userId: userId,
            websiteName: websiteName
        });

        // Format the data according to backend requirements
        const funnelData = {
            funnelName: newFunnel.funnelName,
            steps: newFunnel.steps.map(step => ({
                type: step.type,
                value: step.value
            })),
            userId: userId,
            websiteName: websiteName
        };

        // Validate all required fields are present
        if (!funnelData.userId || !funnelData.websiteName) {
            alert('Missing user or website information. Please try refreshing the page.');
            return;
        }

        console.log('Sending funnel data:', funnelData);

        try {
            const result = await dispatch(createFunnelThunk(funnelData)).unwrap();
            console.log('Funnel created successfully:', result);
            
            setIsCreating(false);
            setNewFunnel({
                funnelName: '',
                steps: [{ type: 'url', value: '' }]
            });
        } catch (error) {
            console.error('Error creating funnel:', error);
            alert(error || 'Failed to create funnel');
        }
    };

    const handleFunnelSelect = (funnel) => {
        console.log('Selecting funnel:', funnel);
        setSelectedFunnel(funnel);
    };

    const handleDeleteFunnel = async (funnelId, e) => {
        e.stopPropagation(); // Prevent event bubbling
        if (window.confirm('Are you sure you want to delete this funnel?')) {
            try {
                if (!userId) {
                    alert('User ID is missing. Please try refreshing the page.');
                    return;
                }

                await dispatch(deleteFunnelThunk({ funnelId, userId })).unwrap();
                
                // Clear selected funnel if it was the one being deleted
                if (selectedFunnel?._id === funnelId) {
                    setSelectedFunnel(null);
                }
                
                // Refresh the funnel list
                if (userId && websiteName) {
                    await dispatch(getFunnelsThunk({ userId, websiteName }));
                }
            } catch (error) {
                console.error('Error deleting funnel:', error);
                alert(error || 'Failed to delete funnel');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Funnel Analytics</h1>
                <button
                    onClick={() => setIsCreating(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Create New Funnel
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {isCreating && (
                <div className="mb-8 p-6 bg-white rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Create New Funnel</h2>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Funnel Name</label>
                            <input
                                type="text"
                                value={newFunnel.funnelName}
                                onChange={(e) => setNewFunnel(prev => ({ ...prev, funnelName: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>

                        {newFunnel.steps.map((step, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Step {index + 1}</label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <select
                                            value={step.type}
                                            onChange={(e) => handleStepChange(index, 'type', e.target.value)}
                                            className="rounded-l-md border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                                        >
                                            <option value="url">URL</option>
                                            <option value="event">Event</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={step.value}
                                            onChange={(e) => handleStepChange(index, 'value', e.target.value)}
                                            placeholder={step.type === 'url' ? 'Enter URL' : 'Enter event name'}
                                            className="flex-1 rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                {index > 0 && (
                                    <button
                                        onClick={() => handleRemoveStep(index)}
                                        className="mt-6 p-2 text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        ))}

                        {newFunnel.steps.length < 5 && (
                            <button
                                onClick={handleAddStep}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Step
                            </button>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateFunnel}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create Funnel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Funnel List */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Funnels</h2>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500">Loading funnels...</p>
                                    </div>
                                ) : funnels.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500">No funnels created yet</p>
                                    </div>
                                ) : (
                                    funnels.map(funnel => (
                                        <div
                                            key={funnel._id}
                                            className={`p-4 rounded-lg cursor-pointer transition-colors ${
                                                selectedFunnel?._id === funnel._id
                                                    ? 'bg-indigo-50 border border-indigo-200'
                                                    : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                            onClick={() => handleFunnelSelect(funnel)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-900">{funnel.funnelName}</h3>
                                                    <p className="text-xs text-gray-500">
                                                        {funnel.steps.length} steps
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => handleDeleteFunnel(funnel._id, e)}
                                                    className="text-gray-400 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Funnel Visualization */}
                <div className="lg:col-span-2">
                    {selectedFunnel ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {selectedFunnel.funnelName}
                                </h2>
                                <DateRangePicker />
                            </div>
                            {loading ? (
                                <div className="bg-white rounded-lg shadow p-6 text-center">
                                    <p className="text-gray-500">Loading funnel data...</p>
                                </div>
                            ) : (
                                <FunnelVisualization stats={funnelStats} />
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <p className="text-gray-500">Select a funnel to view its analysis</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 