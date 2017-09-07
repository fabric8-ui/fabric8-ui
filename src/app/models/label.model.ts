export class LabelModel {
  attributes?: LabelAttributes;
  id: string;
  links: LabelLinks
}

export class LabelAttributes {
  name: string;
  color: string;
}

export class LabelLinks {
  self: string;
}
