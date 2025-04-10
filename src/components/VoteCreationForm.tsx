
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useVoting } from '@/context/VotingContext';
import { createVote } from '@/lib/web3';
import { useToast } from "@/components/ui/use-toast";
import { 
  Form, FormControl, FormField, FormItem, 
  FormLabel, FormMessage, FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Plus, Trash2, Tag, Info, Users, FileText } from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { VoteCreationData } from '@/lib/interfaces';

// Schema for form validation
const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  options: z.array(z.string().min(1, { message: 'Option cannot be empty' }))
    .min(2, { message: 'At least 2 options are required' }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }).refine((date) => date > new Date(), {
    message: "End date must be in the future",
  }),
  eligibilityType: z.enum(['all', 'tokenHolders', 'whitelist']),
  category: z.string().min(1, { message: 'Category is required' }),
  minParticipants: z.number().optional(),
  quorum: z.number().min(0).max(100).optional(),
  visibility: z.enum(['public', 'private', 'token-gated']),
  tags: z.array(z.string()).optional(),
});

const VoteCreationForm = () => {
  const { isConnected, address } = useVoting();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      options: ['', ''],
      eligibilityType: 'all',
      category: '',
      visibility: 'public',
      tags: [],
    },
  });

  // Add another voting option
  const addOption = () => {
    const currentOptions = form.getValues('options');
    form.setValue('options', [...currentOptions, '']);
  };

  // Remove a voting option
  const removeOption = (index: number) => {
    const currentOptions = form.getValues('options');
    if (currentOptions.length <= 2) {
      toast({
        title: "Cannot Remove",
        description: "At least 2 options are required",
        variant: "destructive",
      });
      return;
    }
    form.setValue('options', currentOptions.filter((_, i) => i !== index));
  };

  // Add a tag
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      const newTags = [...tags, currentTag.trim()];
      setTags(newTags);
      form.setValue('tags', newTags);
      setCurrentTag('');
    }
  };

  // Remove a tag
  const removeTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    form.setValue('tags', newTags);
  };

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!isConnected || !address) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet to create a vote",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Format the data for contract submission
      const voteData: VoteCreationData = {
        title: data.title,
        description: data.description,
        options: data.options,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        eligibilityType: data.eligibilityType,
        category: data.category,
        minParticipants: data.minParticipants,
        quorum: data.quorum,
        visibility: data.visibility,
        tags: data.tags,
      };

      // Call the createVote function from web3.ts
      const result = await createVote(voteData);
      
      if (result.success) {
        toast({
          title: "Vote Created",
          description: `Your vote has been created successfully with ID: ${result.voteId}`,
        });
        
        // Redirect to the newly created vote
        navigate(`/votes/${result.voteId}`);
      }
    } catch (error) {
      console.error("Error creating vote:", error);
      toast({
        title: "Error",
        description: "Failed to create vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Create a Vote</h2>
        <p className="text-gray-600 mb-4">
          Please connect your wallet to create a new vote.
        </p>
        <Button disabled>Connect Wallet First</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Create a New Vote</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Basic Information
            </h3>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vote title" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear, concise title for your vote.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide details about this vote" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed information about what participants are voting on.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="governance">Governance</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="protocol">Protocol Change</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Category helps organize and filter votes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Voting Options */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Voting Options</h3>
            
            {form.getValues('options').map((_, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`options.${index}`}
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Option {index + 1}</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder={`Option ${index + 1}`} {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              className="mt-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Option
            </Button>
          </div>
          
          {/* Schedule */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Schedule
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When voting begins
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date < new Date() || 
                            (form.getValues("startDate") && date < form.getValues("startDate"))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When voting ends
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Eligibility & Visibility */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Participation Settings
            </h3>
            
            <FormField
              control={form.control}
              name="eligibilityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who Can Vote</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select who can vote" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Anyone with a wallet</SelectItem>
                      <SelectItem value="tokenHolders">Token holders only</SelectItem>
                      <SelectItem value="whitelist">Whitelisted addresses</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Define who is eligible to participate in this vote
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Vote Visibility</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">Public - Visible to everyone</SelectItem>
                      <SelectItem value="private">Private - Visible to participants only</SelectItem>
                      <SelectItem value="token-gated">Token-gated - Requires token to view</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Who can see this vote and its results
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="minParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Participants</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="Optional" 
                        {...field} 
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum number of voters required (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quorum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quorum Percentage (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="Optional" 
                        {...field} 
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum percentage of eligible voters required (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Tags */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              Tags
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <div key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center gap-1">
                  <span>{tag}</span>
                  <button 
                    type="button" 
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add a tag"
                className="flex-grow"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Tags help categorize and make your vote easier to discover
            </p>
          </div>
          
          {/* Summary and Submit */}
          <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Important</h4>
              <p className="text-sm text-blue-700">
                Once created, this vote will be deployed to the blockchain and cannot be modified. 
                Please review all details carefully before submitting.
              </p>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? "Creating Vote..." : "Create Vote"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default VoteCreationForm;
