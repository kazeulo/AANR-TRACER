export type Section = {
  title: string;
  definition: string;
  examples?: string[];
};

export type Category = {
  title: string;
  icon: string;
  sections: Section[];
};