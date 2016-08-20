export class Card {
  id: number;
  name: string;
  type: string;
  version: number;
  description: string;
  fields: {
    "system.owner": string,
    "system.state": string
  }
}
