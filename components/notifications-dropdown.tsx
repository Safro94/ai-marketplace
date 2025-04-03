'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { API_ROUTES, WS_EVENTS } from '@/lib/constants'
import { Notification } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from './ui/toast'

export const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)

  // Fetch notifications when dropdown is opened or on initial load
  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(API_ROUTES.notifications())

      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      const data = await response.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Connect to WebSocket for real-time notifications
  useEffect(() => {
    // Initial fetch
    fetchNotifications()

    // Setup WebSocket connection
    const setupWebSocket = () => {
      const protocol = window.location.protocol === 'https' ? 'wss' : 'ws'
      const wsUrl = `${protocol}://${window.location.host}${API_ROUTES.notifications()}/ws`

      const socket = new WebSocket(wsUrl)
      socketRef.current = socket

      socket.onopen = () => {
        console.log('WebSocket connected')
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === WS_EVENTS.NEW_NOTIFICATION) {
            // Add new notification to the list
            setNotifications((prev) => [data.notification, ...prev])
            setUnreadCount((prev) => prev + 1)

            // Show toast for new notification
            toast(data.notification.title, {
              description: data.notification.message,
            })
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error)
        }
      }

      socket.onclose = () => {
        console.log('WebSocket disconnected')
        // Try to reconnect after a delay

        // setTimeout(setupWebSocket, 5000)
      }

      socket.onerror = (error) => {
        console.error('WebSocket error:', error)
        socket.close()
      }
    }

    // Try to setup WebSocket, but don't block if it fails
    try {
      setupWebSocket()
    } catch (error) {
      toast.error('Error', {
        description: 'Error setting up WebSocket.',
      })
    }

    // Cleanup WebSocket on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [])

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(API_ROUTES.notificationRead(id), {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification,
        ),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      toast.error('Error', {
        description: 'Error marking notification as read.',
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(API_ROUTES.notificationsReadAll(), {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read')
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true })),
      )
      setUnreadCount(0)
    } catch (error) {
      toast.error('Error', {
        description: 'Error marking all notifications as read.',
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return '✅'
      case 'ERROR':
        return '❌'
      case 'WARNING':
        return '⚠️'
      case 'INFO':
      default:
        return 'ℹ️'
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          {unreadCount > 0 && (
            <span className='absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel className='flex justify-between items-center'>
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant='ghost' size='sm' onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {isLoading ? (
          <div className='p-4 text-center text-muted-foreground'>
            Loading...
          </div>
        ) : !notifications.length ? (
          <div className='p-4 text-center text-muted-foreground'>
            No notifications
          </div>
        ) : (
          <DropdownMenuGroup className='max-h-[400px] overflow-y-auto'>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className='flex gap-2'>
                  <div className='text-lg'>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium'>{notification.title}</div>
                    <div className='text-sm text-muted-foreground'>
                      {notification.message}
                    </div>
                    <div className='text-xs text-muted-foreground mt-1'>
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        )}
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className='cursor-pointer'>
          <a href='/notifications' className='w-full text-center text-sm'>
            View all notifications
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
