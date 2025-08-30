import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  MoreVertical,
  Users,
  Activity,
  Database,
  Settings,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface User {
  id: string;
  email: string;
  companyName: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin: string;
  deviceCount: number;
  dataUsage: number; // MB
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'admin@farmiot.com',
      companyName: 'FarmIoT Admin',
      role: 'admin',
      status: 'active',
      createdAt: '2025-01-15',
      lastLogin: '2025-08-30 14:30',
      deviceCount: 0,
      dataUsage: 45.2
    },
    {
      id: '2',
      email: 'john@greenvalley.com',
      companyName: 'Green Valley Farms',
      role: 'user',
      status: 'active',
      createdAt: '2025-03-22',
      lastLogin: '2025-08-30 09:15',
      deviceCount: 5,
      dataUsage: 234.7
    },
    {
      id: '3',
      email: 'sarah@sunshinefarm.com',
      companyName: 'Sunshine Organic Farm',
      role: 'user',
      status: 'active',
      createdAt: '2025-05-10',
      lastLogin: '2025-08-29 16:45',
      deviceCount: 3,
      dataUsage: 156.3
    },
    {
      id: '4',
      email: 'mike@techagriculture.com',
      companyName: 'Tech Agriculture Solutions',
      role: 'user',
      status: 'pending',
      createdAt: '2025-08-28',
      lastLogin: 'Never',
      deviceCount: 0,
      dataUsage: 0
    },
    {
      id: '5',
      email: 'lisa@smartcrop.com',
      companyName: 'SmartCrop Industries',
      role: 'user',
      status: 'inactive',
      createdAt: '2025-02-14',
      lastLogin: '2025-07-15 11:20',
      deviceCount: 8,
      dataUsage: 1247.8
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    companyName: '',
    role: 'user' as 'user' | 'admin'
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <AlertTriangle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleAddUser = () => {
    const user: User = {
      id: Date.now().toString(),
      email: newUser.email,
      companyName: newUser.companyName,
      role: newUser.role,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
      deviceCount: 0,
      dataUsage: 0
    };
    
    setUsers([...users, user]);
    setNewUser({ email: '', companyName: '', role: 'user' });
    setIsAddingUser(false);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' as const }
        : user
    ));
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalDevices = users.reduce((sum, u) => sum + u.deviceCount, 0);
  const totalDataUsage = users.reduce((sum, u) => sum + u.dataUsage, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl">Admin Panel</h2>
          <p className="text-gray-600">Manage users, monitor system usage, and configure settings</p>
        </div>
        <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account for the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="user@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-company">Company Name</Label>
                <Input
                  id="user-company"
                  value={newUser.companyName}
                  onChange={(e) => setNewUser({ ...newUser, companyName: e.target.value })}
                  placeholder="Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newUser.role} onValueChange={(value: 'user' | 'admin') => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingUser(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser} disabled={!newUser.email || !newUser.companyName}>
                  Add User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl">{activeUsers}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Devices</p>
                <p className="text-2xl">{totalDevices}</p>
              </div>
              <Database className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data Usage</p>
                <p className="text-2xl">{(totalDataUsage / 1024).toFixed(1)} GB</p>
              </div>
              <Upload className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Data Usage</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-gray-500">ID: {user.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>{user.companyName}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(user.status)}
                          <span>{user.status}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>{user.deviceCount}</TableCell>
                    <TableCell>{user.dataUsage.toFixed(1)} MB</TableCell>
                    <TableCell>
                      <span className="text-sm">{user.lastLogin}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                            <Settings className="w-4 h-4 mr-2" />
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Platform-wide settings and configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>User Registration</span>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Auto Device Discovery</span>
              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Data Retention</span>
              <Badge variant="secondary">90 days</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Kafka Cluster</span>
              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
            </div>
            <Button className="w-full" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configure Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest admin actions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-500">5 min ago</span>
                <span>User mike@techagriculture.com registered</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-500">1 hour ago</span>
                <span>Pi image downloaded by Green Valley Farms</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-500">2 hours ago</span>
                <span>Kafka topic created for SmartCrop Industries</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-500">1 day ago</span>
                <span>System backup completed successfully</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;