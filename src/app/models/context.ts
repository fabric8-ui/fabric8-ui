import { Entity } from 'ngx-login-client';
import { Space, Team } from 'ngx-fabric8-wit';
import { LinkType } from './link-type';
import { ContextType } from './context-type';

export class Context {
    // The entity that this context is for
    entity: Entity;
    space?: Space;
    team?: Team;
    // This is a union type
    // The UI will load this as a string, but will then convert it to a ContextType
    type: string | ContextType;
    path: string;
    name: string;
}
