import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { 
  RefreshCw, 
  Download, 
  Calendar,
  Thermometer,
  Droplets,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface MetricData {
  timestamp: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  ph: number;
  lightIntensity: number;
  windSpeed: number;
  pressure: number;
}

const MetricsChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [isLive, setIsLive] = useState(true);
  const [data, setData] = useState<MetricData[]>([]);

  // Generate mock data
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const points = timeRange === '1h' ? 60 : timeRange === '24h' ? 24 : 7;
      const interval = timeRange === '1h' ? 1 : timeRange === '24h' ? 60 : 1440; // minutes
      
      return Array.from({ length: points }, (_, i) => {
        const time = new Date(now.getTime() - (points - 1 - i) * interval * 60000);
        return {
          timestamp: timeRange === '1h' 
            ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : timeRange === '24h'
            ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : time.toLocaleDateString([], { month: 'short', day: 'numeric' }),
          temperature: 20 + Math.random() * 10 + Math.sin(i * 0.1) * 3,
          humidity: 40 + Math.random() * 40 + Math.cos(i * 0.15) * 10,
          soilMoisture: 30 + Math.random() * 30 + Math.sin(i * 0.08) * 5,
          ph: 6.0 + Math.random() * 2 + Math.sin(i * 0.05) * 0.5,
          lightIntensity: 200 + Math.random() * 600 + Math.sin(i * 0.12) * 200,
          windSpeed: Math.random() * 15 + Math.sin(i * 0.2) * 3,
          pressure: 1000 + Math.random() * 50 + Math.cos(i * 0.1) * 10
        };
      });
    };

    setData(generateData());
  }, [timeRange]);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData];
        const lastPoint = newData[newData.length - 1];
        const now = new Date();
        
        // Update the last point with new values
        newData[newData.length - 1] = {
          ...lastPoint,
          timestamp: timeRange === '1h' 
            ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temperature: Math.max(0, lastPoint.temperature + (Math.random() - 0.5) * 2),
          humidity: Math.max(0, Math.min(100, lastPoint.humidity + (Math.random() - 0.5) * 5)),
          soilMoisture: Math.max(0, Math.min(100, lastPoint.soilMoisture + (Math.random() - 0.5) * 3)),
          ph: Math.max(0, Math.min(14, lastPoint.ph + (Math.random() - 0.5) * 0.2)),
          lightIntensity: Math.max(0, lastPoint.lightIntensity + (Math.random() - 0.5) * 50),
          windSpeed: Math.max(0, lastPoint.windSpeed + (Math.random() - 0.5) * 1),
          pressure: Math.max(950, Math.min(1050, lastPoint.pressure + (Math.random() - 0.5) * 2))
        };
        
        return newData;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLive, timeRange]);

  const getCurrentValue = (metric: string) => {
    if (data.length === 0) return 0;
    const latest = data[data.length - 1];
    return latest[metric as keyof MetricData];
  };

  const getTrend = (metric: string) => {
    if (data.length < 2) return 0;
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    return (latest[metric as keyof MetricData] as number) - (previous[metric as keyof MetricData] as number);
  };

  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case 'temperature': return '°C';
      case 'humidity': return '%';
      case 'soilMoisture': return '%';
      case 'ph': return 'pH';
      case 'lightIntensity': return 'lux';
      case 'windSpeed': return 'km/h';
      case 'pressure': return 'hPa';
      default: return '';
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'temperature': return '#ef4444';
      case 'humidity': return '#3b82f6';
      case 'soilMoisture': return '#8b5cf6';
      case 'ph': return '#f59e0b';
      case 'lightIntensity': return '#eab308';
      case 'windSpeed': return '#06b6d4';
      case 'pressure': return '#10b981';
      default: return '#6b7280';
    }
  };

  const currentStats = [
    {
      name: 'Temperature',
      value: getCurrentValue('temperature'),
      unit: '°C',
      trend: getTrend('temperature'),
      icon: Thermometer,
      color: 'text-red-500'
    },
    {
      name: 'Humidity',
      value: getCurrentValue('humidity'),
      unit: '%',
      trend: getTrend('humidity'),
      icon: Droplets,
      color: 'text-blue-500'
    },
    {
      name: 'Soil Moisture',
      value: getCurrentValue('soilMoisture'),
      unit: '%',
      trend: getTrend('soilMoisture'),
      icon: Droplets,
      color: 'text-purple-500'
    },
    {
      name: 'pH Level',
      value: getCurrentValue('ph'),
      unit: 'pH',
      trend: getTrend('ph'),
      icon: Activity,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl">Live Farm Metrics</h2>
          <p className="text-gray-600">Real-time data from your Kafka streams</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={isLive ? 'default' : 'secondary'} className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{isLive ? 'Live' : 'Paused'}</span>
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {isLive ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentStats.map(stat => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.name}</p>
                    <p className="text-2xl">
                      {typeof stat.value === 'number' ? stat.value.toFixed(1) : stat.value}{stat.unit}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      {stat.trend > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : stat.trend < 0 ? (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      ) : null}
                      <span className={`text-xs ${stat.trend > 0 ? 'text-green-500' : stat.trend < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        {stat.trend > 0 ? '+' : ''}{stat.trend.toFixed(1)}{stat.unit}
                      </span>
                    </div>
                  </div>
                  <IconComponent className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart Controls */}
      <div className="flex space-x-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="temperature">Temperature</SelectItem>
            <SelectItem value="humidity">Humidity</SelectItem>
            <SelectItem value="soilMoisture">Soil Moisture</SelectItem>
            <SelectItem value="ph">pH Level</SelectItem>
            <SelectItem value="lightIntensity">Light Intensity</SelectItem>
            <SelectItem value="windSpeed">Wind Speed</SelectItem>
            <SelectItem value="pressure">Pressure</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>{selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1).replace(/([A-Z])/g, ' $1')}</span>
            <Badge variant="outline">{getMetricUnit(selectedMetric)}</Badge>
          </CardTitle>
          <CardDescription>
            {timeRange === '1h' ? 'Minute-by-minute' : timeRange === '24h' ? 'Hourly' : 'Daily'} data over the {timeRange === '1h' ? 'last hour' : timeRange === '24h' ? 'last 24 hours' : 'last 7 days'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)} ${getMetricUnit(selectedMetric)}`, selectedMetric]}
                />
                <Area 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke={getMetricColor(selectedMetric)}
                  fill={getMetricColor(selectedMetric)}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Multiple Metrics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Overview</CardTitle>
          <CardDescription>Multiple key metrics at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis yAxisId="temp" orientation="left" />
                <YAxis yAxisId="percent" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="temp"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Temperature (°C)"
                />
                <Line 
                  yAxisId="percent"
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Humidity (%)"
                />
                <Line 
                  yAxisId="percent"
                  type="monotone" 
                  dataKey="soilMoisture" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Soil Moisture (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
          <CardDescription>Current status of your Kafka data streams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Field Sensors</h4>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <p className="text-sm text-gray-600">3 devices reporting</p>
              <p className="text-xs text-gray-500">Last update: 2 seconds ago</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Weather Station</h4>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <p className="text-sm text-gray-600">1 device reporting</p>
              <p className="text-xs text-gray-500">Last update: 1 minute ago</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Greenhouse</h4>
                <Badge className="bg-yellow-100 text-yellow-800">Delayed</Badge>
              </div>
              <p className="text-sm text-gray-600">2 devices reporting</p>
              <p className="text-xs text-gray-500">Last update: 5 minutes ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsChart;