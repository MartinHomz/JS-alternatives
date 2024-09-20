using Blazored.LocalStorage;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace TodoBlazor.Model
{
	public class Settings : INotifyPropertyChanged
	{
		private static Settings settings;

		public static Settings Current
		{
			get
			{
				if (settings == null)
					settings = new Settings();
				return settings;
			}
		}

		private Settings() { }

		public event PropertyChangedEventHandler PropertyChanged;

		private ISyncLocalStorageService localStorage;
		public ISyncLocalStorageService LocalStorage
		{
			get => localStorage;
			set
			{
				localStorage = value;
				LoadLocalData();
			}
		}

		private bool? darkMode;
		/// <summary>
		/// Má být aplikace zobrazena v tmavém módu
		/// </summary>
		public bool? DarkMode
		{
			get => darkMode;
			set
			{
				darkMode = value;
				LocalStorage.SetItem(nameof(DarkMode), value);
				NotifyPropertyChanged();
			}
		}

		/// <summary>
		/// Vrací css třídu pro barevný mód
		/// </summary>
		/// <returns>CSS třída</returns>
		public string GetColorMode()
		{
			return DarkMode.Value ? "DarkMode" : "LightMode";
		}

		private void NotifyPropertyChanged([CallerMemberName] string propertyName = "")
		{
			PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
		}

		/// <summary>
		/// Načtení uložených dat, či případné nastavení původních dat
		/// </summary>
		private void LoadLocalData()
		{
			try
			{
				DarkMode = LocalStorage.GetItem<bool>(nameof(DarkMode));
			}
			catch
			{
				DarkMode = false;
			}
			if (DarkMode is null)
				DarkMode = false;
		}
	}
}
