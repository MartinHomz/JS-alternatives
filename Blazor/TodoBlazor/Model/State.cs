using Blazored.LocalStorage;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TG.Blazor.IndexedDB;

namespace TodoBlazor.Model
{
	public class State
	{
		private static State state;
		public static State Current
		{
			get
			{
				if (state == null)
					state = new State();
				return state;
			}
		}

		private State() { }

		public TList TodayTodos { get; set; } = new TList("Dnešní úkoly",
																async () => { return (await Database.Current.GetAllTodos()).Where(x => x.EndDate.Date == DateTime.Now.Date).ToList(); },
																async (string text) => { await Database.Current.AddTodo(new Todo { Text = text, EndDate = DateTime.Now.Date }); },
																"u-text-yellow bi bi-sun");
		public TList ImportantTodos { get; set; } = new TList("Důležité úkoly",
																	async () => { return (await Database.Current.GetAllTodos()).Where(x => x.Important).ToList(); },
																	async (string text) => { await Database.Current.AddTodo(new Todo { Text = text, Important = true }); },
																	"u-text-red bi bi-star");
		public TList PlannedTodos { get; set; } = new TList("Plánované úkoly",
																  async () => { return (await Database.Current.GetAllTodos()).Where(x => x.EndDate != DateTime.MinValue).ToList(); },
																  async (string text) => { await Database.Current.AddTodo(new Todo { Text = text, EndDate = DateTime.Now.Date }); },
																  "u-text-blue bi bi-calendar");
		public TList UndividedTodos { get; set; } = new TList("Nezařazené úkoly",
															  async () => { return await Database.Current.GetTodosByParentId(Database.UndividedTListId); },
															  async (string text) => { await Database.Current.AddTodo(new Todo(text)); },
															  "u-text-green bi bi-check-all");

		public List<TList> TLists { get; set; }
		public List<Todo> Todos { get; set; }
		public List<TStep> TSteps { get; set; }
		public TList CurrentTList { get; set; }

		public Todo CurrentTodo { get; set; }
		public List<Todo> UnfinishedTodos { get; set; }
		public List<Todo> FinishedTodos { get; set; }

		#region Základní ovládání
		public async Task AppInitialize(Action StateHasChanged, IJSRuntime jSRuntime, IndexedDBManager DbManager, ISyncLocalStorageService localStorage)
		{
			//Inicializace databáze
			Database.Current.DbManager = DbManager;
			//Inicializace GUI
			GUI.Current.StateHasChanged += StateHasChanged;
			GUI.Current.JSRuntime = jSRuntime;
			//Nastavení aplikace
			Settings.Current.PropertyChanged += (o, e) => { StateHasChanged(); };
			Settings.Current.LocalStorage = localStorage;
			//Načtení dat
			await SwitchTList(Current.TodayTodos);
			await LoadTLists();
		}

		public async Task ImportData(InputFileChangeEventArgs e)
		{
			try
			{
				IBrowserFile jsonFile = e.File;
				var buffers = new byte[jsonFile.Size];
				await jsonFile.OpenReadStream().ReadAsync(buffers);
				string json = System.Text.Encoding.Default.GetString(buffers);
				await Database.Current.ImportData(json);
				HideRightSidebar();
				await LoadTLists();
				await SwitchTList(Current.TodayTodos);
			}
			catch
			{
				GUI.Current.ShowTextDialog("Chyba", "Nastala chyba při čtení souboru");
			}
		}

		public async Task ExportData()
		{
			string json = await Database.Current.ExportData();
			if (!string.IsNullOrEmpty(json))
			{
				byte[] jsonBytes = System.Text.Encoding.UTF8.GetBytes(json);
				GUI.Current.DownloadFile(Convert.ToBase64String(jsonBytes));
			}
			else
				GUI.Current.ShowTextDialog("Chyba", "Nelze uložit soubor, pokud je databáze prázdná");
		}

