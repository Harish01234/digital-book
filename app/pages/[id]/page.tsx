'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Edit, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

export default function PageDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [page, setPage] = useState<IPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchNo, setSearchNo] = useState('');
  const [editingEntry, setEditingEntry] = useState<IEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    no: '',
    money: '',
    interest: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchPage();
  }, [params.id]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/pages/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setPage(data.data);
      } else {
        toast.error('Failed to fetch page');
        router.push('/');
      }
    } catch (error) {
      toast.error('Error fetching page');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.no || !newEntry.money) {
      toast.error('No and Money are required');
      return;
    }

    try {
      const res = await fetch(`/api/pages/${params.id}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          no: Number(newEntry.no),
          money: Number(newEntry.money),
          interest: newEntry.interest ? Number(newEntry.interest) : 0,
          date: newEntry.date,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Entry added successfully');
        setPage(data.data);
        setNewEntry({ no: '', money: '', interest: '', date: new Date().toISOString().split('T')[0] });
        setIsAddDialogOpen(false);
      } else {
        toast.error(data.error || 'Failed to add entry');
      }
    } catch (error) {
      toast.error('Error adding entry');
    }
  };

  const handleUpdateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    try {
      const res = await fetch(`/api/pages/${params.id}/entries`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entryId: editingEntry._id,
          no: editingEntry.no,
          money: editingEntry.money,
          interest: editingEntry.interest || 0,
          date: editingEntry.date,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Entry updated successfully');
        setPage(data.data);
        setEditingEntry(null);
        setIsEditDialogOpen(false);
      } else {
        toast.error(data.error || 'Failed to update entry');
      }
    } catch (error) {
      toast.error('Error updating entry');
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const res = await fetch(`/api/pages/${params.id}/entries?entryId=${entryId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Entry deleted successfully');
        setPage(data.data);
      } else {
        toast.error(data.error || 'Failed to delete entry');
      }
    } catch (error) {
      toast.error('Error deleting entry');
    }
  };

  const openEditDialog = (entry: IEntry) => {
    setEditingEntry({ ...entry });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  const filteredEntries = searchNo
    ? page.entries.filter((entry) => entry.no.toString().includes(searchNo))
    : page.entries;

  const sumMoney = page.entries.reduce((acc, entry) => acc + entry.money, 0);
  const sumInterest = page.entries.reduce((acc, entry) => acc + (entry.interest || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.push('/')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
            <p className="text-gray-600 mt-1 capitalize">Type: {page.type}</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddEntry} className="space-y-4">
                <div>
                  <Label htmlFor="no">No</Label>
                  <Input
                    id="no"
                    type="number"
                    value={newEntry.no}
                    onChange={(e) => setNewEntry({ ...newEntry, no: e.target.value })}
                    placeholder="Enter number"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="money">Money</Label>
                  <Input
                    id="money"
                    type="number"
                    value={newEntry.money}
                    onChange={(e) => setNewEntry({ ...newEntry, money: e.target.value })}
                    placeholder="Enter money amount"
                    className="mt-1"
                  />
                </div>
                {page.type === 'neoya' && (
                  <div>
                    <Label htmlFor="interest">Interest</Label>
                    <Input
                      id="interest"
                      type="number"
                      value={newEntry.interest}
                      onChange={(e) => setNewEntry({ ...newEntry, interest: e.target.value })}
                      placeholder="Enter interest"
                      className="mt-1"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Add Entry
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{page.entries.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-900">Sum Money</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">{sumMoney.toLocaleString()}</p>
            </CardContent>
          </Card>
          {page.type === 'neoya' && (
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-900">Sum Interest</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">{sumInterest.toLocaleString()}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Entries</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by number..."
                  value={searchNo}
                  onChange={(e) => setSearchNo(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredEntries.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No entries found</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Money</TableHead>
                      {page.type === 'neoya' && <TableHead>Interest</TableHead>}
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow key={entry._id}>
                        <TableCell className="font-medium">{entry.no}</TableCell>
                        <TableCell>{entry.money.toLocaleString()}</TableCell>
                        {page.type === 'neoya' && <TableCell>{(entry.interest || 0).toLocaleString()}</TableCell>}
                        <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(entry)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEntry(entry._id)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Entry</DialogTitle>
            </DialogHeader>
            {editingEntry && (
              <form onSubmit={handleUpdateEntry} className="space-y-4">
                <div>
                  <Label htmlFor="edit-no">No</Label>
                  <Input
                    id="edit-no"
                    type="number"
                    value={editingEntry.no}
                    onChange={(e) => setEditingEntry({ ...editingEntry, no: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-money">Money</Label>
                  <Input
                    id="edit-money"
                    type="number"
                    value={editingEntry.money}
                    onChange={(e) => setEditingEntry({ ...editingEntry, money: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                {page.type === 'neoya' && (
                  <div>
                    <Label htmlFor="edit-interest">Interest</Label>
                    <Input
                      id="edit-interest"
                      type="number"
                      value={editingEntry.interest || 0}
                      onChange={(e) => setEditingEntry({ ...editingEntry, interest: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={new Date(editingEntry.date).toISOString().split('T')[0]}
                    onChange={(e) => setEditingEntry({ ...editingEntry, date: new Date(e.target.value) as any })}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Update Entry
                </Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
