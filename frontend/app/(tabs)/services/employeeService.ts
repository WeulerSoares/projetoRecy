import axios from 'axios';

// Defina o tipo do produto com base no retorno da API
export interface Employee {
  id: number;
  name: string;
  age: number;
  photo?: string;
}

const API_URL = 'https://localhost:7167/api/v1/employee'; // Altere para o IP correto

// Crie uma classe de serviço para centralizar as chamadas
export class EmployeeService {
  // Método para obter todos os Employees
  static async getEmployees(): Promise<Employee[]> {
    const response = await axios.get<Employee[]>(API_URL);
    return response.data;
  }

  // Método para criar um Employee
  static async createEmployee(employee: Employee): Promise<Employee> {
    const response = await axios.post<Employee>(API_URL, employee);
    return response.data;
  }
}