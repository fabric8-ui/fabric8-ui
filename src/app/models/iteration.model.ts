export class IterationModel {
  attributes: IterationAttributes;
  id: string;
  links?: IterationLinks;
  relationships: IterationRelations;
  type: string;
}

export class IterationAttributes {
  endAt?: string;
  startAt?: string;
  name: string;
  state?: string;
}

export class IterationLinks {
  self: string;
}

export class IterationRelations {
  space: {
    data: {
      id: string;
      type: string;
    },
    links: {
      self: string;
    }
  };
}
