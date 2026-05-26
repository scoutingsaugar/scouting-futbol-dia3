/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Position = 
  | 'Portero'
  | 'Defensa Central'
  | 'Lateral Derecho'
  | 'Lateral Izquierdo'
  | 'Mediocentro Defensivo'
  | 'Mediocentro Organizador'
  | 'Mediocentro Ofensivo'
  | 'Extremo'
  | 'Delantero Centro';

export interface PlayerAttributes {
  velocidad: number;     // Pace
  tiro: number;          // Shooting
  pase: number;          // Passing
  regate: number;        // Dribbling
  defensa: number;       // Defending
  fisico: number;        // Physical
}

export interface Player {
  id: string;
  nombre: string;
  edad: number;
  posicion: Position;
  club: string;
  nacionalidad: string;
  valorMercado: number; // in Million Euros
  pieHabil: 'Derecho' | 'Izquierdo' | 'Ambidiestro';
  calificacion: number; // 1 to 5 stars or scale of 100
  potencial: number;    // scale of 100
  notasScouting: string;
  atributos: PlayerAttributes;
  fechaRegistro: string;
}
