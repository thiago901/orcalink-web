// src/stores/useSocketStore.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from './authStore';


type Listener = (data: any) => void;

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  on: (event: string, callback: Listener) => void;
  off: (event: string, callback: Listener) => void;
  emit: (event: string, data: any) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,

  connect: () => {
    const { token } = useAuthStore.getState();
    if (!token || get().socket) return;

    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      set({ isConnected: false, socket: null });
    });

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  on: (event, callback) => {
    const socket = get().socket;
    if (socket) socket.on(event, callback);
  },

  off: (event, callback) => {
    const socket = get().socket;
    if (socket) socket.off(event, callback);
  },

  emit: (event, data) => {
    const socket = get().socket;
    if (socket) socket.emit(event, data);
  },
}));
