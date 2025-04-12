export type Query = {
  note: string;
  query: string;
} 

export type Case = {
  title: string;
  type: "single" | "compare";
  queries: Query[];
}

export type Section = {
  title: string;
  cases: Case[];
}