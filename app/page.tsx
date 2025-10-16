'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast, { Toaster } from 'react-hot-toast';

interface IEntry {
  _id: string;
  no: number;
  money: number;
  interest?: number;
  date: Date;
}

interface IPage {
  _id: string;
  title: string;
  type: 'deoya' | 'neoya';
  entries: IEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export default function Dashboard() {
  const router = useRouter();
  const [pages, setPages] = useState<IPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', type: 'deoya' as 'deoya' | 'neoya' });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      if (data.success) {
        setPages(data.data);
      } else {
        toast.error('Failed to fetch pages');
      }
    } catch (error) {
      toast.error('Error fetching pages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPage.title.trim()) {
      toast.error('Page title is required');
      return;
    }

    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPage),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Page created successfully');
        setPages([data.data, ...pages]);
        setNewPage({ title: '', type: 'deoya' });
        setIsDialogOpen(false);
      } else {
        toast.error(data.error || 'Failed to create page');
      }
    } catch (error) {
      toast.error('Error creating page');
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Page deleted successfully');
        setPages(pages.filter((p) => p._id !== id));
      } else {
        toast.error(data.error || 'Failed to delete page');
      }
    } catch (error) {
      toast.error('Error deleting page');
    }
  };

  const calculateSums = (page: IPage) => {
    const sumMoney = page.entries.reduce((acc, entry) => acc + entry.money, 0);
    const sumInterest = page.entries.reduce((acc, entry) => acc + (entry.interest || 0), 0);
    return { sumMoney, sumInterest };
  };

  const deoyaPages = pages.filter((p) => p.type === 'deoya');
  const neoyaPages = pages.filter((p) => p.type === 'neoya');

  const totalDeoya = deoyaPages.reduce((acc, page) => {
    return acc + page.entries.reduce((sum, entry) => sum + entry.money, 0);
  }, 0);

  const totalNeoya = neoyaPages.reduce((acc, page) => {
    return acc + page.entries.reduce((sum, entry) => sum + entry.money, 0);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your pages and entries</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> New Page
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Page</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreatePage} className="space-y-4">
                <div>
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={newPage.title}
                    onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                    placeholder="Enter page title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Page Type</Label>
                  <Select
                    value={newPage.type}
                    onValueChange={(value: 'deoya' | 'neoya') => setNewPage({ ...newPage, type: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deoya">Deoya</SelectItem>
                      <SelectItem value="neoya">Neoya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Create Page
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Total Deoya</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{totalDeoya.toLocaleString()}</p>
              <p className="text-sm text-blue-700 mt-1">{deoyaPages.length} pages</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-900">Total Neoya</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">{totalNeoya.toLocaleString()}</p>
              <p className="text-sm text-emerald-700 mt-1">{neoyaPages.length} pages</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
              Deoya Pages
            </h2>
            {deoyaPages.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  No deoya pages yet. Create one to get started.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deoyaPages.map((page) => {
                  const { sumMoney } = calculateSums(page);
                  return (
                    <Card
                      key={page._id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => router.push(`/pages/${page._id}`)}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-600" />
                          {page.title}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePage(page._id);
                          }}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">{page.entries.length} entries</p>
                          <p className="text-2xl font-bold text-blue-600">{sumMoney.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Total Money</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-3 h-3 bg-emerald-600 rounded-full mr-2"></span>
              Neoya Pages
            </h2>
            {neoyaPages.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  No neoya pages yet. Create one to get started.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {neoyaPages.map((page) => {
                  const { sumMoney, sumInterest } = calculateSums(page);
                  return (
                    <Card
                      key={page._id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => router.push(`/pages/${page._id}`)}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-emerald-600" />
                          {page.title}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePage(page._id);
                          }}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">{page.entries.length} entries</p>
                          <p className="text-2xl font-bold text-emerald-600">{sumMoney.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Total Money</p>
                          <p className="text-lg font-semibold text-emerald-700">{sumInterest.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Total Interest</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
