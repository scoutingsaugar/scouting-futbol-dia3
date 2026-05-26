/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Player, Position, PlayerAttributes } from '../types';
import { X, Save, ShieldAlert } from 'lucide-react';

interface PlayerFormProps {
  player?: Player; // If provided, we are editing
  onSave: (player: Omit<Player, 'id' | 'fechaRegistro'> & { id?: string }) => void;
  onClose: () => void;
}

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

export function PlayerForm({ player, onSave, onClose }: PlayerFormProps) {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState<number>(20);
  const [posicion, setPosicion] = useState<Position>('Mediocentro Organizador');
  const [club, setClub] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [valorMercado, setValorMercado] = useState<number>(5);
  const [pieHabil, setPieHabil] = useState<'Derecho' | 'Izquierdo' | 'Ambidiestro'>('Derecho');
  const [calificacion, setCalificacion] = useState<number>(75);
  const [potencial, setPotencial] = useState<number>(85);
  const [notasScouting, setNotasScouting] = useState('');
  
  // Attributes
  const [atributos, setAtributos] = useState<PlayerAttributes>({
    velocidad: 70,
    tiro: 65,
    pase: 70,
    regate: 70,
    defensa: 60,
    fisico: 65,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (player) {
      setNombre(player.nombre);
      setEdad(player.edad);
      setPosicion(player.posicion);
      setClub(player.club);
      setNacionalidad(player.nacionalidad);
      setValorMercado(player.valorMercado);
      setPieHabil(player.pieHabil);
      setCalificacion(player.calificacion);
      setPotencial(player.potencial);
      setNotasScouting(player.notasScouting);
      setAtributos({ ...player.atributos });
    }
  }, [player]);

  const handleAttributeChange = (key: keyof PlayerAttributes, val: number) => {
    setAtributos(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('El nombre del jugador es requerido.');
      return;
    }
    if (!edad || edad < 12 || edad > 50) {
      setError('Por favor indica una edad válida entre 12 y 50 años.');
      return;
    }
    if (!club.trim()) {
      setError('El club actual es requerido.');
      return;
    }
    if (!nacionalidad.trim()) {
      setError('La nacionalidad es requerida.');
      return;
    }
    if (valorMercado < 0) {
      setError('El valor de mercado no puede ser negativo.');
      return;
    }

    onSave({
      id: player?.id,
      nombre: nombre.trim(),
      edad,
      posicion,
      club: club.trim(),
      nacionalidad: nacionalidad.trim(),
      valorMercado,
      pieHabil,
      calificacion,
      potencial,
      notasScouting: notasScouting.trim(),
      atributos
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        id="player-form-container"
        className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden text-neutral-100 flex flex-col my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950">
          <div>
            <h3 className="text-xl font-semibold text-brand-green-400 font-sans tracking-tight">
              {player ? 'Editar Informe de Scouting' : 'Nuevo Registro de Scouting'}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              {player ? `Modificando la ficha técnica de ${player.nombre}` : 'Registrar un nuevo talento en la base de datos'}
            </p>
          </div>
          <button 
            type="button"
            id="close-form-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[75vh]">
          {error && (
            <div className="flex items-center bg-red-950/40 border border-red-800 text-red-300 p-3.5 rounded-lg text-sm gap-2">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Datos Generales */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-neutral-450 uppercase tracking-wider border-b border-neutral-800 pb-1.5">
              Datos Generales del Futbolista
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Nombre Completo *</label>
                <input
                  type="text"
                  id="form-nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Erling Haaland"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-green-500 transition-colors"
                  required
                />
              </div>

              {/* Edad */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Edad (Años) *</label>
                <input
                  type="number"
                  id="form-edad"
                  value={edad}
                  onChange={(e) => setEdad(parseInt(e.target.value) || 0)}
                  min="12"
                  max="50"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-green-500 transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Posición */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Posición Principal *</label>
                <select
                  id="form-posicion"
                  value={posicion}
                  onChange={(e) => setPosicion(e.target.value as Position)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-green-500 transition-colors"
                >
                  {POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              {/* Club Actual */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Club Actual *</label>
                <input
                  type="text"
                  id="form-club"
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  placeholder="Ej: Manchester City"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-green-500 transition-colors"
                  required
                />
              </div>

              {/* Nacionalidad */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Nacionalidad *</label>
                <input
                  type="text"
                  id="form-nacionalidad"
                  value={nacionalidad}
                  onChange={(e) => setNacionalidad(e.target.value)}
                  placeholder="Ej: Noruega"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-green-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Valor de mercado */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Valor de Mercado M€</label>
                <div className="relative">
                  <input
                    type="number"
                    id="form-valorMercado"
                    value={valorMercado}
                    onChange={(e) => setValorMercado(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-3.5 pr-8 py-2 text-sm text-white focus:outline-none focus:border-brand-green-500 transition-colors font-mono"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-neutral-500 font-mono">M€</span>
                </div>
              </div>

              {/* Pie Hábil */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Pie Hábil</label>
                <select
                  id="form-pieHabil"
                  value={pieHabil}
                  onChange={(e) => setPieHabil(e.target.value as 'Derecho' | 'Izquierdo' | 'Ambidiestro')}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brand-green-500 transition-colors"
                >
                  <option value="Derecho">Derecho</option>
                  <option value="Izquierdo">Izquierdo</option>
                  <option value="Ambidiestro">Ambidiestro</option>
                </select>
              </div>

              {/* Valoraciones */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Media</label>
                  <input
                    type="number"
                    id="form-calificacion"
                    value={calificacion}
                    onChange={(e) => setCalificacion(Math.min(100, Math.max(1, parseInt(e.target.value) || 0)))}
                    min="1"
                    max="100"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-green-500 transition-colors font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">Potencial</label>
                  <input
                    type="number"
                    id="form-potencial"
                    value={potencial}
                    onChange={(e) => setPotencial(Math.min(100, Math.max(1, parseInt(e.target.value) || 0)))}
                    min="1"
                    max="100"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-green-500 transition-colors font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Habilidades Técnicas y Atributos de Juego */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-neutral-450 uppercase tracking-wider border-b border-neutral-800 pb-1.5">
              Atributos de Rendimiento (Escala 1 - 99)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 bg-neutral-950/40 p-4 border border-neutral-800/80 rounded-xl">
              {/* Velocidad */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-300">Velocidad / Ritmo</span>
                  <span className="font-bold text-brand-green-400 font-mono">{atributos.velocidad}</span>
                </div>
                <input
                  type="range"
                  id="form-velocidad"
                  min="20"
                  max="99"
                  value={atributos.velocidad}
                  onChange={(e) => handleAttributeChange('velocidad', parseInt(e.target.value))}
                  className="w-full accent-brand-green-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Tiro */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-300">Tiro / Definición</span>
                  <span className="font-bold text-brand-green-400 font-mono">{atributos.tiro}</span>
                </div>
                <input
                  type="range"
                  id="form-tiro"
                  min="20"
                  max="99"
                  value={atributos.tiro}
                  onChange={(e) => handleAttributeChange('tiro', parseInt(e.target.value))}
                  className="w-full accent-brand-green-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Pase */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-300">Pase / Visión</span>
                  <span className="font-bold text-brand-green-400 font-mono">{atributos.pase}</span>
                </div>
                <input
                  type="range"
                  id="form-pase"
                  min="20"
                  max="99"
                  value={atributos.pase}
                  onChange={(e) => handleAttributeChange('pase', parseInt(e.target.value))}
                  className="w-full accent-brand-green-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Regate */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-300">Regate / Agilidad</span>
                  <span className="font-bold text-brand-green-400 font-mono">{atributos.regate}</span>
                </div>
                <input
                  type="range"
                  id="form-regate"
                  min="20"
                  max="99"
                  value={atributos.regate}
                  onChange={(e) => handleAttributeChange('regate', parseInt(e.target.value))}
                  className="w-full accent-brand-green-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Defensa */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-300">{posicion === 'Portero' ? 'Reflejos (GK)' : 'Defensa / Entrada'}</span>
                  <span className="font-bold text-brand-green-400 font-mono">{atributos.defensa}</span>
                </div>
                <input
                  type="range"
                  id="form-defensa"
                  min="20"
                  max="99"
                  value={atributos.defensa}
                  onChange={(e) => handleAttributeChange('defensa', parseInt(e.target.value))}
                  className="w-full accent-brand-green-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Físico */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-300">Físico / Fuerza</span>
                  <span className="font-bold text-brand-green-400 font-mono">{atributos.fisico}</span>
                </div>
                <input
                  type="range"
                  id="form-fisico"
                  min="20"
                  max="99"
                  value={atributos.fisico}
                  onChange={(e) => handleAttributeChange('fisico', parseInt(e.target.value))}
                  className="w-full accent-brand-green-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Notas de Scouting */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-neutral-450 uppercase tracking-wider border-b border-neutral-800 pb-1.5">
              Análisis Táctico / Notas de Scouting
            </h4>
            
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Informe del Observador (Scout)</label>
              <textarea
                id="form-notasScouting"
                rows={3}
                value={notasScouting}
                onChange={(e) => setNotasScouting(e.target.value)}
                placeholder="Escribe aquí los puntos fuertes, debilidades, perfil psicológico, y cómo encajaría en el sistema de juego..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3.5 text-sm text-white focus:outline-none focus:border-brand-green-500 transition-colors font-sans resize-y"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-neutral-800 bg-neutral-950">
          <button
            type="button"
            id="cancel-form-btn"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-705 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            id="save-form-btn"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-neutral-950 bg-brand-green-400 hover:bg-brand-green-300 rounded-lg transition-colors active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Jugador</span>
          </button>
        </div>
      </div>
    </div>
  );
}
