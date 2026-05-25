export interface CreateProgramRequest {
  name: string;
  description: string;
  startDate: string;  
  endDate: string;
  budget: number;
  status: boolean;
}

export interface CreateProgramResponse {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: boolean;
}

export interface GetProgram {
  programId: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: boolean;
}

export interface UpdateProgramRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: boolean;
}

export interface UpdateProgramResponse extends GetProgram {}
export interface DeleteProgramResponse extends GetProgram {}

export interface FilterProgramsRequest {
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}
