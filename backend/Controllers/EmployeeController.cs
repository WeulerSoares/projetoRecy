using Microsoft.AspNetCore.Mvc;
using TesteApi.Models;
using TesteApi.ViewModel;

namespace TesteApi.Controllers
{
    [ApiController]
    [Route("api/v1/employee")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepository employeeRepository;

        public EmployeeController(IEmployeeRepository employeeRepository)
        {
            this.employeeRepository = employeeRepository;
        }

        [HttpPost]
        public IActionResult Add(EmployeeViewModel employeeViewModel)
        {
            var employee = new Employee(employeeViewModel.Name, employeeViewModel.Age, null);
            employeeRepository.Add(employee);
            
            return Ok();
        }

        [HttpGet]
        public IActionResult Get()
        {
            var employees = employeeRepository.GetAll();

            return Ok(employees);
        }
    }
}
