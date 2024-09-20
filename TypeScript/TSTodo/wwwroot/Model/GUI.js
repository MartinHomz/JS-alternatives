/// <reference path="jquery.d.ts" />
var SidebarState;
(function (SidebarState) {
    SidebarState[SidebarState["Opened"] = 0] = "Opened";
    SidebarState[SidebarState["Closed"] = 1] = "Closed";
})(SidebarState || (SidebarState = {}));
var DialogContent;
(function (DialogContent) {
    DialogContent[DialogContent["Text"] = 0] = "Text";
    DialogContent[DialogContent["Settings"] = 1] = "Settings";
    DialogContent[DialogContent["TListSettings"] = 2] = "TListSettings";
})(DialogContent || (DialogContent = {}));
var GUI = /** @class */ (function () {
    function GUI() {
        this.SearchView = false;
        this.LeftSidebarStatus = SidebarState.Closed;
        this.RightSidebarStatus = SidebarState.Closed;
        this.DialogContent = DialogContent.Text;
    }
    GUI.Current = function () {
        if (!this.gui) {
            this.gui = new GUI();
        }
        return this.gui;
    };
    GUI.prototype.Initialize = function () {
        this.SetColorMode();
        this.BaseInitialize();
    };
    GUI.prototype.BaseInitialize = function () {
        var _this = this;
        $("#btnHideLeftSidebar").click(function () { _this.ToggleLeftSidebar(); });
        $("#btnLeftSidebarSettings").click(function () { _this.ShowSettingsDialog(); });
        $("#fileLeftSidebarImport").change(function (e) { State.Current().ImportData(e.target); });
        $("#btnLeftSidebarExport").click(function () { State.Current().ExportData(); });
        $("#btnLeftSidebarSearch").click(function () { State.Current().ShowSearchView(); });
        $("#txtNewTListText").keyup(function (e) { State.Current().AddNewTListTextKeyUp(e); });
        $("#btnAddNewTList").click(function () { State.Current().AddNewTList(); });
        if (this.LeftSidebarStatus == SidebarState.Closed)
            $("#LeftSidebar").addClass("is-hidden");
        if (this.RightSidebarStatus == SidebarState.Closed)
            $("#RightSidebar").addClass("is-hidden");
        $("#txtRightSidebarTodoText").change(function (e) { State.Current().TodoTextChanged(e.target); });
        $("#btnAddNewTStep").click(function () { State.Current().AddTStep(); });
        $("#txtNewTStepText").keyup(function (e) { State.Current().AddNewTStepTextKeyUp(e); });
        $("#dtpRightSidebarTodoEndDate").change(function (e) { State.Current().TodoEndDateChanged(e.target); });
        $("#txaRightSidebarTodoNote").change(function (e) { State.Current().TodoNoteChanged(e.target); });
        $("#btnHideRightSidebar").click(function () { State.Current().HideRightSidebar(); });
        $("#btnDeleteTodo").click(function () { State.Current().RemoveTodo(); });
        $("#btnToggleLeftSidebar").click(function () { _this.ToggleLeftSidebar(); });
        $("#txtHeaderTListName").change(function (e) { State.Current().TListNameChange(e.target); });
        $("#btnDeleteTList").click(function () { State.Current().RemoveTList(); });
        $("#btnSettingsTList").click(function () { _this.ShowTListSettingsDialog(); });
        $("#txtSearchText").on("input", function () { State.Current().Search(); });
        $("#Main").click(function () { _this.OutsideClick(); });
        $("#Main").resize(function () { _this.GetContentCoverStyle(); });
        $("#btnAddNewTodo").click(function () { State.Current().AddTodo(); });
        $("#txtNewTodoText").keyup(function (e) { State.Current().AddNewTodoTextKeyUp(e); });
        $("#btnHideDialog").click(function () { _this.HideDialog(); });
        $("#slbIcon").change(function (e) { State.Current().TListIconChange(e.target); });
        $("#slbOrderTodo").change(function (e) { State.Current().TListOrderTodoChange(e.target); });
        $("#chbDarkMode").change(function (e) { State.Current().SetColorMode(e.target); });
        this.HideSearchView();
        $("#chbRightSidebarTodoDone").click(function () { State.Current().TodoDoneChanged(State.Current().CurrentTodo.Id); });
        $("#btnRightSidebarTodoImportant").click(function () { State.Current().TodoImportantChanged(State.Current().CurrentTodo.Id); });
    };
    GUI.prototype.DrawTLists = function () {
        $('#NavigationBaseTLists').empty();
        $('#NavigationUserTLists').empty();
        this.CreateTList(State.Current().TodayTodos, "lstTodayTodos", "NavigationBaseTLists");
        this.CreateTList(State.Current().ImportantTodos, "lstImportantTodos", "NavigationBaseTLists");
        this.CreateTList(State.Current().PlannedTodos, "lstPlannedTodos", "NavigationBaseTLists");
        this.CreateTList(State.Current().UndividedTodos, "lstUndividedTodos", "NavigationBaseTLists");
        for (var _i = 0, _a = State.Current().TLists; _i < _a.length; _i++) {
            var item = _a[_i];
            this.CreateTList(item, "lstItem" + item.Id, "NavigationUserTLists");
        }
    };
    GUI.prototype.CreateTList = function (tList, lstId, container) {
        tList.GetUnfinishedTodosCount(function (result) {
            var markup = $("\n            <li id='" + lstId + "' class='LeftSidebar-item " + (State.Current().CurrentTList == tList ? "is-selected" : "") + "'>\n                <span class='LeftSidebar-itemIcon " + tList.Icon + "'></span>\n                <span class='LeftSidebar-itemText'>" + tList.Name + "</span>\n                <span class='LeftSidebar-itemCount'>" + result + "</span>\n            </li>\n            ");
            markup.appendTo("#" + container);
            $("#" + lstId).click(function () { State.Current().SwitchTList(tList); });
        });
    };
    GUI.prototype.SetRightSidebar = function () {
        $("#chbRightSidebarTodoDone").prop("checked", State.Current().CurrentTodo.Done);
        $("#txtRightSidebarTodoText").val(State.Current().CurrentTodo.Text);
        this.SetRightSidebarTodoImportant(State.Current().CurrentTodo.Important);
        var endDate = new Date(State.Current().CurrentTodo.EndDate);
        $("#dtpRightSidebarTodoEndDate").val(State.Current().CurrentTodo.EndDate != DateMaxValue.toDateString() ? "" + this.formatDate(endDate) : "");
        $("#txaRightSidebarTodoNote").val(State.Current().CurrentTodo.Note);
        $("#lblRightSidebarTodoCreateDate").text(State.Current().CurrentTodo.CreateDate);
    };
    GUI.prototype.formatDate = function (date) {
        var d = new Date(date);
        var month = '' + (d.getMonth() + 1);
        var day = '' + d.getDate();
        var year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('-');
    };
    GUI.prototype.DrawMain = function () {
        $('#TodoDividerContainer').empty();
        if (this.SearchView)
            this.CreateTodoDivider("dvcSearched", "Vyhledáno", true, State.Current().UnfinishedTodos, true);
        else {
            this.SetHeader();
            this.CreateTodoDivider("dvcUnfinished", "Nedokončeno", State.Current().CurrentTList.UnfinishedOpened, State.Current().UnfinishedTodos, true);
            this.CreateTodoDivider("dvcFinished", "Dokončeno", State.Current().CurrentTList.FinishedOpened, State.Current().FinishedTodos, false);
        }
    };
    GUI.prototype.CreateTodoDivider = function (id, text, opened, todos, unfinishedButton) {
        var dividerContainer = id + "TodoContainer";
        var markup = $("\n        <div id='" + id + "' class='TaskDivider'>\n            <span class='TaskDivider-button " + (opened ? "bi bi-chevron-down" : "bi bi-chevron-right") + "'></span>\n            <span>" + text + "</span>\n            <span>" + (todos != undefined && todos.length > 0 ? todos.length : "") + "</span>\n        </div>\n        <div id='" + dividerContainer + "'></div>\n        ");
        markup.appendTo("#TodoDividerContainer");
        $("#" + id).click(function () { State.Current().TodoDividerClick(unfinishedButton); });
        if (todos != undefined && opened) {
            for (var _i = 0, todos_1 = todos; _i < todos_1.length; _i++) {
                var todo = todos_1[_i];
                this.CreateTodo(todo, dividerContainer);
            }
        }
    };
    GUI.prototype.CreateTodo = function (todo, container) {
        var markup = $("\n        <div class='TaskBlock " + (State.Current().CurrentTodo == todo ? "is-selected" : "") + "'>\n            <div class='TaskBlock-check'>\n                <div class='CheckboxContainer'>\n                    <div class='Round'>\n                        <input id='chbTaskDone" + todo.Id + "' " + (todo.Done == true ? "checked" : "") + " type='checkbox' />\n                        <label for='chbTaskDone" + todo.Id + "'></label>\n                    </div>\n                </div>\n            </div>\n            <span id='lblTaskText" + todo.Id + "' class='TaskBlock-text'>" + todo.Text + "</span>\n            <span id='lblTaskImportant" + todo.Id + "' class='TaskBlock-important " + (todo.Important ? "is-checked" : "") + "'>\n                <i class='TaskBlock-importantIcon bi-star-fill'></i>\n            </span>\n        </div>\n        ");
        markup.appendTo("#" + container);
        $("#chbTaskDone" + todo.Id).click(function () { State.Current().TodoDoneChanged(todo.Id); });
        $("#lblTaskText" + todo.Id).click(function () { State.Current().TodoSelected(todo.Id); });
        $("#lblTaskImportant" + todo.Id).click(function () { State.Current().TodoImportantChanged(todo.Id); });
    };
    GUI.prototype.DrawTSteps = function () {
        $('#TStepContainer').empty();
        for (var _i = 0, _a = State.Current().TSteps; _i < _a.length; _i++) {
            var step = _a[_i];
            this.CreateTStep(step);
        }
    };
    GUI.prototype.CreateTStep = function (step) {
        var markup = $("\n        <div class='RightSidebar-step'>\n            <div class='RightSidebar-taskCheck'>\n                <div class='CheckboxContainer'>\n                    <div class='Round'>\n                        <input id='chbStepDone" + step.Id + "' " + (step.Done == true ? "checked" : "") + " type='checkbox' />\n                        <label for='chbStepDone" + step.Id + "'></label>\n                    </div>\n                </div>\n            </div>\n            <span class='RightSidebar-taskText TextBox'>\n                <input id='txtStepText" + step.Id + "' class='TextBox-input' value='" + step.Text + "' type='text' />\n            </span>\n            <button id='btnStepDelete" + step.Id + "' class='Button RightSidebar-taskDelete' title='Smazat krok'>\n                <i class='bi bi-trash'></i>\n            </button>\n        </div>\n        ");
        markup.appendTo("#TStepContainer");
        $("#chbStepDone" + step.Id).click(function () { State.Current().TStepCheckedChanged(step.Id); });
        $("#txtStepText" + step.Id).change(function (e) { State.Current().TStepTextChanged(e.target, step.Id); });
        $("#btnStepDelete" + step.Id).click(function () { State.Current().RemoveTStep(step.Id); });
    };
    GUI.prototype.SetHeader = function () {
        $("#lblHeaderTListIcon").removeAttr('class');
        $("#lblHeaderTListIcon").addClass(State.Current().CurrentTList.Icon);
        if (this.SearchView)
            this.ShowSearchView();
        else
            this.HideSearchView();
        $("#txtHeaderTListName").prop("readonly", State.Current().CurrentTList.Id == UndividedTListId);
        $("#txtHeaderTListName").val(State.Current().CurrentTList.Name);
        if (State.Current().CurrentTList.Id != UndividedTListId)
            $("#TListControls").removeClass("u-d-none");
        else
            $("#TListControls").addClass("u-d-none");
        $("#txtSearchText").val("");
    };
    GUI.prototype.SetColorMode = function () {
        if (Settings.Current().GetDarkMode() == "true") {
            if ($("#Page").hasClass("LightMode"))
                $("#Page").removeClass("LightMode");
            $("#Page").addClass("DarkMode");
        }
        else {
            if ($("#Page").hasClass("DarkMode"))
                $("#Page").removeClass("DarkMode");
            $("#Page").addClass("LightMode");
        }
    };
    GUI.prototype.GetContentCoverStyle = function () {
        if (this.IsSmallScreen() && (this.LeftSidebarStatus == SidebarState.Opened || this.RightSidebarStatus == SidebarState.Opened))
            $("#MainCover").addClass("Main-coverContent");
        else
            $("#MainCover").removeClass("Main-coverContent");
    };
    GUI.prototype.SetRightSidebarTodoImportant = function (todo) {
        if (todo.Important)
            $("#btnRightSidebarTodoImportant").addClass("is-checked");
        else
            $("#btnRightSidebarTodoImportant").removeClass("is-checked");
    };
    GUI.prototype.OutsideClick = function () {
        if (this.IsSmallScreen()) {
            $("#LeftSidebar").addClass("is-hidden");
            this.LeftSidebarStatus = SidebarState.Closed;
            this.GetContentCoverStyle();
        }
    };
    GUI.prototype.ToggleLeftSidebar = function () {
        this.LeftSidebarStatus = this.ToggleSidebar(this.LeftSidebarStatus, "#LeftSidebar");
        this.GetContentCoverStyle();
    };
    GUI.prototype.ToggleRightSidebar = function () {
        this.RightSidebarStatus = this.ToggleSidebar(this.RightSidebarStatus, "#RightSidebar");
        this.GetContentCoverStyle();
    };
    GUI.prototype.ToggleSidebar = function (sidebarStatus, id) {
        switch (sidebarStatus) {
            case SidebarState.Closed:
                $(id).removeClass("is-hidden");
                return SidebarState.Opened;
            default:
                $(id).addClass("is-hidden");
                return SidebarState.Closed;
        }
    };
    GUI.prototype.IsSmallScreen = function () {
        return $("#Page").innerWidth() < 992;
    };
    GUI.prototype.DownloadFile = function (fileBase64) {
        fetch("data:application/json;base64," + fileBase64)
            .then(function (response) { return response.blob(); })
            .then(function (blob) {
            var link = window.document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "TodoExport.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };
    GUI.prototype.ShowSearchView = function () {
        $("#lblHeaderTListIcon").addClass("u-d-none");
        $("#txtHeaderTListName").addClass("u-d-none");
        $("#TListControls").addClass("u-d-none");
        $("#SearchViewEditor").removeClass("u-d-none");
        $("#AddTodoContainer").addClass("u-d-none");
        $("#txtSearchText").val("");
        this.SearchView = true;
    };
    GUI.prototype.HideSearchView = function () {
        $("#lblHeaderTListIcon").removeClass("u-d-none");
        $("#txtHeaderTListName").removeClass("u-d-none");
        $("#TListControls").removeClass("u-d-none");
        $("#SearchViewEditor").addClass("u-d-none");
        $("#AddTodoContainer").removeClass("u-d-none");
        this.SearchView = false;
    };
    GUI.prototype.GetSearchText = function () {
        return $("#txtSearchText").val();
    };
    GUI.prototype.ClearNewTListName = function () {
        $("#txtNewTListText").val("");
    };
    GUI.prototype.GetNewTListName = function () {
        return $("#txtNewTListText").val();
    };
    GUI.prototype.ClearNewTodoText = function () {
        $("#txtNewTodoText").val("");
    };
    GUI.prototype.GetNewTodoText = function () {
        return $("#txtNewTodoText").val();
    };
    GUI.prototype.ClearNewTStepText = function () {
        $("#txtNewTStepText").val("");
    };
    GUI.prototype.GetNewTStepText = function () {
        return $("#txtNewTStepText").val();
    };
    GUI.prototype.ShowTextDialog = function (title, text) {
        this.DialogContent = DialogContent.Text;
        $("#lblDialogHead").text(title);
        $("#DialogTextContainer").text(text);
        this.ShowDialog();
    };
    GUI.prototype.ShowSettingsDialog = function () {
        this.DialogContent = DialogContent.Settings;
        $("#lblDialogHead").text("Nastavení");
        this.ShowDialog();
    };
    GUI.prototype.ShowTListSettingsDialog = function () {
        this.DialogContent = DialogContent.TListSettings;
        $("#lblDialogHead").text("Nastavení seznamu: " + State.Current().CurrentTList.Name);
        this.ShowDialog();
    };
    GUI.prototype.ShowDialog = function () {
        switch (this.DialogContent) {
            case DialogContent.Settings:
                $("#DialogTextContainer").addClass("u-d-none");
                $("#DialogSettingsContainer").removeClass("u-d-none");
                $("#DialogTListSettingsContainer").addClass("u-d-none");
                $("#chbDarkMode").prop("checked", Settings.Current().GetDarkMode() == "true");
                break;
            case DialogContent.TListSettings:
                $("#DialogTextContainer").addClass("u-d-none");
                $("#DialogSettingsContainer").addClass("u-d-none");
                $("#DialogTListSettingsContainer").removeClass("u-d-none");
                $("#slbOrderTodo").val(State.Current().CurrentTList.OrderTodo);
                $("#slbIcon").val(State.Current().CurrentTList.Icon);
                break;
            default:
                $("#DialogTextContainer").removeClass("u-d-none");
                $("#DialogSettingsContainer").addClass("u-d-none");
                $("#DialogTListSettingsContainer").addClass("u-d-none");
                break;
        }
        $("#Dialog").addClass("is-showed");
    };
    GUI.prototype.HideDialog = function () {
        $("#Dialog").removeClass("is-showed");
    };
    return GUI;
}());
//# sourceMappingURL=GUI.js.map