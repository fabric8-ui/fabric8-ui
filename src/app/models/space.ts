import { Team } from './team';
import { ProcessTemplate } from './process-template';

export interface Space {
    name: String;
    path: String;
    description: String;
    process?: ProcessTemplate;
    privateSpace?: boolean;
    teams: Team[];
    defaultTeam: Team;
}
