export interface Operator {
  id?: number;
  name: string;
  logo: string[];
  smallLogo: string[];
}

export class OperatorClass implements Operator {
  constructor(public name: string, public logo: string[], public smallLogo: string[]) {}
}
