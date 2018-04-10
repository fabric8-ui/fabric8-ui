import { LinkCategory } from './link-category';
import {
  modelUI,
  modelService,
  Mapper,
  MapTree,
  switchModel,
  cleanObject
} from './common.model';

export class LinkType {
  id: string;
  type: string;
  attributes: {
    'description': string
    'forward_name': string,
    'name': string,
    'reverse_name': string,
    'topology': string,
    'version': number
  };
  relationships: {
    // 'link_category': LinkCategory,
    'link_category': {
      'data': {
        'id': string,
        'type': string
      }
    }
  };
}

export class MinimizedLinkType {
  name: string;
  linkId: string;
  linkType: string;
}

export interface LinkTypeService extends LinkType {}

export interface LinkTypeUI {
  id: string;
  name: string;
  linkType: string;
}
