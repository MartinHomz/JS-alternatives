using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoBlazor.Model
{
	public enum OrderTodo
	{
		None,
		Important,
		EndDate,
		Alphabet,
		CreateDate
	}

	public class TList
	{
		public long? Id { get; set; }
		/// <summary>
		/// Název seznamu
		/// </summary>
		public string Name { get; set; }
		/// <summary>
		/// Jsou otevřené nedokončené úkoly
		/// </summary>
		public bool UnfinishedOpened { get; set; }
		/// <summary>
		/// Jsou zavřené dokončené úkoly
		/// </summary>
		public bool FinishedOpened { get; set; }
		/// <summary>
		/// CSS třída ikony
		/// </summary>
		public string Icon { get; set; }
		/// <summary>
		/// Podle čeho úkoly řadit
		/// </summary>
		public OrderTodo OrderTodo { get; set; }

		public TList()
		{
			GetTodos = async () => { return await Database.Current.GetTodosByParentId(Id.Value); };
			AddTodoD = async (string text) => { await Database.Current.AddTodo(text, Id.Value); };
		}
		public TList(string name, string icon = "", bool unfinishedOpened = true, bool finishedOpened=false, OrderTodo orderTodo = OrderTodo.None)
		{
			Name = name;
			Icon = icon;
			UnfinishedOpened = unfinishedOpened;
			FinishedOpened = finishedOpened;
			OrderTodo = orderTodo;
			GetTodos = async () => { return await Database.Current.GetTodosByParentId(Id.Value); };
			AddTodoD = async (string text) => { await Database.Current.AddTodo(text, Id.Value); } ;
		}

		public TList(string name, Func<Task<List<Todo>>> get, Func<string,Task> add, string icon = "", OrderTodo orderTodo = OrderTodo.None)
		{
			Id = Database.UndividedTListId;
			Name = name;
			Icon = icon;
			UnfinishedOpened = true;
			FinishedOpened = false;
			OrderTodo = orderTodo;
			GetTodos = get;
			AddTodoD = add;
		}

		/// <summary>
		/// Úprava seznamu úkolů v databázi
		/// </summary>
		/// <param name="todoList">Seznam úkolů</param>
		public async Task Update()
		{
			await Database.Current.UpdateTList(this);
		}

		/// <summary>
		/// Smazání seznamu z databáze
		/// </summary>
		/// <param name="id">ID seznamu</param>
		/// <returns></returns>
		public async Task Remove()
		{
			await Database.Current.RemoveTList(Id.Value);
		}

		/// <summary>
		/// Delegát na funkci pro získání úkolů (delegát, aby se tento způsob mohl měnit)
		/// </summary>
		private Func<Task<List<Todo>>> GetTodos;
		/// <summary>
		/// Delegát na funkci pro přidání úkolů (delegát, aby se tento způsob mohl měnit)
		/// </summary>
		private Func<string,Task> AddTodoD;

		public async Task AddTodo(string text)
		{
			await AddTodoD(text);
		}

		public async Task<List<Todo>> GetTodosByOrder()
		{
			List<Todo> todos = await GetTodos();
			return OrderTodo switch
			{
				OrderTodo.None => todos,
				OrderTodo.Important => todos.OrderByDescending(x => x.Important).ToList(),
				OrderTodo.EndDate => todos.OrderBy(x => x.EndDate).ToList(),
				OrderTodo.CreateDate => todos.OrderBy(x => x.CreateDate).ToList(),
				OrderTodo.Alphabet => todos.OrderBy(x => x.Text).ToList(),
				_ => todos,
			};
		}

		/// <summary>
		/// Vrací počet nedokončených úkolů
		/// </summary>
		/// <returns></returns>
		public async Task<string> GetUnfinishedTodosCount()
		{
			int count = (await GetTodos()).Where(x => !x.Done).ToList().Count;
			return count > 0 ? count.ToString() : "";
		}

		public static OrderTodo GetOrderByString(string text)
		{
			if (text == "None")
				return OrderTodo.None;
			else if (text == "Important")
				return OrderTodo.Important;
			else if (text == "CreateDate")
				return OrderTodo.CreateDate;
			else if (text == "EndDate")
				return OrderTodo.EndDate;
			else if (text == "Alphabet")
				return OrderTodo.Alphabet;
			else
				return OrderTodo.None;
		}
	}
}
