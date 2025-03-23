'use client'

import { useSupabase } from '@/app/supabase-provider'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Notification {
  id: number
  title: string
  message: string
  date: string
  read: boolean
  type: 'info' | 'success' | 'warning' | 'error'
}

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: 'Purchase Successful',
    message:
      'You have successfully purchased Advanced SEO Content Generation System.',
    date: '2024-03-15',
    read: false,
    type: 'success',
  },
  {
    id: 2,
    title: 'New Asset Update',
    message: 'Financial Advisor GPT has been updated to version 2.0.',
    date: '2024-03-10',
    read: false,
    type: 'info',
  },
  {
    id: 3,
    title: 'Creator Application',
    message: 'Your creator application has been approved!',
    date: '2024-03-05',
    read: true,
    type: 'success',
  },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const { user } = useSupabase()

  useEffect(() => {
    if (user) {
      // In a real app, this would fetch notifications from the backend
      setNotifications(MOCK_NOTIFICATIONS)
      setUnreadCount(MOCK_NOTIFICATIONS.filter((n) => !n.read).length)
    }
  }, [user])

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    )
    setUnreadCount(0)
  }

  if (!user) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <span className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground'>
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-0' align='end'>
        <div className='flex items-center justify-between p-4 border-b'>
          <h4 className='font-medium'>Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant='ghost'
              size='sm'
              onClick={markAllAsRead}
              className='h-auto py-1 px-2 text-xs'
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className='max-h-80 overflow-auto'>
          {notifications.length > 0 ? (
            <div className='divide-y'>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 ${notification.read ? '' : 'bg-secondary/50'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className='flex justify-between items-start mb-1'>
                    <h5 className='font-medium text-sm'>
                      {notification.title}
                    </h5>
                    <span className='text-xs text-muted-foreground'>
                      {notification.date}
                    </span>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className='p-4 text-center'>
              <p className='text-sm text-muted-foreground'>No notifications</p>
            </div>
          )}
        </div>
        <div className='p-2 border-t text-center'>
          <Button variant='ghost' size='sm' className='w-full text-xs'>
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
