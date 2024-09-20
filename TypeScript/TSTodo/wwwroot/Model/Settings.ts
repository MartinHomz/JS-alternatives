class Settings {
    private static settings: Settings;
    private constructor() { }

    public static Current(): Settings {
        if (!this.settings) {
            this.settings = new Settings();
        }
        return this.settings;
    }

    public SetDarkMode(value: string) {
        localStorage.setItem("DarkMode", value);
    }

    public GetDarkMode() {
        let darkMode: string = localStorage.getItem("DarkMode")
        if (darkMode == null)
            return false;
        else
            return darkMode;
    }
}