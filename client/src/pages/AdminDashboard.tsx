import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogOut, Mail, Eye, MessageSquare, Trash2, PlusCircle, Calendar as CalendarIcon, Users, Star, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertEventSchema, insertTeamMemberSchema } from '@shared/schema';
import type { ContactSubmission, Event, TeamMember } from '@shared/schema';
import { z } from 'zod';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Logo } from '@/components/Logo';

// --- Zod Schemas for Forms ---
type EventFormData = z.input<typeof insertEventSchema>;
const teamMemberFormSchema = insertTeamMemberSchema.omit({ imageUrl: true }).extend({ photo: z.any().optional() });
type TeamMemberFormData = z.infer<typeof teamMemberFormSchema>;

interface AdminDashboardProps {
  onLogout: () => void;
}

// --- API Functions ---
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('admin-token');
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

const fetchSubmissions = () => apiRequest('/api/admin/submissions');
const deleteSubmission = (id: string) => apiRequest(`/api/admin/submissions/${id}`, { method: 'DELETE' });
const fetchEvents = () => apiRequest('/api/events');
const createEvent = (newEvent: EventFormData) => apiRequest('/api/admin/events', { method: 'POST', body: JSON.stringify(newEvent) });
const updateEvent = (id: string, eventData: Partial<EventFormData>) => apiRequest(`/api/admin/events/${id}`, { method: 'PUT', body: JSON.stringify(eventData) });
const deleteEvent = (id: string) => apiRequest(`/api/admin/events/${id}`, { method: 'DELETE' });
const fetchAdminTeamMembers = () => apiRequest('/api/admin/team');
const deleteTeamMember = (id: string) => apiRequest(`/api/admin/team/${id}`, { method: 'DELETE' });

const createTeamMember = async (data: TeamMemberFormData & { photo?: File }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key !== 'photo' && value !== null && value !== undefined) {
            formData.append(key, String(value));
        }
    });
    if (data.photo) {
        formData.append('photo', data.photo);
    }
    return apiRequest('/api/admin/team', { method: 'POST', body: formData });
};

const updateTeamMember = (id: string, data: Partial<TeamMemberFormData>) => apiRequest(`/api/admin/team/${id}`, { method: 'PUT', body: JSON.stringify(data) });

