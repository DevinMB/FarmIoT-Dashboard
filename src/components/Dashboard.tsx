import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Download, 
  Cpu, 
  Activity, 
  Thermometer, 
  Droplets, 
  Wind, 
  Zap,
  Plus,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import MetricsChart from './MetricsChart';
import NodeManagement from './NodeManagement';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface User {
  id: string;
  email: string;
  companyName: string;
  role: 'user' | 'admin';
}

interface DashboardProps {
  user: User;
}

interface DeviceStatus {
  id: string;
  name: string;
  type: 'pi' | 'esp32';
  status: 'online' | 'offline' | 'updating';
  lastSeen: string;
  metrics?: {
    temperature?: number;
    humidity?: number;
    soilMoisture?: number;
    batteryLevel?: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [devices, setDevices] = useState<DeviceStatus[]>([
    {
      id: '1',
      name: 'Field A Sensor Hub',
      type: 'pi',
      status: 'online',
      lastSeen: '2 minutes ago',
      metrics: { temperature: 24.5, humidity: 65, soilMoisture: 42 }
    },
    {
      id: '2', 
      name: 'Greenhouse Monitor',
      type: 'esp32',
      status: 'online',
      lastSeen: '5 minutes ago',
      metrics: { temperature: 28.2, humidity: 78, batteryLevel: 87 }
    },
    {
      id: '3',
      name: 'Weather Station',
      type: 'esp32',
      status: 'offline',
      lastSeen: '2 hours ago',
      metrics: { temperature: 22.1, humidity: 45, batteryLevel: 12 }
    }
  ]);

  const handleDownloadPiImage = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          // In real app, trigger actual download
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'updating': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'offline': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'updating': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-6 text-white">
        <h1 className="text-2xl mb-2">Welcome back, {user.companyName}!</h1>
        <p className="text-green-100">
          Manage your IoT devices and monitor your farm's real-time metrics
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Devices</p>
                <p className="text-2xl">{devices.filter(d => d.status === 'online').length}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Temperature</p>
                <p className="text-2xl">24.6°C</p>
              </div>
              <Thermometer className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Humidity</p>
                <p className="text-2xl">62.7%</p>
              </div>
              <Droplets className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data Points Today</p>
                <p className="text-2xl">1,247</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="download">Pi Images</TabsTrigger>
          <TabsTrigger value="nodes">ESP32 Nodes</TabsTrigger>
          <TabsTrigger value="metrics">Live Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Device Status */}
          <Card>
            <CardHeader>
              <CardTitle>Device Status</CardTitle>
              <CardDescription>Current status of all your IoT devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {devices.map(device => (
                  <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {device.type === 'pi' ? (
                          <Cpu className="w-5 h-5 text-green-600" />
                        ) : (
                          <Zap className="w-5 h-5 text-blue-600" />
                        )}
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-gray-500">Last seen: {device.lastSeen}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {device.metrics && (
                        <div className="flex space-x-4 text-sm">
                          {device.metrics.temperature && (
                            <span className="flex items-center space-x-1">
                              <Thermometer className="w-4 h-4" />
                              <span>{device.metrics.temperature}°C</span>
                            </span>
                          )}
                          {device.metrics.humidity && (
                            <span className="flex items-center space-x-1">
                              <Droplets className="w-4 h-4" />
                              <span>{device.metrics.humidity}%</span>
                            </span>
                          )}
                          {device.metrics.batteryLevel && (
                            <span className="flex items-center space-x-1">
                              <Zap className="w-4 h-4" />
                              <span>{device.metrics.batteryLevel}%</span>
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(device.status)}
                        <Badge variant={device.status === 'online' ? 'default' : 'secondary'}>
                          {device.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest events from your farm's IoT network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-500">2 min ago</span>
                  <span>Field A Sensor Hub reported soil moisture: 42%</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-500">5 min ago</span>
                  <span>Greenhouse Monitor temperature alert: 28.2°C</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-500">2 hours ago</span>
                  <span>Weather Station went offline - low battery (12%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="download" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Download Custom Pi Image</CardTitle>
              <CardDescription>
                Get a pre-configured Raspberry Pi image customized for {user.companyName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1686008674009-876c599f1fe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBzZW5zb3JzfGVufDF8fHx8MTc1NjU3NjA3MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Agricultural sensors"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg">FarmIoT Pi Image v2.1.3</h3>
                    <p className="text-gray-600">Latest stable release with Kafka integration</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Image Size:</span>
                      <span>3.2 GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Updated:</span>
                      <span>August 25, 2025</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Includes:</span>
                      <span>Kafka client, LoRa drivers, sensors</span>
                    </div>
                  </div>
                </div>
              </div>

              {isDownloading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Downloading...</span>
                    <span>{downloadProgress}%</span>
                  </div>
                  <Progress value={downloadProgress} />
                </div>
              )}

              <div className="flex space-x-4">
                <Button 
                  onClick={handleDownloadPiImage} 
                  disabled={isDownloading}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Downloading...' : 'Download Pi Image'}</span>
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Customize Image
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Configuration Details</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Pre-configured Kafka broker: kafka.{user.companyName.toLowerCase().replace(/\s+/g, '')}.farmiot.com</li>
                  <li>• Company ID: {user.id}</li>
                  <li>• LoRa frequency: 915 MHz (US) / 868 MHz (EU)</li>
                  <li>• Auto-discovery enabled for ESP32 nodes</li>
                  <li>• Secure TLS encryption for all communications</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nodes">
          <NodeManagement user={user} />
        </TabsContent>

        <TabsContent value="metrics">
          <MetricsChart />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;