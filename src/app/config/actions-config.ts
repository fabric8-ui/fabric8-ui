import { Action } from './action';

/*
 * A filter config containing:
 *
 * moreActions - Optional list of secondary actions to display on the toolbar action pulldown menu
 * primaryActions - List of primary actions to display on the toolbar
 */
export class ActionsConfig {
  moreActions?: Action[];
  primaryActions: Action[];
}
