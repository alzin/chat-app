import { formatDistanceToNow, format } from 'date-fns';

export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // If the message was sent today, show the time
  if (date.toDateString() === now.toDateString()) {
    return format(date, 'h:mm a');
  }
  
  // Otherwise show a relative time (yesterday, 2 days ago, etc.)
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatLastSeen = (timestamp: string): string => {
  const date = new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
};