		public void ShowSearchView()
		{
			HideRightSidebar();
			GUI.Current.SearchView = true;
			Current.CurrentTList = null;
			Current.CurrentTodo = null;
			Current.Todos = null;
			GUI.Current.SearchText = "";
			GUI.Current.StateHasChanged();
		}

		public async Task Search(ChangeEventArgs args)
		{
			GUI.Current.SearchText = (string)args.Value;
			await LoadTodos();
		}

		public async Task SearchTodoDividerClick()
		{

		}

		public void HideRightSidebar()
		{
			if (GUI.Current.RightSidebarStatus == SidebarState.Opened)
				GUI.Current.ToggleRightSidebar();
			Current.CurrentTodo = null;
		}

		public void SetColorMode(ChangeEventArgs args)
		{
			Settings.Current.DarkMode = (bool)args.Value;
		}
		#endregion Základní ovládání

		#region TList
		private async Task LoadTLists()
		{
			Current.TLists = await Database.Current.GetAllTLists();
			GUI.Current.StateHasChanged();
		}
		public async Task SwitchTList(TList todoList)
		{
			GUI.Current.SearchView = false;
			Current.CurrentTList = todoList;
			HideRightSidebar();
			await LoadTodos();
		}

		public async Task AddNewTListTextKeyUp(KeyboardEventArgs args)
		{
			if (args.Key == "Enter")
				await AddNewTList();
		}

		public async Task AddNewTList()
		{
			if (!string.IsNullOrEmpty(GUI.Current.NewTListName))
			{
				await Database.Current.AddTList(GUI.Current.NewTListName);
				GUI.Current.NewTListName = "";
				await LoadTLists();
			}
			else
				GUI.Current.ShowTextDialog("Chyba", "Název seznamu nesmí být prázdný");
		}

		public async Task TListNameChange(ChangeEventArgs args)
		{
			string text = (string)args.Value;
			if (!string.IsNullOrEmpty(text))
			{
				CurrentTList.Name = text;
				await CurrentTList.Update();
				await LoadTLists();
			}
			else
				GUI.Current.ShowTextDialog("Chyba", "Název seznamu nesmí být prázdný");
		}

		public async Task TListOrderTodoChange(ChangeEventArgs args)
		{
			CurrentTList.OrderTodo= TList.GetOrderByString((string)args.Value);
			await CurrentTList.Update();
			await LoadTLists();
			await LoadTodos();
		}

		public async Task TListIconChange(ChangeEventArgs args)
		{
			CurrentTList.Icon = (string)args.Value;
			await CurrentTList.Update();
			await LoadTLists();
		}

		public async Task RemoveTList()
		{
			await CurrentTList.Remove();
			await SwitchTList(Current.TodayTodos);
			await LoadTLists();
		}

		public async Task TodoDividerClick(bool unfinishedButton)
		{
			if (unfinishedButton)
				Current.CurrentTList.UnfinishedOpened = !Current.CurrentTList.UnfinishedOpened;
			else
				Current.CurrentTList.FinishedOpened = !Current.CurrentTList.FinishedOpened;

			if (Current.CurrentTList.Id.Value != Database.UndividedTListId)
				await Current.CurrentTList.Update();
			GUI.Current.StateHasChanged();
		}
		#endregion TList

		#region Todo
		private async Task LoadTodos()
		{
			if (!GUI.Current.SearchView)
			{
				Current.Todos = await Current.CurrentTList.GetTodosByOrder();
				UnfinishedTodos = Current.Todos.Where(x => !x.Done).ToList();
				FinishedTodos = Current.Todos.Where(x => x.Done).ToList();
			}
			else
			{
				if (!string.IsNullOrEmpty(GUI.Current.SearchText))
					Current.Todos = await Database.Current.FindTodo(GUI.Current.SearchText);
				else
					Current.Todos = new List<Todo>();
			}
			GUI.Current.StateHasChanged();
		}

