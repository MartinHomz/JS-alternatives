var Settings = /** @class */ (function () {
    function Settings() {
    }
    Settings.Current = function () {
        if (!this.settings) {
            this.settings = new Settings();
        }
        return this.settings;
    };
    Settings.prototype.SetDarkMode = function (value) {
        localStorage.setItem("DarkMode", value);
    };
    Settings.prototype.GetDarkMode = function () {
        var darkMode = localStorage.getItem("DarkMode");
        if (darkMode == null)
            return false;
        else
            return darkMode;
    };
    return Settings;
}());
//# sourceMappingURL=Settings.js.map