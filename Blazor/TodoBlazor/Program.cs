using Blazored.LocalStorage;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using TG.Blazor.IndexedDB;
using TodoBlazor.Model;

namespace TodoBlazor
{
	public class Program
	{
		public static async Task Main(string[] args)
		{
			var builder = WebAssemblyHostBuilder.CreateDefault(args);
			builder.RootComponents.Add<App>("#app");
			builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

			builder.Services.AddBlazoredLocalStorage();


			builder.Services.AddIndexedDB(dbStore =>
			{
				dbStore.DbName = "TodoDB";
				dbStore.Version = 1;

				dbStore.Stores.Add(new StoreSchema
				{
					Name = Database.TListDbName,
					PrimaryKey = new IndexSpec { Name = "id", KeyPath = "id", Auto = true },
					Indexes = new List<IndexSpec>
					{
						new IndexSpec{Name="name"               , KeyPath = "name", Auto=false},
						new IndexSpec{Name="icon"               , KeyPath = "icon", Auto=false},
						new IndexSpec{Name="unfinishedOpened"   , KeyPath = "unfinishedOpened", Auto=false},
						new IndexSpec{Name="finishedOpened"     , KeyPath = "finishedOpened", Auto=false},
						new IndexSpec{Name="orderTask"          , KeyPath = "orderTask", Auto=false},
					}
				});

				dbStore.Stores.Add(new StoreSchema
				{
					Name = Database.TodoDbName,
					PrimaryKey = new IndexSpec { Name = "id", KeyPath = "id", Auto = true },
					Indexes = new List<IndexSpec>
					{
						new IndexSpec{Name="parentId"	, KeyPath = "parentId", Auto=false},
						new IndexSpec{Name="done"		, KeyPath = "done", Auto=false},
						new IndexSpec{Name="text"       , KeyPath = "text", Auto=false},
						new IndexSpec{Name="important"  , KeyPath = "important", Auto=false},
						new IndexSpec{Name="createDate" , KeyPath = "createDate", Auto=false},
						new IndexSpec{Name="endDate"	, KeyPath = "endDate", Auto=false},
						new IndexSpec{Name="note"       , KeyPath = "note", Auto=false},
					}
				});

				dbStore.Stores.Add(new StoreSchema
				{
					Name = Database.TStepDbName,
					PrimaryKey = new IndexSpec { Name = "id", KeyPath = "id", Auto = true },
					Indexes = new List<IndexSpec>
					{
						new IndexSpec{Name="parentId"   , KeyPath = "parentId", Auto=false},
						new IndexSpec{Name="done"       , KeyPath = "done", Auto=false},
						new IndexSpec{Name="text"       , KeyPath = "text", Auto=false},
					}
				});
			});

			await builder.Build().RunAsync();
		}
	}
}
