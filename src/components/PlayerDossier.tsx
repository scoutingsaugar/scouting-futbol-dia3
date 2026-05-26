/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player } from '../types';
import { 
  X, 
  Trash2, 
  Edit, 
  TrendingUp, 
  User, 
  Shield, 
  Compass, 
  DollarSign, 
  Calendar,
  Layers,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

interface PlayerDossierProps {
  player: Player;
  allPlayers: Player[];
  onClose: () => void;
  onEdit: (player: Player) => void;
  onDelete: (id: string) => void;
}

export function PlayerDossier({ player, allPlayers, onClose, onEdit, onDelete }: PlayerDossierProps) {
  const [compareWithId, setCompareWithId] = useState<string>('');
  
  const comparePlayer = allPlayers.find(p => p.id === compareWithId);

  // Helper to color codes based on attribute values
  const getAttributeColor = (val: number) => {
    if (val >= 85) return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/80';
    if (val >= 75) return 'text-brand-green-400 bg-brand-green-950/40 border-brand-green-800/80';
    if (val >= 60) return 'text-amber-400 bg-amber-950/40 border-amber-800/80';
    return 'text-red-400 bg-red-950/30 border-red-900/40';
  };

  const getAttributeBarColorValue = (val: number) => {
    if (val >= 85) return 'bg-emerald-500';
    if (val >= 75) return 'bg-brand-green-400';
    if (val >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getOverallRatingGrade = (val: number) => {
    if (val >= 90) return { label: 'Clase Mundial', color: 'text-purple-400 border-purple-800 bg-purple-950/40' };
    if (val >= 80) return { label: 'Elite / Promesa Top', color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40' };
    if (val >= 70) return { label: 'Jugador de Primera', color: 'text-brand-green-400 border-brand-green-800 bg-brand-green-950/40' };
    return { label: 'En Crecimiento', color: 'text-amber-400 border-amber-800 bg-amber-950/40' };
  };

  const statusGrade = getOverallRatingGrade(player.calificacion);

  // Position colors mapping same as App.tsx
  const getPositionStyles = (pos: string) => {
    if (pos === 'Portero') return 'bg-red-950/40 text-red-400 border-red-800/50';
    if (pos.includes('Defensa') || pos.includes('Lateral')) return 'bg-cyan-950/40 text-cyan-400 border-cyan-800/50';
    if (pos.includes('Mediocentro')) return 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50';
    return 'bg-amber-950/40 text-amber-400 border-amber-800/50'; // Forward/Extremes
  };

  return (
    <div 
      id="player-dossier-panel"
      className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden text-neutral-100 flex flex-col shadow-xl"
    >
      {/* Dossier Header Info */}
      <div className="relative p-6 border-b border-neutral-800 bg-linear-to-b from-neutral-950 to-neutral-900">
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <button
            onClick={() => onEdit(player)}
            id="dossier-edit-btn"
            title="Editar Jugador"
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all border border-neutral-750"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => {
              if (confirm(`¿Estás seguro de eliminar a ${player.nombre} de la base de datos de scouting?`)) {
                onDelete(player.id);
              }
            }}
            id="dossier-delete-btn"
            title="Eliminar Jugador"
            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-white transition-all border border-red-900/50"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            id="dossier-close-btn"
            title="Cerrar Ficha"
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all border border-neutral-750 ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Player Brand Info */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getPositionStyles(player.posicion)}`}>
              {player.posicion}
            </span>
            <span className="text-xs text-neutral-400 font-mono">ID: #{player.id}</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
              {player.nombre}
            </h2>
            <div className="flex items-center gap-2 text-sm text-neutral-400 mt-1">
              <span>{player.club}</span>
              <span>•</span>
              <span>{player.nacionalidad}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${statusGrade.color}`}>
              {statusGrade.label}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-neutral-300">
              Pie: <span className="font-semibold text-white">{player.pieHabil}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Dossier Content */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[64vh]">
        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 gap-4 bg-neutral-950/50 p-4 border border-neutral-800/70 rounded-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
              <Calendar className="w-3.5 h-3.5 text-brand-green-400" />
              <span>Edad</span>
            </div>
            <p className="text-lg font-bold text-white font-mono">
              {player.edad} <span className="text-xs font-normal text-neutral-400">años</span>
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
              <DollarSign className="w-3.5 h-3.5 text-brand-green-400" />
              <span>Valor de Mercado</span>
            </div>
            <p className="text-lg font-bold text-white font-mono">
              {player.valorMercado} <span className="text-xs font-normal text-neutral-400">M€</span>
            </p>
          </div>

          <div className="space-y-1 pt-2 border-t border-neutral-800">
            <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-green-405" />
              <span>Media de Scout</span>
            </div>
            <p className="text-lg font-bold text-brand-green-400 font-mono">
              {player.calificacion} <span className="text-xs font-normal text-neutral-400">/ 100</span>
            </p>
          </div>

          <div className="space-y-1 pt-2 border-t border-neutral-800">
            <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-brand-green-405" />
              <span>Potencial</span>
            </div>
            <p className="text-lg font-bold text-emerald-400 font-mono">
              {player.potencial} <span className="text-xs font-normal text-neutral-400">/ 100</span>
            </p>
          </div>
        </div>

        {/* Scouting Attributes */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
            <span>Atributos Técnicos</span>
            <span className="text-[10px] text-neutral-500 font-mono">Escala de 1-99</span>
          </h4>

          <div className="space-y-2.5">
            {[
              { label: 'Velocidad de Desborde', value: player.atributos.velocidad, key: 'Velocidad' },
              { label: 'Tiro y Definición analógica', value: player.atributos.tiro, key: 'Tiro' },
              { label: 'Precisión de Pase', value: player.atributos.pase, key: 'Pase' },
              { label: 'Control / Regates extremos', value: player.atributos.regate, key: 'Regate' },
              { label: player.posicion === 'Portero' ? 'Reflejos de Guardameta' : 'Defensa / Anticipaciones', value: player.atributos.defensa, key: 'Defensa' },
              { label: 'Condición Física y Resistencia', value: player.atributos.fisico, key: 'Físico' },
            ].map((attr) => (
              <div key={attr.key} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300 font-medium">{attr.label}</span>
                  <span className="font-mono font-bold text-brand-green-400">{attr.value}</span>
                </div>
                <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-850">
                  <div 
                    className={`h-full rounded-full ${getAttributeBarColorValue(attr.value)} transition-all duration-500`}
                    style={{ width: `${attr.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scouting Notes */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Informe del Observador</h4>
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-850 text-sm text-neutral-300 leading-relaxed font-sans italic">
            {player.notasScouting || "No se han ingresado notas adicionales sobre este jugador todavía. Utilice la opción de edición para registrar observaciones técnicas."}
          </div>
        </div>

        {/* COMPARA TU TALENTO */}
        <div className="space-y-3 pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-2 text-white">
            <ArrowRightLeft className="w-4 h-4 text-brand-green-400" />
            <span className="text-sm font-semibold">Comparar Scouting</span>
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs text-neutral-400">Selecciona otro jugador para contrastar analíticamente:</label>
            <select
              id="compare-player-select"
              value={compareWithId}
              onChange={(e) => setCompareWithId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-850 hover:border-neutral-800 text-xs rounded-lg p-2 text-white focus:outline-none focus:border-brand-green-500"
            >
              <option value="">-- No comparar --</option>
              {allPlayers
                .filter(p => p.id !== player.id)
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} ({p.edad} años, {p.posicion})
                  </option>
                ))
              }
            </select>
          </div>

          {/* Comparativo de estadísticas en vivo */}
          {comparePlayer && (
            <div className="bg-neutral-950/70 rounded-xl border border-neutral-800/60 p-4 space-y-3.5 mt-2 transition-all">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-850/60">
                <span className="font-semibold text-brand-green-400 truncate max-w-[110px]">{player.nombre} (A)</span>
                <span className="text-neutral-400 px-1">VS</span>
                <span className="font-semibold text-amber-400 text-right truncate max-w-[110px]">{comparePlayer.nombre} (B)</span>
              </div>

              {/* Atribute comparison side-by-side */}
              {[
                { label: 'Velocidad', valA: player.atributos.velocidad, valB: comparePlayer.atributos.velocidad },
                { label: 'Tiro', valA: player.atributos.tiro, valB: comparePlayer.atributos.tiro },
                { label: 'Pase', valA: player.atributos.pase, valB: comparePlayer.atributos.pase },
                { label: 'Regate', valA: player.atributos.regate, valB: comparePlayer.atributos.regate },
                { label: 'Defensa', valA: player.atributos.defensa, valB: comparePlayer.atributos.defensa },
                { label: 'Físico', valA: player.atributos.fisico, valB: comparePlayer.atributos.fisico },
                { label: 'Global', valA: player.calificacion, valB: comparePlayer.calificacion },
              ].map((stat) => {
                const isOverall = stat.label === 'Global';
                return (
                  <div key={stat.label} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className={`font-mono ${isOverall ? 'text-brand-green-400 font-bold' : 'text-neutral-400'}`}>{stat.valA}</span>
                      <span className={`font-medium ${isOverall ? 'text-white font-bold text-xs uppercase' : 'text-neutral-300'}`}>{stat.label}</span>
                      <span className={`font-mono ${isOverall ? 'text-amber-400 font-bold' : 'text-neutral-400'}`}>{stat.valB}</span>
                    </div>
                    {/* Dual comparative bar slider */}
                    <div className="flex w-full gap-0.5 h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                      {/* Left bar (A) values relative to sum/200 */}
                      <div className="flex-1 flex justify-end">
                        <div 
                          className={`h-full ${isOverall ? 'bg-brand-green-500' : 'bg-brand-green-400/80'}`}
                          style={{ width: `${(stat.valA / Math.max(1, stat.valA + stat.valB)) * 100}%` }}
                        />
                      </div>
                      <div className="w-[1px] bg-neutral-800" />
                      {/* Right bar (B) values */}
                      <div className="flex-1 flex justify-start">
                        <div 
                          className={`h-full ${isOverall ? 'bg-amber-500' : 'bg-amber-400/80'}`}
                          style={{ width: `${(stat.valB / Math.max(1, stat.valA + stat.valB)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="text-[10px] text-center text-neutral-500 italic mt-1 pt-1 border-t border-neutral-850">
                La barra indica balance relativo de rendimiento entre los jugadores.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
