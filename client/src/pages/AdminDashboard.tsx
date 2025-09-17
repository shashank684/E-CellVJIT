import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LogOut, Mail, Eye, MessageSquare, Trash2, PlusCircle, Calendar as CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertEventSchema } from '@shared/schema';
import type { ContactSubmission, Event, InsertEvent } from '@shared/schema';
import { z } from 'zod';

type EventFormData = z.input<typeof insertEventSchema>;

interface AdminDashboardProps {
  onLogout: () => void;
}

// API Functions
const fetchSubmissions = async (): Promise<ContactSubmission[]> => {
  const token = localStorage.getItem('admin-token');
  const response = await fetch('/api/admin/submissions', { headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) throw new Error('Failed to fetch submissions');
  return response.json();
};

const deleteSubmission = async (id: string) => {
  const token = localStorage.getItem('admin-token');
  const response = await fetch(`/api/admin/submissions/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) throw new Error('Failed to delete submission');
  return response.json();
};

const fetchEvents = async (): Promise<Event[]> => {
    const token = localStorage.getItem('admin-token');
    const response = await fetch('/api/events', { headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
};

const createEvent = async (newEvent: InsertEvent) => {
    const token = localStorage.getItem('admin-token');
    const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newEvent)
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
};

const deleteEvent = async (id: string) => {
    const token = localStorage.getItem('admin-token');
    const response = await fetch(`/api/admin/events/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) throw new Error('Failed to delete event');
    return response.json();
};


export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [submissionToDelete, setSubmissionToDelete] = useState<ContactSubmission | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions, isLoading: isLoadingSubmissions } = useQuery<ContactSubmission[]>({ queryKey: ['adminSubmissions'], queryFn: fetchSubmissions });
  const { data: events, isLoading: isLoadingEvents } = useQuery<Event[]>({ queryKey: ['adminEvents'], queryFn: fetchEvents });

  const deleteSubmissionMutation = useMutation({
    mutationFn: deleteSubmission,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Submission deleted successfully.' });
      queryClient.invalidateQueries({ queryKey: ['adminSubmissions'] });
    },
    onError: () => toast({ title: 'Error', description: 'Failed to delete submission.', variant: 'destructive' }),
    onSettled: () => setSubmissionToDelete(null),
  });

  const addEventForm = useForm<EventFormData>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      status: 'upcoming',
      registrationLink: '',
      summary: '',
      image: '/assets/events/default.jpg'
    }
  });
  const watchStatus = addEventForm.watch('status');

  const createEventMutation = useMutation({
      mutationFn: createEvent,
      onSuccess: () => {
          toast({ title: 'Success', description: 'Event created successfully.' });
          queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
          setIsAddEventOpen(false);
          addEventForm.reset();
      },
      onError: (e) => toast({ title: 'Error', description: `Failed to create event: ${e.message}`, variant: 'destructive' })
  });
  
  const deleteEventMutation = useMutation({
      mutationFn: deleteEvent,
      onSuccess: () => {
          toast({ title: 'Success', description: 'Event deleted successfully.' });
          queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      },
      onError: () => toast({ title: 'Error', description: 'Failed to delete event.', variant: 'destructive' }),
      onSettled: () => setEventToDelete(null),
  });

  const onAddEventSubmit: SubmitHandler<EventFormData> = (data) => {
      createEventMutation.mutate(data as unknown as InsertEvent);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      localStorage.removeItem('admin-token');
      toast({ title: 'Logged out successfully' });
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      toast({ title: 'Logout error', variant: 'destructive' });
    }
  };
  
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  if (isLoadingSubmissions || isLoadingEvents) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-card border-b border-card-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold" data-testid="admin-dashboard-title">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">E-Cell VJIT Management</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white" data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>
      
      <div className="p-6 grid lg:grid-cols-2 gap-8 items-start">
        <Card className="bg-card border-card-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Contact Form Submissions</h2>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {submissions && submissions.length > 0 ? (
              submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((submission) => (
                <motion.div key={submission.id} className="p-4 rounded-lg bg-background border border-input hover:border-primary/50 transition-colors duration-300 group" layout>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 cursor-pointer" onClick={() => setSelectedSubmission(submission)}>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-white">{submission.name}</h3>
                        <span className="text-sm text-gray-400">{submission.email}</span>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2">{submission.message}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs text-gray-500">{new Date(submission.createdAt).toLocaleString()}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => setSelectedSubmission(submission)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => setSubmissionToDelete(submission)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No contact submissions yet</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-card border-card-border p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Event Management</h2>
                </div>
                <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-primary/20 hover:border-primary/50 hover:text-white">
                            <PlusCircle className="w-4 h-4 mr-2" /> Add Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-card-border text-white">
                        <DialogHeader><DialogTitle>Add New Event</DialogTitle></DialogHeader>
                        <Form {...addEventForm}>
                            <form onSubmit={addEventForm.handleSubmit(onAddEventSubmit)} className="space-y-4">
                                <FormField name="title" control={addEventForm.control} render={({ field }) => (
                                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="date" control={addEventForm.control} render={({ field }) => (
                                    <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="description" control={addEventForm.control} render={({ field }) => (
                                    <FormItem><FormLabel>Short Description (for card)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="status" control={addEventForm.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="upcoming">Upcoming</SelectItem><SelectItem value="past">Past</SelectItem></SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                {watchStatus === 'upcoming' && (
                                    <FormField name="registrationLink" control={addEventForm.control} render={({ field }) => (
                                        <FormItem><FormLabel>Registration Link</FormLabel><FormControl><Input placeholder="https://forms.gle/..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                )}
                                {watchStatus === 'past' && (
                                     <FormField name="summary" control={addEventForm.control} render={({ field }) => (
                                         <FormItem><FormLabel>Detailed Summary (for pop-up)</FormLabel><FormControl><Textarea placeholder="Describe what happened at the event..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                                     )} />
                                )}
                                <Button type="submit" className="w-full" disabled={createEventMutation.isPending}>
                                  {createEventMutation.isPending ? 'Adding Event...' : 'Add Event'}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {events && events.length > 0 ? (
                    events.map((event) => (
                        <div key={event.id} className="p-3 rounded-lg bg-background flex items-center justify-between">
                           <div>
                                <p className="font-medium text-white">{event.title}</p>
                                <p className="text-xs text-gray-400">{formatDate(event.date)} - <span className={event.status === 'upcoming' ? 'text-green-400' : 'text-gray-500'}>{event.status}</span></p>
                           </div>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => setEventToDelete(event)}>
                               <Trash2 className="w-4 h-4" />
                           </Button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <CalendarIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No events found. Add one to get started.</p>
                    </div>
                )}
            </div>
        </Card>
      </div>
      
      {selectedSubmission && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedSubmission(null)}
        >
          <motion.div
            className="bg-card border border-card-border rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Contact Submission Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedSubmission(null)}> × </Button>
            </div>
            <div className="space-y-4">
              <div><label className="text-sm font-medium text-gray-400">Name</label><p>{selectedSubmission.name}</p></div>
              <div><label className="text-sm font-medium text-gray-400">Email</label><p>{selectedSubmission.email}</p></div>
              <div><label className="text-sm font-medium text-gray-400">Message</label><p className="whitespace-pre-wrap">{selectedSubmission.message}</p></div>
              <div><label className="text-sm font-medium text-gray-400">Submitted</label><p>{new Date(selectedSubmission.createdAt).toLocaleString()}</p></div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      <AlertDialog open={!!submissionToDelete} onOpenChange={() => setSubmissionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the submission from {submissionToDelete?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteSubmissionMutation.mutate(submissionToDelete!.id)} disabled={deleteSubmissionMutation.isPending}>
              {deleteSubmissionMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event "{eventToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteEventMutation.mutate(eventToDelete!.id)} disabled={deleteEventMutation.isPending}>
              {deleteEventMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}