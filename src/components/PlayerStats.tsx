/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Player } from '../types';
import { Users, Calendar, Award, TrendingUp, Sparkles } from 'lucide-react';

interface PlayerStatsProps {
  players: Player[];
}

export function PlayerStats({ players }: PlayerStatsProps) {
  const total = players.length;
  
  const avgAge = total > 0 
    ? parseFloat((players.reduce((sum, p) => sum + p.edad, 0) / total).toFixed(1)) 
    : 0;

  const under21 = players.filter(p => p.edad < 21).length;

  const avgPotential = total > 0 
    ? Math.round(players.reduce((sum, p) => sum + p.potencial, 0) / total) 
    : 0;

  // Find most scouted position
  const getMostScoutedPosition = () => {
    if (total === 0) return 'Ninguna';
    const counts: Record<string, number> = {};
    players.forEach(p => {
      counts[p.posicion] = (counts[p.posicion] || 0) + 1;
    });
    let maxPos = 'Ninguna';
    let maxVal = 0;
    Object.entries(counts).forEach(([pos, val]) => {
      if (val > maxVal) {
        maxVal = val;
        maxPos = pos;
      }
    });
    return maxPos;
  };

  const topPosition = getMostScoutedPosition();

  return (
    <div 
      id="scouting-statistics-dashboard"
      className="grid grid-cols-2 lg:grid-cols-5 gap-4"
    >
      {/* Stat 1: Total Escaneados */}
      <div className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:border-neutral-750 transition-colors">
        <div className="p-3 bg-brand-green-950/50 text-brand-green-400 rounded-lg border border-brand-green-800/30">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-neutral-400 font-medium">Scouteados</p>
          <p className="text-[22px] font-bold text-white font-mono leading-none mt-1">
            {total} <span className="text-xs font-normal text-neutral-500">fichas</span>
          </p>
        </div>
      </div>

      {/* Stat 2: Edad Media */}
      <div className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:border-neutral-750 transition-colors">
        <div className="p-3 bg-cyan-950/50 text-cyan-400 rounded-lg border border-cyan-800/30">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-neutral-400 font-medium">Edad Promedio</p>
          <p className="text-[22px] font-bold text-white font-mono leading-none mt-1">
            {avgAge} <span className="text-xs font-normal text-neutral-500">años</span>
          </p>
        </div>
      </div>

      {/* Stat 3: Promesas U21 */}
      <div className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:border-neutral-750 transition-colors">
        <div className="p-3 bg-amber-950/50 text-amber-400 rounded-lg border border-amber-800/30">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-neutral-400 font-medium">Promesas (U-21)</p>
          <p className="text-[22px] font-bold text-white font-mono leading-none mt-1">
            {under21} <span className="text-xs font-normal text-neutral-500">jóvenes</span>
          </p>
        </div>
      </div>

      {/* Stat 4: Potencial Medio */}
      <div className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:border-neutral-750 transition-colors">
        <div className="p-3 bg-purple-950/50 text-purple-400 rounded-lg border border-purple-800/30">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-neutral-400 font-medium">Potencial Medio</p>
          <p className="text-[22px] font-bold text-white font-mono leading-none mt-1">
            {avgPotential} <span className="text-xs font-normal text-neutral-500">/ 100</span>
          </p>
        </div>
      </div>

      {/* Stat 5: Posición más buscada */}
      <div className="col-span-2 lg:col-span-1 bg-neutral-900 border border-neutral-800/80 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:border-neutral-750 transition-colors">
        <div className="p-3 bg-red-950/50 text-red-400 rounded-lg border border-red-800/30">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="truncate">
          <p className="text-xs text-neutral-400 font-medium">Posición Frecuente</p>
          <p className="text-sm font-bold text-white truncate leading-none mt-2">
            {topPosition}
          </p>
        </div>
      </div>
    </div>
  );
}
