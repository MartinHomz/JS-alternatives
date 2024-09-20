import 'dart:html';

class Settings {
  static final Settings Current = Settings._settings();

  factory Settings() {
    return Current;
  }

  Settings._settings();

  void SetDarkMode(bool value) {
    window.localStorage['DarkMode'] = value.toString();
  }

  String GetDarkMode() {
    var darkMode = window.localStorage['DarkMode'];
    return (darkMode == null) ? 'false' : darkMode;
  }
}
