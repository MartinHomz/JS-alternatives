using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoBlazor.Model
{
	public class Todo : TStep
	{
		/// <summary>
		/// Je úkol důležitý
		/// </summary>
		public bool Important { get; set; } = false;
		/// <summary>
		/// Datum založení úkolu
		/// </summary>
		public DateTime CreateDate { get; set; } = DateTime.Now;
		/// <summary>
		/// Datum splnění úkolu
		/// </summary>
		public DateTime EndDate { get; set; }
		/// <summary>
		/// Poznámka
		/// </summary>
		public string Note { get; set; }

		public Todo()
		{

		}

		public Todo(string text, long parentId = Database.UndividedTListId) : base(text, parentId)
		{
			ParentId = parentId;
			Text = text;
		}

		/// <summary>
		/// Úprava úkolu v databázi
		/// </summary>
		/// <param name="todo">Úkol</param>
		/// <returns></returns>
		public async override Task Update()
		{
			await Database.Current.UpdateTodo(this);
		}

		/// <summary>
		/// Odstranění úkol z databáze
		/// </summary>
		/// <param name="id">Id úkolu</param>
		/// <returns></returns>
		public async override Task Remove()
		{
			await Database.Current.RemoveTodo(Id.Value);
		}

		/// <summary>
		/// Získání kroků
		/// </summary>
		public async Task<List<TStep>> GetTodoSteps() => await Database.Current.GetTStepsByParentId(Id.Value);

		/// <summary>
		/// Přidání kroku
		/// </summary>
		/// <param name="text">Text kroku</param>
		public async Task AddStep(string text)
		{
			await Database.Current.AddTStep(text, Id.Value);
		}
	}
}
