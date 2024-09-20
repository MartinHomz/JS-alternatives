(function() {
  var Settings;

  Settings = (function() {
    var PrivateClass, settings;

    class Settings {
      static Current() {
        return settings != null ? settings : settings = new PrivateClass();
      }

    };

    settings = null;

    PrivateClass = class PrivateClass {
      SetDarkMode(value) {
        return localStorage.setItem("DarkMode", value);
      }

      GetDarkMode() {
        var darkMode;
        darkMode = localStorage.getItem("DarkMode");
        if (darkMode === null) {
          false;
        }
        return darkMode;
      }

    };

    return Settings;

  }).call(this);

  window.Settings = Settings.Current();

}).call(this);


//# sourceMappingURL=Settings.js.map
//# sourceURL=coffeescript