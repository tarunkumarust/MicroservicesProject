
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useToast } from '@chakra-ui/react';

const useNotifications = (user) => {
  const toast = useToast();

  useEffect(() => {
    if (!user) return;

    const socket = io('http://localhost:3007', {
      query: { userId: user.id, role: user.role },
    });

    socket.on('notification', (data) => {
      toast({
        title: 'Notification',
        description: data.message,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    });

    return () => socket.disconnect();
  }, [user]);
};

export default useNotifications;
