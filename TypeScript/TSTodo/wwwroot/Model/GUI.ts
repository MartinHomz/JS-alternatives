/// <reference path="jquery.d.ts" />

enum SidebarState {
    Opened = 0,
    Closed
}

enum DialogContent {
    Text = 0,
    Settings,
    TListSettings
}

class GUI {
    private static gui: GUI;
    private constructor() { }

    public static Current(): GUI {
        if (!this.gui) {
            this.gui = new GUI();
        }
        return this.gui;
    }

    public SearchView: boolean = false;
    public LeftSidebarStatus: SidebarState = SidebarState.Closed;
    public RightSidebarStatus: SidebarState = SidebarState.Closed;
    public DialogContent: DialogContent = DialogContent.Text;

    public Initialize(): void {
        this.SetColorMode();
        this.BaseInitialize();
    }

    public BaseInitialize(): void {
        $("#btnHideLeftSidebar").click(() => { this.ToggleLeftSidebar(); });
        $("#btnLeftSidebarSettings").click(() => { this.ShowSettingsDialog(); });
        $("#fileLeftSidebarImport").change((e) => { State.Current().ImportData(e.target); });
        $("#btnLeftSidebarExport").click(() => { State.Current().ExportData(); });
        $("#btnLeftSidebarSearch").click(() => { State.Current().ShowSearchView(); });
        $("#txtNewTListText").keyup((e) => { State.Current().AddNewTListTextKeyUp(e); });
        $("#btnAddNewTList").click(() => { State.Current().AddNewTList(); });
        if (this.LeftSidebarStatus == SidebarState.Closed)
            $("#LeftSidebar").addClass("is-hidden")
        if (this.RightSidebarStatus == SidebarState.Closed)
            $("#RightSidebar").addClass("is-hidden")
        $("#txtRightSidebarTodoText").change((e) => { State.Current().TodoTextChanged(e.target); });
        $("#btnAddNewTStep").click(() => { State.Current().AddTStep(); });
        $("#txtNewTStepText").keyup((e) => { State.Current().AddNewTStepTextKeyUp(e); });
        $("#dtpRightSidebarTodoEndDate").change((e) => { State.Current().TodoEndDateChanged(e.target); });
        $("#txaRightSidebarTodoNote").change((e) => { State.Current().TodoNoteChanged(e.target); });
        $("#btnHideRightSidebar").click(() => { State.Current().HideRightSidebar(); });
        $("#btnDeleteTodo").click(() => { State.Current().RemoveTodo(); });
        $("#btnToggleLeftSidebar").click(() => { this.ToggleLeftSidebar(); });
        $("#txtHeaderTListName").change((e) => { State.Current().TListNameChange(e.target); });
        $("#btnDeleteTList").click(() => { State.Current().RemoveTList(); });
        $("#btnSettingsTList").click(() => { this.ShowTListSettingsDialog(); });
        $("#txtSearchText").on("input", () => { State.Current().Search(); });
        $("#Main").click(() => { this.OutsideClick(); });
        $("#Main").resize(() => { this.GetContentCoverStyle(); });
        $("#btnAddNewTodo").click(() => { State.Current().AddTodo(); });
        $("#txtNewTodoText").keyup((e) => { State.Current().AddNewTodoTextKeyUp(e); });
        $("#btnHideDialog").click(() => { this.HideDialog(); });
        $("#slbIcon").change((e) => { State.Current().TListIconChange(e.target); });
        $("#slbOrderTodo").change((e) => { State.Current().TListOrderTodoChange(e.target); });
        $("#chbDarkMode").change((e) => { State.Current().SetColorMode(e.target); });
        this.HideSearchView();
        $("#chbRightSidebarTodoDone").click(() => { State.Current().TodoDoneChanged(State.Current().CurrentTodo.Id); });
        $("#btnRightSidebarTodoImportant").click(() => { State.Current().TodoImportantChanged(State.Current().CurrentTodo.Id); });
    }

    public DrawTLists(): void {
        $('#NavigationBaseTLists').empty()
        $('#NavigationUserTLists').empty()
        this.CreateTList(State.Current().TodayTodos, "lstTodayTodos", "NavigationBaseTLists");
        this.CreateTList(State.Current().ImportantTodos, "lstImportantTodos", "NavigationBaseTLists");
        this.CreateTList(State.Current().PlannedTodos, "lstPlannedTodos", "NavigationBaseTLists");
        this.CreateTList(State.Current().UndividedTodos, "lstUndividedTodos", "NavigationBaseTLists");

        for (let item of State.Current().TLists)
            this.CreateTList(item, `lstItem${item.Id}`, "NavigationUserTLists");
    }

