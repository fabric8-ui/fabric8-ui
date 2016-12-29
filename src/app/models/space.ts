import { ProcessTemplate } from './process-template';

export class Space {
    name: String;
    path: String;
    description: String;
    process?: ProcessTemplate;
    private?: boolean;
}
