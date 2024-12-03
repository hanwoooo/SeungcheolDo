import React, { createContext, useContext, useState, useEffect } from 'react';
import { StationData, Stationlist, DijkstraResult } from '@/types/domain';
import { getFavorite } from '@/api/auth';

interface AuthContextType {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  stationData: StationData | null;
  setStationData: (data: StationData | null) => void;
  currentLine: string | null;
  setCurrentLine: (line: string | null) => void;
  favorites: Stationlist;
  setFavorites: (stations: Stationlist) => void;
  fetchFavorites: () => Promise<void>;
  departure: string;
  setDeparture: (station: string) => void;
  arrival: string;
  setArrival: (station: string) => void;
  waypoints: string[];
  setWaypoints: (waypoints: string[]) => void;
  result: DijkstraResult | null;
  setResult: (result: DijkstraResult | null) => void;
  transfer: number;
  setTransfer: (transfer: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLogin, setIsLogin] = useState(false);
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [currentLine, setCurrentLine] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Stationlist>([]);
  const [departure, setDeparture] = useState<string>('출발 역 선택');
  const [arrival, setArrival] = useState<string>('도착 역 선택');
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [result, setResult] = useState<DijkstraResult | null>(null);
  const [transfer, setTransfer] = useState<number>(0);

  const fetchFavorites = async () => {
    try {
      const data = await getFavorite();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  };

  useEffect(() => {
    if (result && result.valueResults) {
      setTransfer(result.valueResults.transfer);
    }
  }, [result]);
  
  useEffect(() => {
    if (isLogin) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [isLogin]);

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        setIsLogin,
        stationData,
        setStationData,
        currentLine,
        setCurrentLine,
        favorites,
        setFavorites,
        fetchFavorites,
        departure,
        setDeparture,
        arrival,
        setArrival,
        waypoints,
        setWaypoints,
        result,
        setResult,
        transfer,
        setTransfer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
