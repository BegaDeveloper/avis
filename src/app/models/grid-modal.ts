export interface GridModal<T> {
  id: number;
  content: T,
}

export interface PlanGridModal<T> extends GridModal<T> {
  activate: boolean;
}
