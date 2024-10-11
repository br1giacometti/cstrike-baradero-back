import { Injectable } from '@nestjs/common';
import Team from 'Stock/domain/models/Team';
import TeamNotFoundException from '../exception/TeamNotFoundException';

@Injectable()
export default class TeamValidations {
  validateExistingTeam(team: Team): boolean {
    if (team === null) {
      throw new TeamNotFoundException();
    }
    return true;
  }
}
