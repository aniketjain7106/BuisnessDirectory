using DirectoryManagement.Data;
using DirectoryManagement.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace DirectoryManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessController : ControllerBase
    {
        private readonly DirectoryDbContext _context;

        public BusinessController(DirectoryDbContext context)
        {
            _context = context;
        }

        // GET: api/Business
        // Backend API (C#)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Business>>> GetBusinesses(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? keyword = null,
            [FromQuery] string? sortField = null,
            [FromQuery] string? sortDirection = null)
        {
            var query = _context.Businesses.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(b => b.Name.Contains(keyword) || b.City.Contains(keyword));
            }

            // Apply strong-typed sorting
            if (!string.IsNullOrWhiteSpace(sortField))
            {
                query = sortField.ToLower() switch
                {
                    "name" => (sortDirection?.ToLower() == "desc") ? query.OrderByDescending(b => b.Name) : query.OrderBy(b => b.Name),
                    "city" => (sortDirection?.ToLower() == "desc") ? query.OrderByDescending(b => b.City) : query.OrderBy(b => b.City),
                    _ => query // No sorting if invalid field is passed
                };
            }

            // Pagination
            var totalRecords = await query.CountAsync();
            var businesses = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                TotalRecords = totalRecords,
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalRecords / pageSize),
                Data = businesses
            });
        }


        // POST: api/Business
        [HttpPost]
        public async Task<ActionResult<Business>> CreateBusiness(Business business)
        {
            _context.Businesses.Add(business);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBusinesses), new { id = business.BusinessID }, business);
        }

        // PUT: api/Business/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBusiness(int id, Business business)
        {
            if (id != business.BusinessID)
            {
                return BadRequest();
            }
            _context.Entry(business).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Business/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBusiness(int id)
        {
            var business = await _context.Businesses.FindAsync(id);
            if (business == null)
            {
                return NotFound();
            }
            _context.Businesses.Remove(business);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
