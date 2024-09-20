using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoBlazor.Model
{
	/// <summary>
	/// Enumerátor značící stav postranního panelu
	/// </summary>
	public enum SidebarState
	{
		Opened = 1,
		Closed = 2
	}

	/// <summary>
	/// Obsah dialogu
	/// </summary>
	public enum DialogContent
	{
		Text,
		Settings,
		TListSettings
	}

	/// <summary>
	/// Singleton pro hlavní komponenty layoutu
	/// </summary>
	public class GUI
	{
		private static GUI gui;
		public static GUI Current
		{
			get
			{
				if (gui == null)
					gui = new GUI();
				return gui;
			}
		}

		private GUI() { }

		[Inject] public IJSRuntime JSRuntime { get; set; }
		/// <summary>
		/// StateHasChanged Indexu
		/// </summary>
		public Action StateHasChanged { get; set; }

		/// <summary>
		/// Synchronní volání JS
		/// </summary>
		private IJSInProcessRuntime IRP => (IJSInProcessRuntime)JSRuntime;

		/// <summary>
		/// Stav levého postranního panelu
		/// </summary>
		public SidebarState LeftSidebarStatus = SidebarState.Closed;
		/// <summary>
		/// Stav pravého postranního panelu
		/// </summary>
		public SidebarState RightSidebarStatus = SidebarState.Closed;
		/// <summary>
		/// Jméno nového seznamu
		/// </summary>
		public string NewTListName { get; set; }
		/// <summary>
		/// Text nového úkolu
		/// </summary>
		public string NewTodoText { get; set; }
		/// <summary>
		/// Text nového kroku
		/// </summary>
		public string NewTStepText { get; set; }
		/// <summary>
		/// Text ke hledání úkolů
		/// </summary>
		public string SearchText { get; set; }
		/// <summary>
		/// Zobrazit hledací zobrazení
		/// </summary>
		public bool SearchView { get; set; } = false;
		/// <summary>
		/// Je zobrazený dialog
		/// </summary>
		public bool DialogShowed = false;
		/// <summary>
		/// Obsah dialogu
		/// </summary>
		public DialogContent DialogContent = DialogContent.Text;
		/// <summary>
		/// Text hlavičky dialogu
		/// </summary>
		public string DialogHeadText { get; set; }
		/// <summary>
		/// Text obsahu dialogu
		/// </summary>
		public string DialogBodyText { get; set; }

		/// <summary>
		/// Získání stylu pro překrytí obsahu, pokud je malé zařízení a otevřený nějaký postranní panel
		/// </summary>
		/// <returns>CSS třída</returns>
		public string GetContentCoverStyle()
		{
			if (IsSmallScreen() && (LeftSidebarStatus == SidebarState.Opened || RightSidebarStatus == SidebarState.Opened))  //malý desktop + otevřený (levý nebo pravý) panel
				return "Main-coverContent";
			else
				return "";
		}

		/// <summary>
		/// Pokud uživatel kliknul na hlavní obsah, když byl otevřený postranní panel, automaticky ho zavře
		/// </summary>
		public void OutsideClick()
		{
			if (IsSmallScreen())
			{
				LeftSidebarStatus = SidebarState.Closed;
				StateHasChanged();
			}
		}

		/// <summary>
		/// Otevření/zavření levého postranního panelu
		/// </summary>
		public void ToggleLeftSidebar()
		{
			ToggleSidebar(ref LeftSidebarStatus);
		}

		/// <summary>
		/// Oteření/zavření pravého postranního panelu
		/// </summary>
		public void ToggleRightSidebar()
		{
			ToggleSidebar(ref RightSidebarStatus);
		}

		/// <summary>
		/// Získání odpovídající css třídy dle stavu postranního panelu
		/// </summary>
		/// <param name="sidebarState">aktuální stav postranního panelu</param>
		/// <returns>CSS třída</returns>
		public string GetSidebarClass(SidebarState sidebarState)
		{
			return sidebarState switch
			{
				SidebarState.Opened => "",
				SidebarState.Closed => "is-hidden",
				_ => "",
			};
		}

		/// <summary>
		/// /// Oteření/zavření postranního panelu
		/// </summary>
		/// <param name="sidebarStatus">aktuální stav postranního panelu</param>
		public void ToggleSidebar(ref SidebarState sidebarStatus)
		{
			sidebarStatus = sidebarStatus switch
			{
				SidebarState.Opened => SidebarState.Closed,
				SidebarState.Closed => SidebarState.Opened,
				_ => SidebarState.Closed,
			};
			StateHasChanged();
		}

		/// <summary>
		/// Je malá obrazovka
		/// </summary>
		private bool IsSmallScreen()
		{
			return (IRP.Invoke<int>("Shared.GetScreenWidth", "Schema") < 992);
		}

		/// <summary>
		/// Stáhnutí souboru
		/// </summary>
		/// <param name="fileBase64">soubor ve formátu Base64</param>
		public void DownloadFile(string fileBase64)
		{
			IRP.InvokeVoid("Shared.SaveAsFile", fileBase64);
		}

		/// <summary>
		/// Vrací css třídu dialogu zobrazující, či skrývající dialog
		/// </summary>
		/// <returns>CSS třída</returns>
		public string GetDialogStyle()
		{
			return DialogShowed ? "is-showed" : "";
		}

		/// <summary>
		/// Zobrazí dialog s textem
		/// </summary>
		/// <param name="title">Nadpis</param>
		/// <param name="text">Obsah</param>
		public void ShowTextDialog(string title, string text)
		{
			DialogContent = DialogContent.Text;
			DialogHeadText = title;
			DialogBodyText = text;
			DialogShowed = true;
			StateHasChanged();
		}

		/// <summary>
		/// Zobrazí dialog pro nastavení
		/// </summary>
		public void ShowSettingsDialog()
		{
			DialogContent = DialogContent.Settings;
			DialogHeadText = "Nastavení";
			DialogShowed = true;
			StateHasChanged();
		}

		/// <summary>
		/// Zobrazí dialog pro nastavení TListu
		/// </summary>
		public void ShowTListSettingsDialog()
		{
			DialogContent = DialogContent.TListSettings;
			DialogHeadText = $"Nastavení seznamu: {State.Current.CurrentTList.Name}";
			DialogShowed = true;
			StateHasChanged();
		}

		/// <summary>
		/// Schování dialogu
		/// </summary>
		public void HideDialog()
		{
			DialogShowed = false;
			StateHasChanged();
		}
	}
}
