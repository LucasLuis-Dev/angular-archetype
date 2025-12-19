export interface ExampleModel {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Type para criação (sem ID)
export type CreateExampleModel = Omit<ExampleModel, 'id' | 'createdAt' | 'updatedAt'>;

// Type para atualização parcial
export type UpdateExampleModel = Partial<Omit<ExampleModel, 'id'>>;
