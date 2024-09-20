using Blazored.LocalStorage;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TG.Blazor.IndexedDB;
using TodoBlazor.Model;

namespace TodoBlazor.Pages
{
	public partial class Index
	{
		[Inject] public IJSRuntime JSRuntime { get; set; }
		[Inject] public IndexedDBManager DBManager { get; set; }
		[Inject] public ISyncLocalStorageService LocalStorage { get; set; }
		protected override async Task OnInitializedAsync()
		{
			await State.Current.AppInitialize(StateHasChanged, JSRuntime, DBManager, LocalStorage);
		}
	}
}