		public async Task TodoSelected(long id)
		{
			Todo todo = Current.Todos.Find(x => x.Id.Value == id);
			if (Current.CurrentTodo != todo)
			{
				Current.CurrentTodo = todo;
				await LoadTSteps();
				if (GUI.Current.RightSidebarStatus == SidebarState.Closed)
					GUI.Current.ToggleRightSidebar();
			}
			else
				Current.HideRightSidebar();
			GUI.Current.StateHasChanged();
		}

		public async Task AddNewTodoTextKeyUp(KeyboardEventArgs args)
		{
			if (args.Key == "Enter")
				await AddTodo();
		}

		public async Task AddTodo()
		{
			if (!string.IsNullOrEmpty(GUI.Current.NewTodoText))
			{
				await Current.CurrentTList.AddTodo(GUI.Current.NewTodoText);
				GUI.Current.NewTodoText = "";
				await LoadTodos();
			}
			else
				GUI.Current.ShowTextDialog("Chyba", "Text úkolu nesmí být prázdný");
		}

		public async Task TodoDoneChanged(long id)
		{
			Todo todo = Current.Todos.Find(x => x.Id.Value == id);
			todo.Done = !todo.Done;
			await todo.Update();
			await LoadTodos();
		}

		public async Task TodoImportantChanged(long id)
		{
			Todo todo = Current.Todos.Find(x => x.Id.Value == id);
			todo.Important = !todo.Important;
			await todo.Update();
			await LoadTodos();
		}

		public async Task TodoTextChanged(ChangeEventArgs args)
		{
			string text = (string)args.Value;
			if (!string.IsNullOrEmpty(text))
			{
				CurrentTodo.Text = text;
				await CurrentTodo.Update();
				await LoadTodos();
			}
			else
				GUI.Current.ShowTextDialog("Chyba", "Text úkolu nesmí být prázdný");
		}

		public async Task EndDateChanged(ChangeEventArgs args)
		{
			CurrentTodo.EndDate = Convert.ToDateTime((string)args.Value);
			await CurrentTodo.Update();
			await LoadTodos();
		}

		public async Task NoteChanged(ChangeEventArgs args)
		{
			CurrentTodo.Note = (string)args.Value;
			await CurrentTodo.Update();
			await LoadTodos();
		}

		public async Task RemoveTodo()
		{
			await CurrentTodo.Remove();
			HideRightSidebar();
			await LoadTodos();
		}
		#endregion Todo

		#region TStep
		private async Task LoadTSteps()
		{
			Current.TSteps = await Current.CurrentTodo.GetTodoSteps();
			GUI.Current.StateHasChanged();
		}

		public async Task AddNewTStepTextKeyUp(KeyboardEventArgs args)
		{
			if (args.Key == "Enter")
				await AddTStep();
		}

		public async Task AddTStep()
		{
			if (!string.IsNullOrEmpty(GUI.Current.NewTStepText))
			{
				await Current.CurrentTodo.AddStep(GUI.Current.NewTStepText);
				GUI.Current.NewTStepText = "";
				await LoadTSteps();
			}
			else
				GUI.Current.ShowTextDialog("Chyba", "Text kroku nesmí být prázdný");
		}

		public async Task TStepCheckedChanged(long id)
		{
			TStep step = Current.TSteps.Find(x => x.Id.Value == id);
			step.Done = !step.Done;
			await step.Update();
			await LoadTSteps();
		}

		public async Task TStepTextChanged(ChangeEventArgs args, long id)
		{
			string text = (string)args.Value;
			if (!string.IsNullOrEmpty(text))
			{
				TStep step = Current.TSteps.Find(x => x.Id.Value == id);
				step.Text = (string)args.Value;
				await step.Update();
				await LoadTSteps();
			}
			else
				GUI.Current.ShowTextDialog("Chyba", "Text kroku nesmí být prázdný");
		}

		public async Task RemoveTStep(long id)
		{
			TStep step = Current.TSteps.Find(x => x.Id.Value == id);
			await step.Remove();
			await LoadTSteps();
		}
		#endregion TStep
	}
}
