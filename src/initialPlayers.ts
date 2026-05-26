/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Player } from './types';

export const INITIAL_PLAYERS: Player[] = [
  {
    id: '1',
    nombre: 'Lamine Yamal',
    edad: 18,
    posicion: 'Extremo',
    club: 'FC Barcelona',
    nacionalidad: 'España',
    valorMercado: 150,
    pieHabil: 'Izquierdo',
    calificacion: 92,
    potencial: 98,
    notasScouting: 'Talento generacional. Excelente habilidad de desborde y toma de decisiones superior para su corta edad. Puede jugar por la banda metiéndose hacia adentro.',
    atributos: {
      velocidad: 91,
      tiro: 85,
      pase: 89,
      regate: 94,
      defensa: 45,
      fisico: 72
    },
    fechaRegistro: '2026-01-15'
  },
  {
    id: '2',
    nombre: 'Pau Cubarsí',
    edad: 19,
    posicion: 'Defensa Central',
    club: 'FC Barcelona',
    nacionalidad: 'España',
    valorMercado: 40,
    pieHabil: 'Derecho',
    calificacion: 84,
    potencial: 93,
    notasScouting: 'Increíble salida de balón bajo presión. Comprensión táctica y posicionamiento impecable para un jugador juvenil. Necesita mejorar en duelos físicos aéreos.',
    atributos: {
      velocidad: 74,
      tiro: 38,
      pase: 86,
      regate: 72,
      defensa: 85,
      fisico: 78
    },
    fechaRegistro: '2026-02-10'
  },
  {
    id: '3',
    nombre: 'Eduardo Camavinga',
    edad: 23,
    posicion: 'Mediocentro Defensivo',
    club: 'Real Madrid',
    nacionalidad: 'Francia',
    valorMercado: 100,
    pieHabil: 'Izquierdo',
    calificacion: 88,
    potencial: 94,
    notasScouting: 'Mediocampista sumamente versátil, capaz de romper líneas en conducción y recuperar balones con solvencia. Resistencia física y lectura de juego sobresalientes.',
    atributos: {
      velocidad: 82,
      tiro: 73,
      pase: 84,
      regate: 86,
      defensa: 84,
      fisico: 85
    },
    fechaRegistro: '2026-03-01'
  },
  {
    id: '4',
    nombre: 'Endrick',
    edad: 19,
    posicion: 'Delantero Centro',
    club: 'Real Madrid',
    nacionalidad: 'Brasil',
    valorMercado: 60,
    pieHabil: 'Izquierdo',
    calificacion: 82,
    potencial: 95,
    notasScouting: 'Delantero centro con una potencia física increíble y disparo demoledor de media distancia. Excelente instinto goleador y agilidad en el área.',
    atributos: {
      velocidad: 87,
      tiro: 84,
      pase: 70,
      regate: 81,
      defensa: 35,
      fisico: 83
    },
    fechaRegistro: '2026-03-12'
  },
  {
    id: '5',
    nombre: 'Guillaume Restes',
    edad: 21,
    posicion: 'Portero',
    club: 'Toulouse FC',
    nacionalidad: 'Francia',
    valorMercado: 28,
    pieHabil: 'Izquierdo',
    calificacion: 80,
    potencial: 89,
    notasScouting: 'Reflejos felinos en la línea de gol y mucha personalidad en el área. Muy ágil y buena comunicación con la línea defensiva.',
    atributos: {
      velocidad: 62,
      tiro: 25,
      pase: 73,
      regate: 28,
      defensa: 81, // Guardameta reflejos
      fisico: 74
    },
    fechaRegistro: '2026-04-05'
  },
  {
    id: '6',
    nombre: 'Jorrel Hato',
    edad: 20,
    posicion: 'Lateral Izquierdo',
    club: 'Ajax',
    nacionalidad: 'Países Bajos',
    valorMercado: 35,
    pieHabil: 'Izquierdo',
    calificacion: 81,
    potencial: 91,
    notasScouting: 'Defensa moderno que puede actuar perfectamente como lateral o central izquierdo. Gran técnica de pase y sobriedad táctica.',
    atributos: {
      velocidad: 80,
      tiro: 52,
      pase: 78,
      regate: 76,
      defensa: 80,
      fisico: 76
    },
    fechaRegistro: '2026-04-18'
  },
  {
    id: '7',
    nombre: 'Rico Lewis',
    edad: 21,
    posicion: 'Lateral Derecho',
    club: 'Manchester City',
    nacionalidad: 'Inglaterra',
    valorMercado: 40,
    pieHabil: 'Derecho',
    calificacion: 83,
    potencial: 90,
    notasScouting: 'Inteligencia espacial sobresaliente. Se interioriza constantemente para actuar como un mediocentro táctico más. Precisión milimétrica de pase.',
    atributos: {
      velocidad: 79,
      tiro: 65,
      pase: 83,
      regate: 80,
      defensa: 78,
      fisico: 73
    },
    fechaRegistro: '2026-05-02'
  },
  {
    id: '8',
    nombre: 'Arda Güler',
    edad: 21,
    posicion: 'Mediocentro Ofensivo',
    club: 'Real Madrid',
    nacionalidad: 'Turquía',
    valorMercado: 45,
    pieHabil: 'Izquierdo',
    calificacion: 83,
    potencial: 93,
    notasScouting: 'Visión de juego fenomenal y un golpeo de balón pulcro y letal. Capacidad mágica en zonas reducidas para crear juego.',
    atributos: {
      velocidad: 75,
      tiro: 81,
      pase: 85,
      regate: 88,
      defensa: 48,
      fisico: 68
    },
    fechaRegistro: '2026-05-14'
  },
  {
    id: '9',
    nombre: 'João Neves',
    edad: 21,
    posicion: 'Mediocentro Organizador',
    club: 'PSG',
    nacionalidad: 'Portugal',
    valorMercado: 62,
    pieHabil: 'Derecho',
    calificacion: 85,
    potencial: 92,
    notasScouting: 'Motor dinámico e infatigable. Distribuidor de posesión excelente y fantástica recuperación de balón a pesar de su estatura.',
    atributos: {
      velocidad: 78,
      tiro: 68,
      pase: 84,
      regate: 82,
      defensa: 81,
      fisico: 80
    },
    fechaRegistro: '2026-05-20'
  }
];