// --- Main Component ---
export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [submissionToDelete, setSubmissionToDelete] = useState<ContactSubmission | null>(null);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // --- Queries ---
  const { data: submissions, isLoading: isLoadingSubmissions } = useQuery<ContactSubmission[]>({ queryKey: ['adminSubmissions'], queryFn: fetchSubmissions });
  const { data: events, isLoading: isLoadingEvents } = useQuery<Event[]>({ queryKey: ['adminEvents'], queryFn: fetchEvents });
  const { data: teamMembers, isLoading: isLoadingTeam } = useQuery<TeamMember[]>({ queryKey: ['adminTeam'], queryFn: fetchAdminTeamMembers });
  
  // --- Mutations ---
  const genericMutationOptions = (queryKey: string, successMessage: string, errorMessage: string) => ({
    onSuccess: () => {
      toast({ title: 'Success', description: successMessage });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (e: Error) => toast({ title: 'Error', description: `${errorMessage}: ${e.message}`, variant: 'destructive' as 'destructive' }),
  });

  const deleteSubmissionMutation = useMutation({
      mutationFn: deleteSubmission, ...genericMutationOptions('adminSubmissions', 'Submission deleted.', 'Failed to delete submission.'), onSettled: () => setSubmissionToDelete(null)
  });
  const createEventMutation = useMutation({
      mutationFn: createEvent, ...genericMutationOptions('adminEvents', 'Event created.', 'Failed to create event.'), onSettled: () => setIsEventModalOpen(false)
  });
   const updateEventMutation = useMutation({
      mutationFn: ({ id, data }: { id: string, data: Partial<EventFormData> }) => updateEvent(id, data),
    ...genericMutationOptions('adminEvents', 'Event updated.', 'Failed to update event.'), onSettled: () => setEventToEdit(null)
  });
  const deleteEventMutation = useMutation({
      mutationFn: deleteEvent, ...genericMutationOptions('adminEvents', 'Event deleted.', 'Failed to delete event.'), onSettled: () => setEventToDelete(null)
  });
  const createTeamMemberMutation = useMutation({
      mutationFn: createTeamMember, ...genericMutationOptions('adminTeam', 'Team member added.', 'Failed to add team member.'), onSettled: () => setIsAddMemberOpen(false)
  });
  const deleteTeamMemberMutation = useMutation({
      mutationFn: deleteTeamMember, ...genericMutationOptions('adminTeam', 'Team member deleted.', 'Failed to delete team member.'), onSettled: () => setMemberToDelete(null)
  });
  const updateTeamMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<TeamMemberFormData> }) => updateTeamMember(id, data),
    ...genericMutationOptions('adminTeam', 'Member updated.', 'Failed to update member.')
  });

  // --- Forms ---
  const eventForm = useForm<EventFormData>({ resolver: zodResolver(insertEventSchema), defaultValues: { title: '', description: '', date: new Date().toISOString().split('T')[0], status: 'upcoming', registrationLink: '', summary: '', image: '/assets/events/default.jpg' } });
  const addMemberForm = useForm<TeamMemberFormData>({ resolver: zodResolver(teamMemberFormSchema), defaultValues: { name: '', role: '', instagram: '', linkedin: '', isFeatured: false, displayOrder: 0 } });
  
  useEffect(() => {
    if (eventToEdit) {
        eventForm.reset({
            ...eventToEdit,
            date: new Date(eventToEdit.date).toISOString().split('T')[0] // Format date for input
        });
    } else {
        eventForm.reset({ title: '', description: '', date: new Date().toISOString().split('T')[0], status: 'upcoming', registrationLink: '', summary: '', image: '/assets/events/default.jpg' });
    }
  }, [eventToEdit, isEventModalOpen, eventForm]);


  const onEventSubmit: SubmitHandler<EventFormData> = data => {
      if (eventToEdit) {
          updateEventMutation.mutate({ id: eventToEdit.id, data });
      } else {
          createEventMutation.mutate(data);
      }
  };
  const onAddMemberSubmit: SubmitHandler<TeamMemberFormData> = data => {
      const file = (document.getElementById('photo-upload') as HTMLInputElement)?.files?.[0];
      createTeamMemberMutation.mutate({ ...data, photo: file });
  };
  
  const handleToggleFeature = (member: TeamMember) => {
    updateTeamMemberMutation.mutate({ id: member.id, data: { isFeatured: !member.isFeatured }});
  }

  // --- Handlers ---
  const handleLogout = async () => {
      try {
        await apiRequest('/api/admin/logout', { method: 'POST' });
        localStorage.removeItem('admin-token');
        toast({ title: 'Logged out successfully' });
        onLogout();
      } catch (error) {
        console.error('Logout error:', error);
        toast({ title: 'Logout error', variant: 'destructive' });
      }
  };
  
  const formatDate = (dateString: string | Date) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (isLoadingSubmissions || isLoadingEvents || isLoadingTeam) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-2 md:p-6 lg:p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <Logo className="w-12 h-12"/>
            <div>
              <h1 className="text-2xl font-bold text-white" data-testid="admin-dashboard-title">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">E-Cell VJIT Management</p>
            </div>
        </div>
        <Button onClick={handleLogout} variant="outline" className="border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white" data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>
      
      <Tabs defaultValue="team" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-card-border mb-6">
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        
        {/* Team Management Tab */}
        <TabsContent value="team">
            <Card className="bg-card border-card-border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="space-y-1.5">
                        <CardTitle className="flex items-center gap-2"><Users className="w-6 h-6 text-primary" />Team Management</CardTitle>
                    </div>
                    <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                        <DialogTrigger asChild>
                            <Button><PlusCircle className="w-4 h-4 mr-2" /> Add Member</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-card-border text-white">
                            <DialogHeader><DialogTitle>Add New Team Member</DialogTitle></DialogHeader>
                            <Form {...addMemberForm}><form onSubmit={addMemberForm.handleSubmit(onAddMemberSubmit)} className="space-y-4"><FormField name="name" control={addMemberForm.control} render={({ field }) => ( <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} /><FormField name="role" control={addMemberForm.control} render={({ field }) => ( <FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} /><FormField name="instagram" control={addMemberForm.control} render={({ field }) => ( <FormItem><FormLabel>Instagram URL</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} /><FormField name="linkedin" control={addMemberForm.control} render={({ field }) => ( <FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} /><FormField name="displayOrder" control={addMemberForm.control} render={({ field }) => ( <FormItem><FormLabel>Display Order</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} /></FormControl><FormMessage /></FormItem> )} /><FormField name="isFeatured" control={addMemberForm.control} render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><FormLabel>Feature on homepage</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem> )} /><FormItem><FormLabel>Photo</FormLabel><FormControl><Input id="photo-upload" type="file" accept="image/*" className="bg-background" /></FormControl><FormMessage /></FormItem><Button type="submit" className="w-full" disabled={createTeamMemberMutation.isPending}>{createTeamMemberMutation.isPending ? 'Adding...' : 'Add Member'}</Button></form></Form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead>Member</TableHead><TableHead className="hidden md:table-cell">Role</TableHead><TableHead>Featured</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamMembers?.map(member => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <img src={member.imageUrl} alt={member.name} className="w-10 h-10 rounded-full object-cover"/>
                                            <span className="font-medium">{member.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-gray-400">{member.role}</TableCell>
                                    <TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleFeature(member)} title="Toggle Featured"><Star className={`w-4 h-4 ${member.isFeatured ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} /></Button></TableCell>
                                    <TableCell className="text-right"><Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500" onClick={() => setMemberToDelete(member)}><Trash2 className="w-4 h-4" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions">
             <Card className="bg-card border-card-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquare className="w-6 h-6 text-primary" /> Contact Form Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead>From</TableHead><TableHead className="hidden md:table-cell">Message</TableHead><TableHead className="hidden sm:table-cell">Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(submission => (
                                <TableRow key={submission.id}>
                                    <TableCell><div className="font-medium">{submission.name}</div><div className="text-sm text-gray-400">{submission.email}</div></TableCell>
                                    <TableCell className="hidden md:table-cell"><p className="text-sm text-gray-300 line-clamp-2">{submission.message}</p></TableCell>
                                    <TableCell className="hidden sm:table-cell text-gray-400">{formatDate(submission.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedSubmission(submission)}><Eye className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500" onClick={() => setSubmissionToDelete(submission)}><Trash2 className="w-4 h-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
            <Card className="bg-card border-card-border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><CalendarIcon className="w-6 h-6 text-primary" /> Event Management</CardTitle>
                    <Button onClick={() => { setEventToEdit(null); setIsEventModalOpen(true); }}><PlusCircle className="w-4 h-4 mr-2" /> Add Event</Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead>Event Title</TableHead><TableHead className="hidden sm:table-cell">Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                             {events?.map(event => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.title}</TableCell>
                                    <TableCell className="hidden sm:table-cell text-gray-400">{formatDate(event.date)}</TableCell>
                                    <TableCell><span className={`px-2 py-1 text-xs rounded-full ${event.status === 'upcoming' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{event.status}</span></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-white" onClick={() => { setEventToEdit(event); setIsEventModalOpen(true); }}><Edit className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500" onClick={() => setEventToDelete(event)}><Trash2 className="w-4 h-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modals and Dialogs */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="bg-card border-card-border text-white">
            <DialogHeader><DialogTitle>{eventToEdit ? 'Edit Event' : 'Add New Event'}</DialogTitle></DialogHeader>
            <Form {...eventForm}><form onSubmit={eventForm.handleSubmit(onEventSubmit)} className="space-y-4"><FormField name="title" control={eventForm.control} render={({ field }) => ( <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} /><FormField name="date" control={eventForm.control} render={({ field }) => ( <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} /><FormField name="description" control={eventForm.control} render={({ field }) => ( <FormItem><FormLabel>Short Description (for card)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} /><FormField name="summary" control={eventForm.control} render={({ field }) => ( <FormItem><FormLabel>Detailed Summary (for "Know More" popup)</FormLabel><FormControl><Textarea {...field} value={field.value ?? ''} rows={5} /></FormControl><FormMessage /></FormItem> )} /><FormField name="status" control={eventForm.control} render={({ field }) => ( <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="upcoming">Upcoming</SelectItem><SelectItem value="past">Past</SelectItem></SelectContent></Select><FormMessage /></FormItem> )} />
            {eventForm.watch('status') === 'upcoming' && ( <FormField name="registrationLink" control={eventForm.control} render={({ field }) => ( <FormItem><FormLabel>Registration Link (e.g., Google Form)</FormLabel><FormControl><Input placeholder="https://forms.gle/..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem> )} /> )}
            <Button type="submit" className="w-full" disabled={createEventMutation.isPending || updateEventMutation.isPending}>{eventToEdit ? 'Save Changes' : 'Add Event'}</Button></form></Form>
        </DialogContent>
      </Dialog>

      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
            <DialogContent className="bg-card border-card-border text-white">
                <DialogHeader>
                    <DialogTitle>Submission from {selectedSubmission.name}</DialogTitle>
                    <DialogDescription>{selectedSubmission.email} - {new Date(selectedSubmission.createdAt).toLocaleString()}</DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    <h4 className="font-semibold">Message:</h4>
                    <p className="text-gray-300 bg-background/50 p-4 rounded-md whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
            </DialogContent>
        </Dialog>
      )}
      
      <AlertDialog open={!!submissionToDelete} onOpenChange={() => setSubmissionToDelete(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the submission from {submissionToDelete?.name}.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteSubmissionMutation.mutate(submissionToDelete!.id)} disabled={deleteSubmissionMutation.isPending}>{deleteSubmissionMutation.isPending ? 'Deleting...' : 'Delete'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the event "{eventToDelete?.title}".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteEventMutation.mutate(eventToDelete!.id)} disabled={deleteEventMutation.isPending}>{deleteEventMutation.isPending ? 'Deleting...' : 'Delete'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Team Member?</AlertDialogTitle><AlertDialogDescription>This will permanently delete {memberToDelete?.name} from the team.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => deleteTeamMemberMutation.mutate(memberToDelete!.id)} disabled={deleteTeamMemberMutation.isPending}>{deleteTeamMemberMutation.isPending ? 'Deleting...' : 'Delete'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}