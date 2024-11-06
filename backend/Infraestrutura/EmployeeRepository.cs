using TesteApi.Models;

namespace TesteApi.Infraestrutura
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ConnectionContext context;

        public EmployeeRepository(ConnectionContext context)
        {
            this.context = context;
        }

        public void Add(Employee employee)
        {
            context.Employees.Add(employee);
            context.SaveChanges();
        }

        public List<Employee> GetAll()
        {
            return context.Employees.ToList();
        }
    }
}
