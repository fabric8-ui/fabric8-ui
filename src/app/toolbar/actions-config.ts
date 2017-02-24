import { Action } from './action';

/*
 * A filter config containing:
 *
 * actionsInclude  - Optional flag to use custom action template
 * moreActions - Optional list of secondary actions to display on the toolbar action pulldown menu
 * primaryActions - List of primary actions to display on the toolbar
 */
export class ActionsConfig {
  actionsInclude?: boolean = false;
  moreActions?: Action[];
  primaryActions: Action[];
}
