import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Plus, 
  Zap, 
  Upload, 
  Settings, 
  Trash2, 
  Download,
  Wifi,
  Battery,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface User {
  id: string;
  email: string;
  companyName: string;
  role: 'user' | 'admin';
}

interface ESP32Node {
  id: string;
  name: string;
  macAddress: string;
  firmwareVersion: string;
  batteryLevel: number;
  signalStrength: number;
  location: string;
  sensorTypes: string[];
  status: 'online' | 'offline' | 'flashing' | 'configuring';
  lastSeen: string;
}

interface NodeManagementProps {
  user: User;
}

const NodeManagement: React.FC<NodeManagementProps> = ({ user }) => {
  const [nodes, setNodes] = useState<ESP32Node[]>([
    {
      id: '1',
      name: 'Greenhouse Sensor Alpha',
      macAddress: 'AA:BB:CC:DD:EE:01',
      firmwareVersion: 'v1.2.3',
      batteryLevel: 87,
      signalStrength: -45,
      location: 'Greenhouse Section A',
      sensorTypes: ['Temperature', 'Humidity', 'Light'],
      status: 'online',
      lastSeen: '2 minutes ago'
    },
    {
      id: '2',
      name: 'Field Moisture Monitor',
      macAddress: 'AA:BB:CC:DD:EE:02',
      firmwareVersion: 'v1.2.1',
      batteryLevel: 12,
      signalStrength: -67,
      location: 'Field A, Zone 3',
      sensorTypes: ['Soil Moisture', 'pH', 'Temperature'],
      status: 'offline',
      lastSeen: '3 hours ago'
    },
    {
      id: '3',
      name: 'Weather Station Node',
      macAddress: 'AA:BB:CC:DD:EE:03',
      firmwareVersion: 'v1.2.3',
      batteryLevel: 64,
      signalStrength: -52,
      location: 'Central Weather Station',
      sensorTypes: ['Wind Speed', 'Temperature', 'Humidity', 'Pressure'],
      status: 'online',
      lastSeen: '1 minute ago'
    }
  ]);

  const [isAddingNode, setIsAddingNode] = useState(false);
  const [flashingProgress, setFlashingProgress] = useState<{ [key: string]: number }>({});
  const [newNode, setNewNode] = useState({
    name: '',
    location: '',
    sensorTypes: [] as string[]
  });

  const handleFlashNode = (nodeId: string) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, status: 'flashing' as const } : node
    ));
    
    setFlashingProgress({ ...flashingProgress, [nodeId]: 0 });
    
    // Simulate flashing progress
    const interval = setInterval(() => {
      setFlashingProgress(prev => {
        const currentProgress = prev[nodeId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          setNodes(nodes.map(node => 
            node.id === nodeId ? { 
              ...node, 
              status: 'online' as const,
              firmwareVersion: 'v1.2.3',
              lastSeen: 'Just now'
            } : node
          ));
          return prev;
        }
        return { ...prev, [nodeId]: currentProgress + 10 };
      });
    }, 300);
  };

  const handleAddNode = () => {
    const node: ESP32Node = {
      id: Date.now().toString(),
      name: newNode.name,
      macAddress: `AA:BB:CC:DD:EE:${(nodes.length + 1).toString().padStart(2, '0')}`,
      firmwareVersion: 'v1.2.3',
      batteryLevel: 100,
      signalStrength: -40,
      location: newNode.location,
      sensorTypes: newNode.sensorTypes,
      status: 'configuring',
      lastSeen: 'Configuring...'
    };
    
    setNodes([...nodes, node]);
    setNewNode({ name: '', location: '', sensorTypes: [] });
    setIsAddingNode(false);
    
    // Simulate configuration
    setTimeout(() => {
      setNodes(prev => prev.map(n => 
        n.id === node.id ? { ...n, status: 'online' as const, lastSeen: 'Just now' } : n
      ));
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'flashing': return 'text-yellow-600 bg-yellow-100';
      case 'configuring': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSignalIcon = (strength: number) => {
    if (strength > -50) return 'text-green-500';
    if (strength > -70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-500';
    if (level > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl">ESP32 Node Management</h2>
          <p className="text-gray-600">Flash firmware and manage your ESP32 LoRa sensor nodes</p>
        </div>
        <Dialog open={isAddingNode} onOpenChange={setIsAddingNode}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Node
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New ESP32 Node</DialogTitle>
              <DialogDescription>
                Configure a new ESP32 sensor node for your farm
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="node-name">Node Name</Label>
                <Input
                  id="node-name"
                  value={newNode.name}
                  onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
                  placeholder="e.g., Greenhouse Temperature Monitor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="node-location">Location</Label>
                <Input
                  id="node-location"
                  value={newNode.location}
                  onChange={(e) => setNewNode({ ...newNode, location: e.target.value })}
                  placeholder="e.g., Field A, Section 2"
                />
              </div>
              <div className="space-y-2">
                <Label>Sensor Type</Label>
                <Select value={newNode.sensorTypes[0] || ''} onValueChange={(value) => setNewNode({ ...newNode, sensorTypes: [value] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sensor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="humidity">Humidity</SelectItem>
                    <SelectItem value="soil-moisture">Soil Moisture</SelectItem>
                    <SelectItem value="ph">pH Level</SelectItem>
                    <SelectItem value="light">Light Intensity</SelectItem>
                    <SelectItem value="wind">Wind Speed</SelectItem>
                    <SelectItem value="pressure">Atmospheric Pressure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingNode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddNode} disabled={!newNode.name || !newNode.location}>
                  Add Node
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Firmware Download Section */}
      <Card>
        <CardHeader>
          <CardTitle>ESP32 Firmware</CardTitle>
          <CardDescription>Download the latest firmware for your ESP32 nodes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg">FarmIoT ESP32 Firmware v1.2.3</h3>
                <p className="text-gray-600">Latest stable release with LoRa improvements</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>File Size:</span>
                  <span>1.2 MB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Release Date:</span>
                  <span>August 28, 2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Supported Sensors:</span>
                  <span>12 types</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">New in v1.2.3</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Improved LoRa range (+20%)</li>
                  <li>• Better battery optimization</li>
                  <li>• New sensor calibration tools</li>
                  <li>• Enhanced security protocols</li>
                </ul>
              </div>
              <Button className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Firmware
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Node List */}
      <div className="grid grid-cols-1 gap-6">
        {nodes.map(node => (
          <Card key={node.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span>{node.name}</span>
                    <Badge className={getStatusColor(node.status)}>
                      {node.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{node.location}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFlashNode(node.id)}
                    disabled={node.status === 'flashing'}
                  >
                    {node.status === 'flashing' ? (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Flashing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Flash
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {node.status === 'flashing' && flashingProgress[node.id] !== undefined && (
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Flashing firmware...</span>
                    <span>{flashingProgress[node.id]}%</span>
                  </div>
                  <Progress value={flashingProgress[node.id]} />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">MAC Address</p>
                  <p className="font-mono text-sm">{node.macAddress}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Firmware</p>
                  <p className="text-sm">{node.firmwareVersion}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Battery</p>
                  <div className="flex items-center space-x-2">
                    <Battery className={`w-4 h-4 ${getBatteryColor(node.batteryLevel)}`} />
                    <span className="text-sm">{node.batteryLevel}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Signal</p>
                  <div className="flex items-center space-x-2">
                    <Wifi className={`w-4 h-4 ${getSignalIcon(node.signalStrength)}`} />
                    <span className="text-sm">{node.signalStrength} dBm</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Sensors</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {node.sensorTypes.map(sensor => (
                        <Badge key={sensor} variant="secondary" className="text-xs">
                          {sensor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Last Seen</p>
                    <p className="text-sm">{node.lastSeen}</p>
                  </div>
                </div>
              </div>

              {node.batteryLevel < 20 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 text-sm">Low battery warning - {node.batteryLevel}% remaining</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NodeManagement;