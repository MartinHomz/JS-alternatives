class Settings
  settings = null
  class PrivateClass
    SetDarkMode: (value) ->
      localStorage.setItem "DarkMode", value
    GetDarkMode: ->
        darkMode = localStorage.getItem "DarkMode"
        if darkMode is null then false;
        darkMode
  @Current: ->
    settings ?= new PrivateClass()

window.Settings = Settings.Current()