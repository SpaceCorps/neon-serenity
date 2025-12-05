import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { storageService } from '../services/storage';

const StatsScreen = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('day'); // Default to 'day' to see immediate hourly changes
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const loadedEvents = storageService.getEvents();
        setEvents(loadedEvents);
    }, []);

    const chartData = useMemo(() => {
        const now = new Date();
        let filteredEvents = events;
        let buckets = {};
        let formatLabel = (date) => date.toLocaleDateString();

        const getBucketKey = (date) => {
            // Default to Day key
            return date.toISOString().split('T')[0];
        };

        // Filter and Setup Buckets
        if (timeRange === 'day') {
            // Last 24 hours
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            filteredEvents = events.filter(e => new Date(e.timestamp) > yesterday);
            formatLabel = (date) => date.toLocaleTimeString([], { hour: '2-digit' });

            // Initialize buckets for last 24h
            for (let i = 0; i < 24; i++) {
                const d = new Date(now.getTime() - i * 60 * 60 * 1000);
                d.setMinutes(0, 0, 0); // Zero out minutes/seconds/ms for clean hourly buckets
                buckets[d.getTime()] = { name: d, emotional: 0, background: 0 };
            }

            // Fill buckets
            filteredEvents.forEach(e => {
                const d = new Date(e.timestamp);
                d.setMinutes(0, 0, 0);
                const key = d.getTime();
                if (buckets[key]) {
                    buckets[key][e.type]++;
                }
            });
        } else if (timeRange === 'week') {
            // Last 7 days
            const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredEvents = events.filter(e => new Date(e.timestamp) > lastWeek);
            formatLabel = (date) => date.toLocaleDateString([], { weekday: 'short' });

            for (let i = 0; i < 7; i++) {
                const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                d.setHours(0, 0, 0, 0);
                buckets[d.getTime()] = { name: d, emotional: 0, background: 0 };
            }

            filteredEvents.forEach(e => {
                const d = new Date(e.timestamp);
                d.setHours(0, 0, 0, 0);
                const key = d.getTime();
                // Check if bucket exists (it might not if event is older than 7 days but logic above filters it)
                // However, we rely on timestamp matching.
                // For 'week', we rounded buckets to midnight.
                // We must round event time to midnight too.
                if (buckets[key]) buckets[key][e.type]++;
            });
        } else if (timeRange === 'month') {
            // Last 30 days
            const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredEvents = events.filter(e => new Date(e.timestamp) > lastMonth);
            formatLabel = (date) => date.getDate();

            for (let i = 0; i < 30; i++) {
                const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                d.setHours(0, 0, 0, 0);
                buckets[d.getTime()] = { name: d, emotional: 0, background: 0 };
            }

            filteredEvents.forEach(e => {
                const d = new Date(e.timestamp);
                d.setHours(0, 0, 0, 0);
                const key = d.getTime();
                if (buckets[key]) buckets[key][e.type]++;
            });
        } else if (timeRange === 'year') {
            // Last 12 months
            const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            filteredEvents = events.filter(e => new Date(e.timestamp) > lastYear);
            formatLabel = (date) => date.toLocaleDateString([], { month: 'short' });

            for (let i = 0; i < 12; i++) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                buckets[d.getTime()] = { name: d, emotional: 0, background: 0 };
            }

            filteredEvents.forEach(e => {
                const d = new Date(e.timestamp);
                const bucketDate = new Date(d.getFullYear(), d.getMonth(), 1);
                const key = bucketDate.getTime();
                if (buckets[key]) buckets[key][e.type]++;
            });
        }

        // Convert to array and sort by date
        const data = Object.values(buckets).sort((a, b) => a.name - b.name).map(item => ({
            ...item,
            label: formatLabel(item.name)
        }));

        return data;
    }, [events, timeRange]);

    // Hardcoded colors to ensure visibility
    const COLORS = {
        emotional: '#ff0055',
        background: '#00d2ff',
        text: '#ffffff'
    };

    return (
        <div className="stats-screen">
            <div className="header">
                <button
                    className="back-button"
                    onClick={() => navigate('/')}
                    aria-label="Back to Home"
                >
                    <ArrowLeft size={24} color={COLORS.text} />
                </button>
                <div className="controls">
                    {['day', 'week', 'month', 'year'].map(range => (
                        <button
                            key={range}
                            className={`filter-pill ${timeRange === range ? 'active' : ''}`}
                            onClick={() => setTimeRange(range)}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="chart-container">
                {events.length === 0 ? (
                    <div className="no-data">No data logged yet. Go back and log how you feel!</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorEmotional" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.emotional} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={COLORS.emotional} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorBackground" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.background} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={COLORS.background} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="label"
                                stroke="rgba(255,255,255,0.5)"
                                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.5)"
                                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend verticalAlign="top" height={36} iconType="circle" />
                            <Area
                                type="monotone"
                                name="Emotional"
                                dataKey="emotional"
                                stroke={COLORS.emotional}
                                fillOpacity={1}
                                fill="url(#colorEmotional)"
                                strokeWidth={3}
                            />
                            <Area
                                type="monotone"
                                name="Background"
                                dataKey="background"
                                stroke={COLORS.background}
                                fillOpacity={1}
                                fill="url(#colorBackground)"
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>

            <style>{`
        .stats-screen {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 1rem;
          box-sizing: border-box;
          color: white;
          overflow-y: auto; /* Allow scrolling if debug info is long */
        }

        .header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-top: 1rem;
          flex-shrink: 0;
        }

        .back-button {
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          padding: 0.8rem;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(5px);
        }
        
        .back-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .controls {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 12px;
          align-self: center;
        }

        .filter-pill {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .filter-pill:hover {
          color: white;
        }

        .filter-pill.active {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .chart-container {
          width: 100%;
          height: 400px; /* Explicit height */
          padding-bottom: 2rem;
          flex-shrink: 0;
        }

        .no-data {
          opacity: 0.5;
          font-size: 1.2rem;
          text-align: center;
          padding-top: 4rem;
        }
      `}</style>
        </div>
    );
};

export default StatsScreen;
