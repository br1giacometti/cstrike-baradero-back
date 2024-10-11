import { Injectable } from '@nestjs/common';

import TeamRepository from '../repository/TeamRepository';
import TeamValidations from '../validations/TeamValidations';
import Team from 'Stock/domain/models/Team';

@Injectable()
export default class TeamService {
  constructor(
    private readonly repository: TeamRepository,
    private readonly validator: TeamValidations,
  ) {}

  async createTeam(team: Team): Promise<Team> {
    const teamCreated = await this.repository.insert({
      name: team.name,
      id: team.id,
      players: team.players,
    });
    return teamCreated;
  }

  async updateTeam(id: number, team: Team): Promise<Team> {
    const teamCreated = await this.repository.update(id, {
      name: team.name,
    });
    return teamCreated;
  }

  async deleteTeam(teamId: number): Promise<Team> {
    return await this.repository.delete(teamId);
  }

  async findTeamById(teamId: number): Promise<Team> {
    const team = await this.repository.findById(teamId);
    this.validator.validateExistingTeam(team);
    return team;
  }

  async fetchAllTeams(): Promise<Team[]> {
    const team = await this.repository.findAll();
    return team;
  }
}
