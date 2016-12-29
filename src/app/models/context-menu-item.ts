import { ContextMenuItemType } from './context-menu-item-type';

export class ContextMenuItem {
    name: string;
    type: ContextMenuItemType;
    path: string;
    default: boolean;
}
