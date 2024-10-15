export enum TournamentStage {
  GROUP_STAGE = 'GROUP_STAGE', // Rondas iniciales (todos vs todos)
  SEMIFINALS = 'SEMIFINALS', // Semifinales basadas en la tabla
  THIRD_PLACE = 'THIRD_PLACE', // Partido por tercer y cuarto puesto
  FINAL = 'FINAL', // Partido final
  COMPLETED = 'COMPLETED', // Torneo finalizado
}
