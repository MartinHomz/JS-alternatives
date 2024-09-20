using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TG.Blazor.IndexedDB;

namespace TodoBlazor.Model
{
	public class Database
	{
		public const string TListDbName = "TodoLists";
		public const string TodoDbName = "Todos";
		public const string TStepDbName = "TodoSteps";
		public const int UndividedTListId = -1;
		private static Database database;
		public static Database Current
		{
			get
			{
				if (database == null)
					database = new Database();
				return database;
			}
		}

		private Database() { }

		public IndexedDBManager DbManager { get; set; }

		#region Seznam úkolů
		/// <summary>
		/// Vrací list všech seznamů úkolů
		/// </summary>
		public async Task<List<TList>> GetAllTLists() =>
			await DbManager.GetRecords<TList>(TListDbName);

		/// <summary>
		/// Přidání seznamu úkolů do databáze
		/// </summary>
		/// <param name="name">název seznamu</param>
		public async Task AddTList(string name)
		{
			var newRecord = new StoreRecord<TList>
			{
				Storename = TListDbName,
				Data = new TList(name)
			};
			await DbManager.AddRecord(newRecord);
		}

		/// <summary>
		/// Přidání seznamu úkolů do databáze
		/// </summary>
		/// <param name="name">název seznamu</param>
		public async Task AddTList(TList list)
		{
			var newRecord = new StoreRecord<TList>
			{
				Storename = TListDbName,
				Data = list
			};
			await DbManager.AddRecord(newRecord);
		}

		/// <summary>
		/// Úprava seznamu úkolů v databázi
		/// </summary>
		/// <param name="todoList">Seznam úkolů</param>
		public async Task UpdateTList(TList todoList)
		{
			var updateRecord = new StoreRecord<TList>
			{
				Storename = TListDbName,
				Data = todoList
			};
			await DbManager.UpdateRecord(updateRecord);
		}

		/// <summary>
		/// Smazání seznamu z databáze
		/// </summary>
		/// <param name="id">ID seznamu</param>
		/// <returns></returns>
		public async Task RemoveTList(long id)
		{
			await DbManager.DeleteRecord(TListDbName, id);
			//smaž i všechny úkoly v seznamu
			List<Todo> todos = await GetTodosByParentId(id);
			foreach (Todo todo in todos)
				await RemoveTodo(todo.Id.Value);
		}
		#endregion Seznam úkolů

		#region Úkol
		/// <summary>
		/// Vrací všechny úkoly
		/// </summary>
		public async Task<List<Todo>> GetAllTodos() =>
			await DbManager.GetRecords<Todo>(TodoDbName);

		/// <summary>
		/// Vrací úkoly podle ParentId
		/// </summary>
		/// <param name="id">Id seznamu (ParentId úkolu)</param>
		public async Task<List<Todo>> GetTodosByParentId(long id)
		{
			List<Todo> todos = new List<Todo>();
			var indexSearch = new StoreIndexQuery<long>
			{
				Storename = TodoDbName,
				IndexName = "parentId",
				QueryValue = id,
			};

			var result = await DbManager.GetAllRecordsByIndex<long, Todo>(indexSearch);

			if (result != null)
				todos.AddRange(result);

			return todos;
		}

		/// <summary>
		/// Přidání úkolu do databáze
		/// </summary>
		/// <param name="text">Text úkolu</param>
		/// <param name="todoListId">Id seznamu úkolů, ve kterém se úkol nachází</param>
		public async Task AddTodo(string text, long todoListId)
		{
			StoreRecord<Todo> newRecord = new StoreRecord<Todo>
			{
				Storename = TodoDbName,
				Data = new Todo(text, todoListId)
			};
			await DbManager.AddRecord(newRecord);
		}

		/// <summary>
		/// Přidání úkolu do databáze
		/// </summary>
		/// <param name="todo">Úkol</param>
		public async Task AddTodo(Todo todo)
		{
			StoreRecord<Todo> newRecord = new StoreRecord<Todo>
			{
				Storename = TodoDbName,
				Data = todo
			};
			await DbManager.AddRecord(newRecord);
		}

		/// <summary>
		/// Úprava úkolu v databázi
		/// </summary>
		/// <param name="todo">Úkol</param>
		public async Task UpdateTodo(Todo todo)
		{
			StoreRecord<Todo> updateRecord = new StoreRecord<Todo>
			{
				Storename = TodoDbName,
				Data = todo
			};
			await DbManager.UpdateRecord(updateRecord);
		}