    public CreateTList(tList:TList, lstId:string, container:string): void {
        tList.GetUnfinishedTodosCount((result) => {
            let markup: JQuery = $(`
            <li id='${lstId}' class='LeftSidebar-item ${State.Current().CurrentTList == tList ? "is-selected" : ""}'>
                <span class='LeftSidebar-itemIcon ${tList.Icon}'></span>
                <span class='LeftSidebar-itemText'>${tList.Name}</span>
                <span class='LeftSidebar-itemCount'>${result}</span>
            </li>
            `);
            markup.appendTo(`#${container}`);
            $(`#${lstId}`).click(() => { State.Current().SwitchTList(tList); });
        });
    }

    public SetRightSidebar(): void {
        $("#chbRightSidebarTodoDone").prop("checked", State.Current().CurrentTodo.Done);
        $("#txtRightSidebarTodoText").val(State.Current().CurrentTodo.Text);
        this.SetRightSidebarTodoImportant(State.Current().CurrentTodo.Important);
        let endDate:Date = new Date(State.Current().CurrentTodo.EndDate);
        $("#dtpRightSidebarTodoEndDate").val(State.Current().CurrentTodo.EndDate != DateMaxValue.toDateString() ? `${this.formatDate(endDate)}` : "");
        $("#txaRightSidebarTodoNote").val(State.Current().CurrentTodo.Note);
        $("#lblRightSidebarTodoCreateDate").text(State.Current().CurrentTodo.CreateDate);
    }

    public formatDate(date): string {
        let d:Date = new Date(date)
        let month:string = '' + (d.getMonth() + 1)
        let day:string = '' + d.getDate()
        let year:number = d.getFullYear()
        if (month.length < 2)
            month = '0' + month
        if (day.length < 2)
            day = '0' + day
        return [year, month, day].join('-');
    }

    public DrawMain(): void {
        $('#TodoDividerContainer').empty();
        if (this.SearchView)
            this.CreateTodoDivider("dvcSearched", "Vyhledáno", true, State.Current().UnfinishedTodos, true);
        else {
            this.SetHeader()
            this.CreateTodoDivider("dvcUnfinished", "Nedokončeno", State.Current().CurrentTList.UnfinishedOpened, State.Current().UnfinishedTodos, true);
            this.CreateTodoDivider("dvcFinished", "Dokončeno", State.Current().CurrentTList.FinishedOpened, State.Current().FinishedTodos, false);
        }
    }

    public CreateTodoDivider(id: string, text: string, opened: boolean, todos: Todo[], unfinishedButton: boolean): void {
        let dividerContainer: string = `${id}TodoContainer`;
        let markup: JQuery = $(`
        <div id='${id}' class='TaskDivider'>
            <span class='TaskDivider-button ${opened ? "bi bi-chevron-down" : "bi bi-chevron-right"}'></span>
            <span>${text}</span>
            <span>${todos != undefined && todos.length > 0 ? todos.length : ""}</span>
        </div>
        <div id='${dividerContainer}'></div>
        `)
        markup.appendTo(`#TodoDividerContainer`);
        $(`#${id}`).click(() => { State.Current().TodoDividerClick(unfinishedButton); });
        if (todos != undefined && opened) {
            for (let todo of todos)
                this.CreateTodo(todo, dividerContainer);
        }
    }

    public CreateTodo(todo:Todo, container:string): void {
        let markup: JQuery = $(`
        <div class='TaskBlock ${State.Current().CurrentTodo == todo ? "is-selected" : ""}'>
            <div class='TaskBlock-check'>
                <div class='CheckboxContainer'>
                    <div class='Round'>
                        <input id='chbTaskDone${todo.Id}' ${todo.Done == true ? "checked" : ""} type='checkbox' />
                        <label for='chbTaskDone${todo.Id}'></label>
                    </div>
                </div>
            </div>
            <span id='lblTaskText${todo.Id}' class='TaskBlock-text'>${todo.Text}</span>
            <span id='lblTaskImportant${todo.Id}' class='TaskBlock-important ${todo.Important ? "is-checked" : ""}'>
                <i class='TaskBlock-importantIcon bi-star-fill'></i>
            </span>
        </div>
        `);
        markup.appendTo(`#${container}`);
        $(`#chbTaskDone${todo.Id}`).click(() => { State.Current().TodoDoneChanged(todo.Id); });
        $(`#lblTaskText${todo.Id}`).click(() => { State.Current().TodoSelected(todo.Id); });
        $(`#lblTaskImportant${todo.Id}`).click(() => { State.Current().TodoImportantChanged(todo.Id); });
    }

    public DrawTSteps(): void {
        $('#TStepContainer').empty();
        for (let step of State.Current().TSteps)
            this.CreateTStep(step);
    }

