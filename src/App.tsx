/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Player, Position } from './types';
import { INITIAL_PLAYERS } from './initialPlayers';
import { PlayerStats } from './components/PlayerStats';
import { PlayerForm } from './components/PlayerForm';
import { PlayerDossier } from './components/PlayerDossier';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  RefreshCw, 
  TrendingUp, 
  UserPlus, 
  Filter,
  Check,
  ChevronUp,
  ChevronDown,
  Calendar,
  Layers,
  Award,
  BookOpen,
  Database,
  Info,
  ExternalLink,
  ClipboardCheck,
  Clipboard,
  AlertTriangle
} from 'lucide-react';
import { 
  isSupabaseConfigured,
  fetchPlayersFromSupabase,
  savePlayerToSupabase,
  deletePlayerFromSupabase,
  SUPABASE_SCHEMA_SQL
} from './lib/supabase';

const POSITIONS: Position[] = [
  'Portero',
  'Defensa Central',
  'Lateral Derecho',
  'Lateral Izquierdo',
  'Mediocentro Defensivo',
  'Mediocentro Organizador',
  'Mediocentro Ofensivo',
  'Extremo',
  'Delantero Centro'
];

export default function App() {

  // 1. Database State & Storage
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  // Supabase Sync States
  const [supabaseStatus, setSupabaseStatus] = useState<'idle' | 'checking' | 'connected' | 'error' | 'not-configured'>('idle');
  const [supabaseErrorMessage, setSupabaseErrorMessage] = useState('');
  const [showSqlHelper, setShowSqlHelper] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // 2. Modals/Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | undefined>(undefined);

  // 3. Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState<string>('todos');
  const [filterAgeGroup, setFilterAgeGroup] = useState<string>('todos'); // todos, u19, u21, u23, senior
  const [minAge, setMinAge] = useState<number>(15);
  const [maxAge, setMaxAge] = useState<number>(45);

  // 4. Sorting State
  const [sortBy, setSortBy] = useState<keyof Player | 'valorMercado'>('calificacion');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load initial database from Supabase or localStorage fallback
  const loadDatabase = async () => {
    if (isSupabaseConfigured()) {
      setSupabaseStatus('checking');
      setSupabaseErrorMessage('');
      try {
        const remotePlayers = await fetchPlayersFromSupabase();
        setPlayers(remotePlayers);
        setSupabaseStatus('connected');
        if (remotePlayers.length > 0) {
          setSelectedPlayer(remotePlayers[0]);
        } else {
          // If Supabase table is empty but connected, we can seed it with INITIAL_PLAYERS
          setPlayers(INITIAL_PLAYERS);
          localStorage.setItem('proscout_players_database', JSON.stringify(INITIAL_PLAYERS));
          // Sync all initial players to Supabase background
          for (const p of INITIAL_PLAYERS) {
            await savePlayerToSupabase(p);
          }
          const seeded = await fetchPlayersFromSupabase();
          setPlayers(seeded);
          if (seeded.length > 0) {
            setSelectedPlayer(seeded[0]);
          }
        }
      } catch (err: any) {
        console.error('Error connecting to Supabase:', err);
        setSupabaseStatus('error');
        setSupabaseErrorMessage(err.message || 'Error desconocido.');
        // Fallback to local storage
        fallbackToLocalStorage();
      }
    } else {
      setSupabaseStatus('not-configured');
      fallbackToLocalStorage();
    }
  };

  const fallbackToLocalStorage = () => {
    const saved = localStorage.getItem('proscout_players_database');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Player[];
        setPlayers(parsed);
        if (parsed.length > 0) {
          setSelectedPlayer(parsed[0]);
        }
      } catch (e) {
        console.error('Error parsing player database fallback', e);
        setPlayers(INITIAL_PLAYERS);
        if (INITIAL_PLAYERS.length > 0) {
          setSelectedPlayer(INITIAL_PLAYERS[0]);
        }
      }
    } else {
      setPlayers(INITIAL_PLAYERS);
      if (INITIAL_PLAYERS.length > 0) {
        setSelectedPlayer(INITIAL_PLAYERS[0]);
      }
      localStorage.setItem('proscout_players_database', JSON.stringify(INITIAL_PLAYERS));
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Sync to localStorage / Supabase on state modifications
  const saveToLocalStorageAndState = async (newPlayersList: Player[]) => {
    setPlayers(newPlayersList);
    localStorage.setItem('proscout_players_database', JSON.stringify(newPlayersList));
  };

  // Add or Edit Handler
  const handleSavePlayer = async (formData: Omit<Player, 'id' | 'fechaRegistro'> & { id?: string }) => {
    setIsSyncing(true);
    let updatedPlayers: Player[];
    let targetPlayer: Player;

    if (formData.id) {
      // Edit mode
      const existing = players.find(p => p.id === formData.id);
      targetPlayer = {
        ...existing,
        ...formData,
        id: formData.id,
        fechaRegistro: existing?.fechaRegistro || new Date().toISOString().split('T')[0]
      } as Player;

      updatedPlayers = players.map(p => p.id === formData.id ? targetPlayer : p);
    } else {
      // Creation mode
      const nextId = (Math.max(0, ...players.map(p => parseInt(p.id) || 0)) + 1).toString();
      targetPlayer = {
        ...formData,
        id: nextId,
        fechaRegistro: new Date().toISOString().split('T')[0]
      } as Player;
      
      updatedPlayers = [targetPlayer, ...players];
    }

    // Save to local state first for instant UX feedback
    setPlayers(updatedPlayers);
    localStorage.setItem('proscout_players_database', JSON.stringify(updatedPlayers));
    setSelectedPlayer(targetPlayer);

    // Save to Supabase if connected
    if (supabaseStatus === 'connected') {
      try {
        await savePlayerToSupabase(targetPlayer);
      } catch (err: any) {
        console.error('Error writing player to Supabase:', err);
        alert(`Guardado localmente. Error al sincronizar con Supabase: ${err.message}`);
      }
    }

    setIsSyncing(false);
    setIsFormOpen(false);
    setEditingPlayer(undefined);
  };

  // Delete Handler
  const handleDeletePlayer = async (id: string) => {
    setIsSyncing(true);
    const filtered = players.filter(p => p.id !== id);
    setPlayers(filtered);
    localStorage.setItem('proscout_players_database', JSON.stringify(filtered));
    
    // Choose next selected player if deleted current
    if (selectedPlayer && selectedPlayer.id === id) {
      setSelectedPlayer(filtered.length > 0 ? filtered[0] : null);
    }

    // Delete from Supabase if connected
    if (supabaseStatus === 'connected') {
      try {
        await deletePlayerFromSupabase(id);
      } catch (err: any) {
        console.error('Error deleting player from Supabase:', err);
        alert(`Eliminado localmente. Error de sincronización con Supabase: ${err.message}`);
      }
    }

    setIsSyncing(false);
  };


  // Trigger edit from outside form
  const handleTriggerEdit = (player: Player) => {
    setEditingPlayer(player);
    setIsFormOpen(true);
  };

  // Restore defaults database
  const handleResetDefaults = () => {
    if (confirm('¿Deseas restaurar la base de datos de scouting a los valores predeterminados? Perderás tus cambios actuales.')) {
      saveToLocalStorageAndState(INITIAL_PLAYERS);
      if (INITIAL_PLAYERS.length > 0) {
        setSelectedPlayer(INITIAL_PLAYERS[0]);
      }
    }
  };

  // Sort Toggle handler
  const handleSort = (field: keyof Player | 'valorMercado') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc'); // default to descending
    }
  };

  // Filter & Search computation
  const filteredPlayers = players.filter(p => {
    // 1. Search Query (Name, Club, Nationality)
    const matchesSearch = 
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.club.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nacionalidad.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Position filter
    const matchesPosition = filterPosition === 'todos' || p.posicion === filterPosition;

    // 3. Custom Age category selectors
    let matchesAgeGroup = true;
    if (filterAgeGroup === 'u19') {
      matchesAgeGroup = p.edad <= 19;
    } else if (filterAgeGroup === 'u21') {
      matchesAgeGroup = p.edad <= 21;
    } else if (filterAgeGroup === 'u23') {
      matchesAgeGroup = p.edad <= 23;
    } else if (filterAgeGroup === 'senior') {
      matchesAgeGroup = p.edad > 23;
    }

    // 4. Custom Manual Age inputs (edad columns constraints)
    const matchesManualAge = p.edad >= minAge && p.edad <= maxAge;

    return matchesSearch && matchesPosition && matchesAgeGroup && matchesManualAge;
  });

  // Sort computation
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    // Handle string comparisons
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'asc' 
        ? valA.localeCompare(valB) 
        : valB.localeCompare(valA);
    }

    // Numbers & numbers attributes
    const numA = (valA as number) || 0;
    const numB = (valB as number) || 0;

    return sortOrder === 'asc' ? numA - numB : numB - numA;
  });

  // Assign position categories and badges styles in database scouting columns
  const getBadgePositionStyle = (pos: Position) => {
    if (pos === 'Portero') {
      return 'bg-red-950/40 text-red-400 border-red-800/40';
    }
    if (pos.includes('Defensa') || pos.includes('Lateral')) {
      return 'bg-cyan-950/40 text-cyan-400 border-cyan-800/40';
    }
    if (pos.includes('Mediocentro')) {
      return 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40';
    }
    return 'bg-amber-950/40 text-amber-400 border-amber-800/40'; // forward
  };

  const getAgeTagStyle = (age: number) => {
    if (age <= 19) return 'text-purple-400 bg-purple-950/40 border-purple-900/40';
    if (age <= 21) return 'text-indigo-400 bg-indigo-950/40 border-indigo-900/40';
    if (age <= 23) return 'text-teal-400 bg-teal-950/40 border-teal-900/40';
    return 'text-neutral-400 bg-neutral-900 border-neutral-800';
  };

  const getRatingStarsStyle = (rating: number) => {
    if (rating >= 88) return 'text-emerald-400';
    if (rating >= 80) return 'text-brand-green-400';
    if (rating >= 70) return 'text-amber-400';
    return 'text-neutral-400';
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased selection:bg-brand-green-500 selection:text-neutral-950 pb-12">
      {/* 1. Header Navigation bar */}
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-brand-green-500 text-neutral-950 rounded-xl flex items-center justify-center font-bold tracking-wider shadow-lg shadow-brand-green-500/10 border border-brand-green-400/20">
              SL
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                SCOUTLAB <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-green-950 text-brand-green-400 border border-brand-green-800/40 uppercase font-bold tracking-widest font-mono">FUTBOL</span>
              </h1>
              <p className="text-xs text-neutral-400">
                Base de datos de scouting profesional por edad y posición táctica
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Reset Database */}
            <button
              onClick={handleResetDefaults}
              id="reset-db-btn"
              title="Restaurar base de datos original"
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurar Base</span>
            </button>

            {/* Quick create button */}
            <button
              id="create-player-btn"
              onClick={() => {
                setEditingPlayer(undefined);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 px-4.5 py-2 text-sm font-semibold text-neutral-950 bg-brand-green-400 hover:bg-brand-green-300 rounded-lg transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Jugador</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Supabase "dia3" Synchronization Banner */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-lg border ${
              supabaseStatus === 'connected' 
                ? 'bg-brand-green-950/40 text-brand-green-400 border-brand-green-800/30' 
                : supabaseStatus === 'checking'
                ? 'bg-neutral-950 text-neutral-400 border-neutral-800 animate-pulse'
                : supabaseStatus === 'error'
                ? 'bg-red-950/40 text-red-400 border-red-800/40'
                : 'bg-amber-950/40 text-amber-500 border-amber-900/30'
            }`}>
              <Database className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                  PROYECTO SUPABASE: <span className="text-brand-green-400 text-xs font-bold">dia3</span>
                </h2>
                
                {supabaseStatus === 'connected' && (
                  <span className="flex items-center gap-1 text-[10px] bg-brand-green-950/60 text-brand-green-400 border border-brand-green-800/50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-green-400 animate-ping inline-block animate-duration-1000" />
                    En línea (Datos Sincronizados)
                  </span>
                )}
                {supabaseStatus === 'checking' && (
                  <span className="text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                    Conectando...
                  </span>
                )}
                {supabaseStatus === 'error' && (
                  <span className="text-[10px] bg-red-950/60 text-red-400 border border-red-800/40 px-2 py-0.5 rounded-full font-semibold">
                    Error de Sincronización
                  </span>
                )}
                {supabaseStatus === 'not-configured' && (
                  <span className="text-[10px] bg-amber-950/60 text-amber-450 border border-amber-900/40 px-2 py-0.5 rounded-full font-semibold">
                    Persistencia Local (LocalStorage)
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
                {supabaseStatus === 'connected' 
                  ? 'Tus observaciones de fútbol, notas técnicas, calificaciones de edad y posición táctica se guardan directamente en tu instancia en tiempo real.'
                  : supabaseStatus === 'checking'
                  ? 'Estableciendo canal seguro con tu instancia en Supabase...'
                  : supabaseStatus === 'error'
                  ? `Supabase ha devuelto un error: "${supabaseErrorMessage}". Es probable que falte la tabla "players" o las credenciales no sean válidas.`
                  : 'Para habilitar base de datos persistente en tiempo real, vincula tu proyecto dia3 configurando VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'
                }
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:self-center">
            {/* Show instructions / SQL script toggle button */}
            <button
              onClick={() => setShowSqlHelper(!showSqlHelper)}
              className="px-3.5 py-1.5 text-xs font-semibold bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-brand-green-400" />
              <span>Instrucciones SQL</span>
            </button>

            {supabaseStatus === 'connected' ? (
              <button
                onClick={loadDatabase}
                disabled={isSyncing}
                className="px-3.5 py-1.5 text-xs font-semibold bg-brand-green-950/30 hover:bg-brand-green-950/50 border border-brand-green-800/40 text-brand-green-400 rounded-lg transition-colors flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Refrescar</span>
              </button>
            ) : (
              <button
                onClick={loadDatabase}
                className="px-3.5 py-1.5 text-xs font-semibold bg-brand-green-400 hover:bg-brand-green-300 text-neutral-950 rounded-lg transition-colors flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reintentar</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Slidout helper with SQL Editor configuration schema */}
        {showSqlHelper && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">DOCK: VINCULACIÓN CON SUPABASE (PROYECTO "dia3")</h3>
                  <p className="text-xs text-neutral-400">Instrucciones técnicas para habilitar la persistencia en la nube</p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlHelper(false)}
                className="text-neutral-400 hover:text-white text-xs px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-lg cursor-pointer"
              >
                Cerrar Guía
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
              <div className="space-y-3 text-neutral-300 leading-relaxed">
                <p>
                  <strong>Paso 1:</strong> Crea las variables de entorno en la configuración de tu plataforma (<span className="text-brand-green-400 font-semibold">Settings &gt; Secrets</span>):
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-neutral-400 font-mono text-[11px] bg-neutral-950 p-3 rounded-lg border border-neutral-850">
                  <li><strong>VITE_SUPABASE_URL</strong>: Tu endpoint URL de Supabase.</li>
                  <li><strong>VITE_SUPABASE_ANON_KEY</strong>: Tu clave de API anónima pública (anon key).</li>
                </ul>

                <p>
                  <strong>Paso 2:</strong> Ve a la pestaña de <span className="text-brand-green-400 font-semibold">SQL Editor</span> en tu dashboard del proyecto <strong>dia3</strong> de Supabase y ejecuta el script de la derecha para aprovisionar tu base de datos de jugadores.
                </p>

                <p className="text-[11px] bg-amber-950/20 text-text-amber-300 p-3 rounded-lg border border-amber-900/30">
                  ⚠️ <strong>Recordatorio de RLS:</strong> El script de al lado habilita Row Level Security y crea una política pública para desarrollo rápido. Puedes ajustarlo a tus necesidades.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center bg-neutral-950 px-3 py-2 border border-neutral-850 rounded-t-lg">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase font-bold">SQL SCRIPT DE CREACIÓN</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2000);
                    }}
                    className="text-[10px] text-brand-green-400 hover:text-brand-green-300 font-medium flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded cursor-pointer"
                  >
                    {copiedSql ? (
                      <>
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-3.5 h-3.5" />
                        <span>Copiar Código</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-neutral-950 border-x border-b border-neutral-850 rounded-b-lg font-mono text-[10px] text-neutral-350 overflow-x-auto max-h-56 leading-normal">
                  {SUPABASE_SCHEMA_SQL}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Widgets Row */}
        <PlayerStats players={players} />


        {/* Filters and Scouting Database Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          
          {/* LEFT 2 COLUMNS: Filter controls & Players interactive table */}
          <div className="xl:col-span-2 space-y-4">
            
            {/* Filtering Box Area */}
            <div className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-white border-b border-neutral-800 pb-2.5">
                <Filter className="w-4 h-4 text-brand-green-405" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Panel de Filtros - Edad y Posición
                </h3>
              </div>

              {/* Filter inputs */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search Bar */}
                <div className="md:col-span-5 space-y-1.5">
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Buscar Jugador / Club</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Nombre, club, país..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-brand-green-500 transition-colors"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                  </div>
                </div>

                {/* Filter POSITION (Required Column #1 Filter) */}
                <div className="md:col-span-4 space-y-1.5">
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Filtrar por Posición</label>
                  <select
                    id="filter-position-select"
                    value={filterPosition}
                    onChange={(e) => setFilterPosition(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-brand-green-500 transition-colors"
                  >
                    <option value="todos">Todas las posiciones</option>
                    {POSITIONS.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>

                {/* Filter AGE GROUP RANGE */}
                <div className="md:col-span-3 space-y-1.5">
                  <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">Categoría de Edad</label>
                  <select
                    id="filter-age-group-select"
                    value={filterAgeGroup}
                    onChange={(e) => setFilterAgeGroup(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-brand-green-500 transition-colors"
                  >
                    <option value="todos">Cualquier edad</option>
                    <option value="u19">Juvenil (≤ 19 años)</option>
                    <option value="u21">Sub-21 (≤ 21 años)</option>
                    <option value="u23">Olímpico (≤ 23 años)</option>
                    <option value="senior">Sénior (&gt; 23 años)</option>
                  </select>
                </div>
              </div>

              {/* Rango numérico preciso de Edad (Para cumplir a fondo con el enfoque especial de edad) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2.5 border-t border-neutral-800/55 text-xs text-neutral-400">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="font-semibold text-neutral-300">Rango de Edad Preciso (Años):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="min-age-input"
                      value={minAge}
                      onChange={(e) => setMinAge(Math.max(12, parseInt(e.target.value) || 12))}
                      className="w-14 bg-neutral-950 border border-neutral-800 rounded-md py-1 px-1.5 text-center text-white"
                      min="12"
                      max="50"
                    />
                    <span>a</span>
                    <input
                      type="number"
                      id="max-age-input"
                      value={maxAge}
                      onChange={(e) => setMaxAge(Math.min(50, parseInt(e.target.value) || 50))}
                      className="w-14 bg-neutral-950 border border-neutral-800 rounded-md py-1 px-1.5 text-center text-white"
                      min="12"
                      max="50"
                    />
                  </div>
                </div>

                {/* Reset Filters Quick action */}
                {(searchQuery !== '' || filterPosition !== 'todos' || filterAgeGroup !== 'todos' || minAge !== 15 || maxAge !== 45) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterPosition('todos');
                      setFilterAgeGroup('todos');
                      setMinAge(15);
                      setMaxAge(45);
                    }}
                    id="clear-filters-btn"
                    className="text-brand-green-400 hover:text-brand-green-300 font-medium transition-colors"
                  >
                    Restablecer Filtros
                  </button>
                )}
              </div>
            </div>

            {/* Players scouting table card */}
            <div className="bg-neutral-900 border border-neutral-800/80 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/20">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-green-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    BBDD de Prospectos ({sortedPlayers.length} de {players.length})
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 italic">Haz clic en un jugador para ver su ficha</span>
              </div>

              {/* Database HTML Table container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" id="scouting-database-table">
                  <thead>
                    <tr className="border-b border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider bg-neutral-950/40">
                      <th className="px-5 py-3 cursor-pointer hover:bg-neutral-900 hover:text-white transition-colors" onClick={() => handleSort('nombre')}>
                        <div className="flex items-center gap-1">
                          <span>Jugador</span>
                          {sortBy === 'nombre' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-brand-green-400" /> : <ChevronDown className="w-3 h-3 text-brand-green-400" />)}
                        </div>
                      </th>
                      {/* Edad (Required Column #1) */}
                      <th className="px-4 py-3 cursor-pointer hover:bg-neutral-900 hover:text-white transition-colors text-right" onClick={() => handleSort('edad')}>
                        <div className="flex items-center justify-end gap-1">
                          <span>Edad</span>
                          {sortBy === 'edad' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-brand-green-400" /> : <ChevronDown className="w-3 h-3 text-brand-green-400" />)}
                        </div>
                      </th>
                      {/* Posición (Required Column #2) */}
                      <th className="px-5 py-3 cursor-pointer hover:bg-neutral-900 hover:text-white transition-colors" onClick={() => handleSort('posicion')}>
                        <div className="flex items-center gap-1">
                          <span>Posición</span>
                          {sortBy === 'posicion' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-brand-green-400" /> : <ChevronDown className="w-3 h-3 text-brand-green-400" />)}
                        </div>
                      </th>
                      <th className="px-4 py-3">País y Club</th>
                      <th className="px-4 py-3 cursor-pointer hover:bg-neutral-900 hover:text-white text-right transition-colors" onClick={() => handleSort('valorMercado')}>
                        <div className="flex items-center justify-end gap-1">
                          <span>Valor</span>
                          {sortBy === 'valorMercado' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-brand-green-400" /> : <ChevronDown className="w-3 h-3 text-brand-green-400" />)}
                        </div>
                      </th>
                      <th className="px-4 py-3 cursor-pointer hover:bg-neutral-900 hover:text-white text-right transition-colors" onClick={() => handleSort('calificacion')}>
                        <div className="flex items-center justify-end gap-1">
                          <span>Scout Val</span>
                          {sortBy === 'calificacion' && (sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 text-brand-green-400" /> : <ChevronDown className="w-3 h-3 text-brand-green-400" />)}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-805">
                    {sortedPlayers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 px-4 text-neutral-500">
                          <div className="space-y-2">
                            <p className="text-base font-semibold">Ningún jugador coincide con los filtros</p>
                            <p className="text-xs text-neutral-500">Prueba ajustando el rango de edad o buscando otro término.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      sortedPlayers.map((player) => {
                        const isSelected = selectedPlayer ? selectedPlayer.id === player.id : false;
                        return (
                          <tr 
                            key={player.id}
                            id={`player-row-${player.id}`}
                            onClick={() => setSelectedPlayer(player)}
                            className={`group cursor-pointer text-xs transition-all duration-150 relative ${
                              isSelected 
                                ? 'bg-brand-green-950/20 border-l-2 border-l-brand-green-450 hover:bg-brand-green-950/25' 
                                : 'hover:bg-neutral-850 border-l-2 border-l-transparent'
                            }`}
                          >
                            {/* Jugador info */}
                            <td className="px-5 py-3.5">
                              <div>
                                <p className="font-semibold text-neutral-100 group-hover:text-white text-sm">
                                  {player.nombre}
                                </p>
                                <p className="text-[11px] text-neutral-450 mt-0.5">{player.club}</p>
                              </div>
                            </td>

                            {/* Edad Column (Required #1) */}
                            <td className="px-4 py-3.5 text-right font-semibold font-mono">
                              <span className={`inline-block px-2 py-0.5 rounded border ${getAgeTagStyle(player.edad)}`}>
                                {player.edad}
                              </span>
                            </td>

                            {/* Posición Column (Required #2) */}
                            <td className="px-5 py-3.5">
                              <span className={`inline-block px-2.5 py-0.5 text-[11px] rounded font-medium border ${getBadgePositionStyle(player.posicion)}`}>
                                {player.posicion}
                              </span>
                            </td>

                            {/* País y Club */}
                            <td className="px-4 py-3.5 text-neutral-350">
                              <p className="text-neutral-200">{player.nacionalidad}</p>
                              <p className="text-[10px] text-neutral-500 mt-0.5">Pie: {player.pieHabil}</p>
                            </td>

                            {/* Valor de Mercado */}
                            <td className="px-4 py-3.5 text-right font-semibold text-neutral-100 font-mono">
                              {player.valorMercado ? `${player.valorMercado} M€` : 'S/V'}
                            </td>

                            {/* Scout rating */}
                            <td className="px-4 py-3.5 text-right font-semibold font-mono">
                              <div className="flex flex-col items-end">
                                <span className={getRatingStarsStyle(player.calificacion)}>
                                  {player.calificacion}
                                </span>
                                <span className="text-[9px] text-neutral-500 font-normal">Pot. {player.potencial}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="px-5 py-3 border-t border-neutral-800 text-[10px] text-neutral-500 flex justify-between">
                <span>Total visible: {sortedPlayers.length} prospectos</span>
                <span>Fórmula de filtrado: Edad y Posición obligatorias</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Player Scouting Dossier */}
          <div className="xl:col-span-1">
            {selectedPlayer ? (
              <PlayerDossier 
                player={selectedPlayer}
                allPlayers={players}
                onClose={() => setSelectedPlayer(null)}
                onEdit={handleTriggerEdit}
                onDelete={handleDeletePlayer}
              />
            ) : (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-neutral-400 flex flex-col items-center justify-center space-y-4 shadow-sm border-dashed">
                <div className="h-12 w-12 bg-neutral-950 rounded-full flex items-center justify-center border border-neutral-800 text-neutral-500">
                  <SlidersHorizontal className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Ningún perfil seleccionado</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                    Haz clic en la fila de cualquier jugador en la tabla de scouting para desplegar su ficha técnica, historial, atributos de juego e iniciar comparaciones dinámicas.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Form Drawer / Modal Popup */}
      {isFormOpen && (
        <PlayerForm 
          player={editingPlayer}
          onSave={handleSavePlayer}
          onClose={() => {
            setIsFormOpen(false);
            setEditingPlayer(undefined);
          }}
        />
      )}
    </div>
  );
}
