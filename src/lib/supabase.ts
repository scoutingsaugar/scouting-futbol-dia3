/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Player } from '../types';

// Read configuration from Vite env variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Lazy client initialization inside a factory to avoid crashing if credentials are not filled yet
let supabaseInstance: any = null;

export const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};


/**
 * Sync SQL Schema query prompt to guide user layout if they need to provision the database.
 */
export const SUPABASE_SCHEMA_SQL = `
-- TABLA 'players' PARA EL PROYECTO DE SCOUTING 'dia3'
-- Crea esta tabla en la sección de SQL Editor de tu Dashboard de Supabase:

CREATE TABLE IF NOT EXISTS public.players (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    edad INTEGER NOT NULL,
    posicion TEXT NOT NULL,
    club TEXT,
    nacionalidad TEXT,
    valor_mercado NUMERIC,
    pie_habil TEXT,
    calificacion INTEGER,
    potencial INTEGER,
    notas_scouting TEXT,
    atributos JSONB,
    fecha_registro DATE DEFAULT CURRENT_DATE
);

-- Habilitar RLS (Row Level Security) o desactivarla temporalmente para pruebas:
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Crear una política pública para poder leer y escribir (solo desarrollo / demostración):
CREATE POLICY "Permitir todo a usuarios anonimos" ON public.players
    FOR ALL USING (true) WITH CHECK (true);
`;

/**
 * Fetch players from Supabase. Fallback gracefully.
 */
export async function fetchPlayersFromSupabase(): Promise<Player[]> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase no está configurado. Revisa tus variables de entorno.');
  }

  const { data, error } = await (client as any)
    .from('players')
    .select('*')
    .order('calificacion', { ascending: false });

  if (error) {
    // If table doesn't exist yet, we guide them
    throw error;
  }

  // Map database naming snake_case or standard fields to our runtime type
  return (data || []).map((row: any) => ({
    id: row.id,
    nombre: row.nombre,
    edad: row.edad,
    posicion: row.posicion as any,
    club: row.club || '',
    nacionalidad: row.nacionalidad || '',
    valorMercado: Number(row.valor_mercado ?? row.valorMercado ?? 0),
    pieHabil: row.pie_habil || row.pieHabil || 'Derecho',
    calificacion: Number(row.calificacion ?? 0),
    potencial: Number(row.potencial ?? 0),
    notasScouting: row.notas_scouting ?? row.notasScouting ?? '',
    atributos: typeof row.atributos === 'string' 
      ? JSON.parse(row.atributos) 
      : (row.atributos || { velocidad: 70, tiro: 65, pase: 70, regate: 70, defensa: 60, fisico: 65 }),
    fechaRegistro: row.fecha_registro || row.fechaRegistro || new Date().toISOString().split('T')[0]
  }));
}

/**
 * Save/Insert or Update a player in Supabase table "players"
 */
export async function savePlayerToSupabase(player: Player): Promise<void> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase no está configurado.');
  }

  const dbRow = {
    id: player.id,
    nombre: player.nombre,
    edad: player.edad,
    posicion: player.posicion,
    club: player.club,
    nacionalidad: player.nacionalidad,
    valor_mercado: player.valorMercado,
    pie_habil: player.pieHabil,
    calificacion: player.calificacion,
    potencial: player.potencial,
    notas_scouting: player.notasScouting,
    atributos: player.atributos,
    fecha_registro: player.fechaRegistro
  };

  const { error } = await (client as any)
    .from('players')
    .upsert(dbRow, { onConflict: 'id' });

  if (error) {
    throw error;
  }
}

/**
 * Delete a player from Supabase
 */
export async function deletePlayerFromSupabase(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase no está configurado.');
  }

  const { error } = await (client as any)
    .from('players')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}