		/// <summary>
		/// Odstranění úkolu z databáze
		/// </summary>
		/// <param name="id">Id úkolu</param>
		public async Task RemoveTodo(long id)
		{
			await DbManager.DeleteRecord(TodoDbName, id);
			List<TStep> steps = await GetTStepsByParentId(id);  //odstranění úkolu včetně jeho kroků
			foreach (TStep step in steps)
				await RemoveTStep(step.Id.Value);
		}

		/// <summary>
		/// Hledání úkolů obsahující text
		/// </summary>
		/// <param name="text">Hledaný text</param>
		/// <returns>Seznam úkolů obsahující text</returns>
		public async Task<List<Todo>> FindTodo(string text) =>
			(await GetAllTodos()).Where(x => x.Text.ToUpper().Contains(text.ToUpper())).ToList();
		#endregion Úkol

		#region Kroky úkolu

		public async Task<List<TStep>> GetAllTSteps() =>
			await DbManager.GetRecords<TStep>(TStepDbName);

		/// <summary>
		/// Vrací kroky podle Id úkolu (ParentId třídy TStep)
		/// </summary>
		/// <param name="id">Id úkolu (ParentId třídy TStep)</param>
		/// <returns></returns>
		public async Task<List<TStep>> GetTStepsByParentId(long id)
		{
			List<TStep> steps = new List<TStep>();
			var indexSearch = new StoreIndexQuery<long>
			{
				Storename = TStepDbName,
				IndexName = "parentId",
				QueryValue = id,
			};

			var result = await DbManager.GetAllRecordsByIndex<long, TStep>(indexSearch);

			if (result != null)
				steps.AddRange(result);

			return steps;
		}

		/// <summary>
		/// Přidání kroku do databáze
		/// </summary>
		/// <param name="text">Text kroku</param>
		/// <param name="todoId">Id úkolu, kterému krok patří</param>
		/// <returns></returns>
		public async Task AddTStep(string text, long todoId)
		{
			StoreRecord<TStep> newRecord = new StoreRecord<TStep>
			{
				Storename = TStepDbName,
				Data = new TStep(text, todoId)
			};

			await DbManager.AddRecord(newRecord);
		}

		/// <summary>
		/// Přidání kroku do databáze
		/// </summary>
		/// <param name="text">Text kroku</param>
		/// <param name="todoId">Id úkolu, kterému krok patří</param>
		/// <returns></returns>
		public async Task AddTStep(TStep step)
		{
			StoreRecord<TStep> newRecord = new StoreRecord<TStep>
			{
				Storename = TStepDbName,
				Data = step
			};

			await DbManager.AddRecord(newRecord);
		}

		/// <summary>
		/// Úprava kroku v databázi
		/// </summary>
		/// <param name="todoStep">Krok</param>
		/// <returns></returns>
		public async Task UpdateTStep(TStep todoStep)
		{
			StoreRecord<TStep> updateRecord = new StoreRecord<TStep>
			{
				Storename = TStepDbName,
				Data = todoStep
			};
			await DbManager.UpdateRecord(updateRecord);
		}

		/// <summary>
		/// Odstranění kroku z databáze
		/// </summary>
		/// <param name="id">Id kroku</param>
		/// <returns></returns>
		public async Task RemoveTStep(long id)
		{
			await DbManager.DeleteRecord(TStepDbName, id);
		}
		#endregion Kroky úkolu


		/// <summary>
		/// Import dat - promaže databázi a načte nová data do databáze z json
		/// </summary>
		/// <param name="json"></param>
		/// <returns></returns>
		public async Task ImportData(string json)
		{
			await DbManager.ClearStore(TListDbName);
			await DbManager.ClearStore(TodoDbName);
			await DbManager.ClearStore(TStepDbName);

			var deserializedLists = new
			{
				TLists = new List<TList>(),
				TodoList = new List<Todo>(),
				StepList = new List<TStep>()
			};
			deserializedLists = JsonConvert.DeserializeAnonymousType(json, deserializedLists);

			foreach (TList list in deserializedLists.TLists)
				await Current.AddTList(list);
			foreach (Todo todo in deserializedLists.TodoList)
				await Current.AddTodo(todo);
			foreach (TStep step in deserializedLists.StepList)
				await Current.AddTStep(step);
		}

		/// <summary>
		/// Export dat z databáze do json
		/// </summary>
		/// <returns></returns>
		public async Task<string> ExportData()
		{
			List<TList> TLists = await Current.GetAllTLists();
			List<Todo> TodoList = await Current.GetAllTodos();
			List<TStep> StepList = await Current.GetAllTSteps();
			if (TLists.Count > 0 || TodoList.Where(x => x.ParentId == UndividedTListId).ToList().Count > 0)
				return JsonConvert.SerializeObject(new { TLists, TodoList, StepList });
			return "";
		}
	}
}
