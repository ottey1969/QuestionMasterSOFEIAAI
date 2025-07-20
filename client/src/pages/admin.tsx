import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Settings, Plus, Users, Eye } from "lucide-react";

interface IpCredit {
  id: string;
  ipAddress: string;
  email?: string;
  credits: number;
  isUnlimited: boolean;
  lastUsed: string;
  createdAt: string;
}

export default function AdminPanel() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ipCredits, setIpCredits] = useState<IpCredit[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Add credits form
  const [newIpAddress, setNewIpAddress] = useState("");
  const [newCredits, setNewCredits] = useState("");
  const [newEmail, setNewEmail] = useState("");
  
  const { toast } = useToast();

  const checkAdminAuth = async (key: string) => {
    try {
      const response = await fetch(`/api/admin/credits/list?adminKey=${key}`);
      if (response.ok) {
        const data = await response.json();
        setIpCredits(data);
        setIsAuthenticated(true);
        toast({
          title: "Admin Access Granted",
          description: "Successfully authenticated as admin",
        });
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid admin key",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to authenticate",
        variant: "destructive",
      });
    }
  };

  const loadIpCredits = async () => {
    if (!adminKey) return;
    
    try {
      const response = await fetch(`/api/admin/credits/list?adminKey=${adminKey}`);
      if (response.ok) {
        const data = await response.json();
        setIpCredits(data);
      }
    } catch (error) {
      console.error('Failed to load IP credits:', error);
    }
  };

  const addCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpAddress || !newCredits || !adminKey) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/admin/credits/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ipAddress: newIpAddress,
          credits: parseInt(newCredits),
          email: newEmail || undefined,
          adminKey
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Credits Added",
          description: data.message,
        });
        setNewIpAddress("");
        setNewCredits("");
        setNewEmail("");
        loadIpCredits();
      } else {
        const error = await response.json();
        toast({
          title: "Failed to Add Credits",
          description: error.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add credits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUnlimited = async (ipAddress: string, isCurrentlyUnlimited: boolean) => {
    try {
      const response = await fetch('/api/admin/credits/unlimited', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ipAddress,
          unlimited: !isCurrentlyUnlimited,
          adminKey
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Updated",
          description: data.message,
        });
        loadIpCredits();
      } else {
        const error = await response.json();
        toast({
          title: "Failed to Update",
          description: error.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update unlimited status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadIpCredits();
      const interval = setInterval(loadIpCredits, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, adminKey]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-blue-600" />
              <CardTitle>Admin Access</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              checkAdminAuth(adminKey);
            }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="adminKey">Admin Key</Label>
                  <Input
                    id="adminKey"
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter admin key"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Access Admin Panel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Sofeia AI Admin Panel</h1>
            </div>
            <Badge variant="secondary">
              <Users className="h-4 w-4 mr-1" />
              {ipCredits.length} IP Addresses
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Add Credits Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              <CardTitle>Add Credits to IP Address</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={addCredits} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="ipAddress">IP Address</Label>
                <Input
                  id="ipAddress"
                  value={newIpAddress}
                  onChange={(e) => setNewIpAddress(e.target.value)}
                  placeholder="192.168.1.100"
                  required
                />
              </div>
              <div>
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  value={newCredits}
                  onChange={(e) => setNewCredits(e.target.value)}
                  placeholder="10"
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Adding..." : "Add Credits"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* IP Credits List */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <CardTitle>IP Credits Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {ipCredits.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No IP addresses tracked yet</p>
            ) : (
              <div className="space-y-3">
                {ipCredits.map((ipCredit) => (
                  <div key={ipCredit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-medium">{ipCredit.ipAddress}</span>
                        {ipCredit.isUnlimited && (
                          <Badge className="bg-green-100 text-green-800">Unlimited</Badge>
                        )}
                      </div>
                      {ipCredit.email && (
                        <p className="text-sm text-gray-600">{ipCredit.email}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Last used: {new Date(ipCredit.lastUsed).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {ipCredit.isUnlimited ? "∞" : ipCredit.credits}
                        </div>
                        <div className="text-xs text-gray-500">credits</div>
                      </div>
                      <Button
                        size="sm"
                        variant={ipCredit.isUnlimited ? "destructive" : "default"}
                        onClick={() => toggleUnlimited(ipCredit.ipAddress, ipCredit.isUnlimited)}
                      >
                        {ipCredit.isUnlimited ? "Make Limited" : "Make Unlimited"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}