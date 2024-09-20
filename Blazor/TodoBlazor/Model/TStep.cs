using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoBlazor.Model
{
	public class TStep
	{
		public long? Id { get; set; }
		/// <summary>
		/// Id úkolu
		/// </summary>
		public long? ParentId { get; set; } = Database.UndividedTListId;
		/// <summary>
		/// Je úkolu splněný
		/// </summary>
		public bool Done { get; set; } = false;
		/// <summary>
		/// Text úkolu
		/// </summary>
		public string Text { get; set; }

		public TStep()
		{

		}

		public TStep(string text, long parentId = Database.UndividedTListId)
		{
			ParentId = parentId;
			Text = text;
		}

		/// <summary>
		/// Úprava kroku v databázi
		/// </summary>
		/// <returns></returns>
		public virtual async Task Update()
		{
			await Database.Current.UpdateTStep(this);
		}

		/// <summary>
		/// Odstranění kroku z databáze
		/// </summary>
		/// <returns></returns>
		public virtual async Task Remove()
		{
			await Database.Current.RemoveTStep(Id.Value);
		}
	}
}