    public CreateTStep(step: TStep): void {
        let markup: JQuery = $(`
        <div class='RightSidebar-step'>
            <div class='RightSidebar-taskCheck'>
                <div class='CheckboxContainer'>
                    <div class='Round'>
                        <input id='chbStepDone${step.Id}' ${step.Done == true ? "checked" : ""} type='checkbox' />
                        <label for='chbStepDone${step.Id}'></label>
                    </div>
                </div>
            </div>
            <span class='RightSidebar-taskText TextBox'>
                <input id='txtStepText${step.Id}' class='TextBox-input' value='${step.Text}' type='text' />
            </span>
            <button id='btnStepDelete${step.Id}' class='Button RightSidebar-taskDelete' title='Smazat krok'>
                <i class='bi bi-trash'></i>
            </button>
        </div>
        `)
        markup.appendTo("#TStepContainer");
        $(`#chbStepDone${step.Id}`).click(() => { State.Current().TStepCheckedChanged(step.Id); });
        $(`#txtStepText${step.Id}`).change((e) => { State.Current().TStepTextChanged(e.target, step.Id); });
        $(`#btnStepDelete${step.Id}`).click(() => { State.Current().RemoveTStep(step.Id); });
    }

    public SetHeader(): void {
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
    }

    public SetColorMode(): void {
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
    }

    public GetContentCoverStyle(): void {
        if (this.IsSmallScreen() && (this.LeftSidebarStatus == SidebarState.Opened || this.RightSidebarStatus == SidebarState.Opened))
            $("#MainCover").addClass("Main-coverContent");
        else
            $("#MainCover").removeClass("Main-coverContent");
    }

    public SetRightSidebarTodoImportant(todo): void {
        if (todo.Important)
            $("#btnRightSidebarTodoImportant").addClass("is-checked");
        else
            $("#btnRightSidebarTodoImportant").removeClass("is-checked");
    }

    public OutsideClick(): void {
        if (this.IsSmallScreen()) {
            $("#LeftSidebar").addClass("is-hidden");
            this.LeftSidebarStatus = SidebarState.Closed;
            this.GetContentCoverStyle();
        }
    }

    public ToggleLeftSidebar(): void {
        this.LeftSidebarStatus = this.ToggleSidebar(this.LeftSidebarStatus, "#LeftSidebar");
        this.GetContentCoverStyle();
    }

    public ToggleRightSidebar(): void {
        this.RightSidebarStatus = this.ToggleSidebar(this.RightSidebarStatus, "#RightSidebar");
        this.GetContentCoverStyle();
    }

    public ToggleSidebar(sidebarStatus: SidebarState, id:string): SidebarState {
        switch (sidebarStatus) {
            case SidebarState.Closed:
                $(id).removeClass("is-hidden");
                return SidebarState.Opened;
            default:
                $(id).addClass("is-hidden");
                return SidebarState.Closed;
        }
    }

    public IsSmallScreen(): boolean {
        return $("#Page").innerWidth() < 992;
    }

    public DownloadFile(fileBase64:string): void {
        fetch(`data:application/json;base64,${fileBase64}`)
            .then(response => response.blob())
            .then(blob => {
                let link = window.document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = "TodoExport.json";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    }

    public ShowSearchView(): void {
        $("#lblHeaderTListIcon").addClass("u-d-none");
        $("#txtHeaderTListName").addClass("u-d-none");
        $("#TListControls").addClass("u-d-none");
        $("#SearchViewEditor").removeClass("u-d-none");
        $("#AddTodoContainer").addClass("u-d-none");
        $("#txtSearchText").val("");
        this.SearchView = true
    }

    public HideSearchView(): void {
        $("#lblHeaderTListIcon").removeClass("u-d-none");
        $("#txtHeaderTListName").removeClass("u-d-none");
        $("#TListControls").removeClass("u-d-none");
        $("#SearchViewEditor").addClass("u-d-none");
        $("#AddTodoContainer").removeClass("u-d-none");
        this.SearchView = false
    }

    public GetSearchText(): string {
        return $("#txtSearchText").val();
    }

    public ClearNewTListName(): void {
        $("#txtNewTListText").val("");
    }

    public GetNewTListName(): string {
        return $("#txtNewTListText").val();
    }

    public ClearNewTodoText(): void {
        $("#txtNewTodoText").val("");
    }

    public GetNewTodoText(): string {
        return $("#txtNewTodoText").val();
    }

    public ClearNewTStepText(): void {
        $("#txtNewTStepText").val("");
    }

    public GetNewTStepText(): string {
        return $("#txtNewTStepText").val();
    }

    public ShowTextDialog(title: string, text: string): void {
        this.DialogContent = DialogContent.Text;
        $("#lblDialogHead").text(title);
        $("#DialogTextContainer").text(text);
        this.ShowDialog();
    }

    public ShowSettingsDialog(): void {
        this.DialogContent = DialogContent.Settings;
        $("#lblDialogHead").text("Nastavení");
        this.ShowDialog();
    }

    public ShowTListSettingsDialog(): void {
        this.DialogContent = DialogContent.TListSettings;
        $("#lblDialogHead").text("Nastavení seznamu: " + State.Current().CurrentTList.Name);
        this.ShowDialog();
    }

    public ShowDialog(): void {
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
    }

    public HideDialog(): void {
        $("#Dialog").removeClass("is-showed");
    }
}