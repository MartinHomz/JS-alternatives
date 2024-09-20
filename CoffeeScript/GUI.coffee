window.SidebarState = 
  Opened: 0
  Closed: 1

window.DialogContent = 
  Text: 0
  Settings: 1
  TListSettings: 2

class GUI
  gui = null
  @Current: ->
      gui ?= new PrivateClass()
  class PrivateClass
    SearchView: false
    LeftSidebarStatus: window.SidebarState.Closed
    RightSidebarStatus: window.SidebarState.Closed
    DialogContent: window.DialogContent.Text
    Initialize: ->
        gui.SetColorMode()
        gui.BaseInitialize()

    BaseInitialize: ->
        $("#btnHideLeftSidebar").click () -> gui.ToggleLeftSidebar()
        $("#btnLeftSidebarSettings").click () -> gui.ShowSettingsDialog()
        $("#fileLeftSidebarImport").change () -> window.State.ImportData this
        $("#btnLeftSidebarExport").click () -> window.State.ExportData()
        $("#btnLeftSidebarSearch").click () -> window.State.ShowSearchView()
        $("#txtNewTListText").keyup (e) -> window.State.AddNewTListTextKeyUp e
        $("#btnAddNewTList").click () -> window.State.AddNewTList()
        if gui.LeftSidebarStatus is window.SidebarState.Closed
            $("#LeftSidebar").addClass("is-hidden")
        if gui.RightSidebarStatus is window.SidebarState.Closed
            $("#RightSidebar").addClass("is-hidden")
        $("#txtRightSidebarTodoText").change () -> window.State.TodoTextChanged this
        $("#btnAddNewTStep").click () -> window.State.AddTStep()
        $("#txtNewTStepText").keyup (e) -> window.State.AddNewTStepTextKeyUp e
        $("#dtpRightSidebarTodoEndDate").change () -> window.State.TodoEndDateChanged this
        $("#txaRightSidebarTodoNote").change () ->  window.State.TodoNoteChanged this
        $("#btnHideRightSidebar").click () -> window.State.HideRightSidebar()
        $("#btnDeleteTodo").click () -> window.State.RemoveTodo()
        $("#btnToggleLeftSidebar").click () -> gui.ToggleLeftSidebar()
        $("#txtHeaderTListName").change () -> window.State.TListNameChange this
        $("#btnDeleteTList").click () -> window.State.RemoveTList()
        $("#btnSettingsTList").click () -> gui.ShowTListSettingsDialog()
        $("#txtSearchText").on "input", () -> window.State.Search()
        $("#Main").click () -> gui.OutsideClick()
        $(window).resize () -> gui.GetContentCoverStyle()
        $("#btnAddNewTodo").click () -> window.State.AddTodo()
        $("#txtNewTodoText").keyup (e) -> window.State.AddNewTodoTextKeyUp e
        $("#btnHideDialog").click () -> gui.HideDialog()
        $("#slbIcon").change () -> window.State.TListIconChange this
        $("#slbOrderTodo").change () -> window.State.TListOrderTodoChange this
        $("#chbDarkMode").change () -> window.State.SetColorMode this
        gui.HideSearchView()
        $("#chbRightSidebarTodoDone").click () -> window.State.TodoDoneChanged window.State.CurrentTodo.Id
        $("#btnRightSidebarTodoImportant").click () -> window.State.TodoImportantChanged window.State.CurrentTodo.Id

    DrawTLists: ->
        $('#NavigationBaseTLists').empty()
        $('#NavigationUserTLists').empty()
        gui.CreateTList window.State.TodayTodos, "lstTodayTodos", "NavigationBaseTLists"
        gui.CreateTList window.State.ImportantTodos, "lstImportantTodos", "NavigationBaseTLists"
        gui.CreateTList window.State.PlannedTodos, "lstPlannedTodos", "NavigationBaseTLists"
        gui.CreateTList window.State.UndividedTodos, "lstUndividedTodos", "NavigationBaseTLists"

        for item in window.State.TLists
            gui.CreateTList item, "lstItem#{item.Id}", "NavigationUserTLists"

    CreateTList: (tList, lstId, container) ->
        tList.GetUnfinishedTodosCount((result) -> 
            markup = $("
            <li id='#{lstId}' class='LeftSidebar-item #{if window.State.CurrentTList == tList then "is-selected"}'>
                <span class='LeftSidebar-itemIcon #{tList.Icon}'></span>
                <span class='LeftSidebar-itemText'>#{tList.Name}</span>
                <span class='LeftSidebar-itemCount'>#{result}</span>
            </li>
            ")
            markup.appendTo "##{container}"
            $("##{lstId}").click () -> window.State.SwitchTList tList
        )

    SetRightSidebar: ->
        $("#chbRightSidebarTodoDone").prop "checked", window.State.CurrentTodo.Done
        $("#txtRightSidebarTodoText").val window.State.CurrentTodo.Text
        gui.SetRightSidebarTodoImportant(window.State.CurrentTodo.Important)
        endDate = new Date(window.State.CurrentTodo.EndDate)
        $("#dtpRightSidebarTodoEndDate").val if window.State.CurrentTodo.EndDate isnt window.DateMaxValue.toDateString() then "#{gui.formatDate(endDate)}" else ""
        $("#txaRightSidebarTodoNote").val window.State.CurrentTodo.Note
        $("#lblRightSidebarTodoCreateDate").text window.State.CurrentTodo.CreateDate

    formatDate: (date) ->
        d = new Date(date)
        month = '' + (d.getMonth() + 1)
        day = '' + d.getDate()
        year = d.getFullYear()
        if month.length < 2
            month = '0' + month
        if day.length < 2
            day = '0' + day
        [year, month, day].join('-');

    DrawMain: ->
        $('#TodoDividerContainer').empty();
        if gui.SearchView
            gui.CreateTodoDivider "dvcSearched", "Vyhledáno", true, window.State.UnfinishedTodos, true
        else
            gui.SetHeader()
            gui.CreateTodoDivider "dvcUnfinished", "Nedokončeno", window.State.CurrentTList.UnfinishedOpened, window.State.UnfinishedTodos, true
            gui.CreateTodoDivider "dvcFinished", "Dokončeno", window.State.CurrentTList.FinishedOpened, window.State.FinishedTodos, false

    CreateTodoDivider: (id, text, opened, todos, unfinishedButton) ->
        dividerContainer = "#{id}TodoContainer"
        markup = $("
        <div id='#{id}' class='TaskDivider'>
            <span class='TaskDivider-button #{if opened then "bi bi-chevron-down" else "bi bi-chevron-right"}'></span>
            <span>#{text}</span>
            <span>#{if todos isnt undefined and todos.length > 0 then todos.length else ""}</span>
        </div>
        <div id='#{dividerContainer}'></div>
        ")
        markup.appendTo "#TodoDividerContainer"
        $("##{id}").click () -> window.State.TodoDividerClick unfinishedButton
        if todos isnt undefined and opened
            for todo in todos
                gui.CreateTodo todo, dividerContainer

    CreateTodo: (todo, container) ->
        markup = $("
        <div class='TaskBlock #{if window.State.CurrentTodo is todo then "is-selected" else ""}'>
            <div class='TaskBlock-check'>
                <div class='CheckboxContainer'>
                    <div class='Round'>
                        <input id='chbTaskDone#{todo.Id}' #{if todo.Done is true then "checked"} type='checkbox' />
                        <label for='chbTaskDone#{todo.Id}'></label>
                    </div>
                </div>
            </div>
            <span id='lblTaskText#{todo.Id}' class='TaskBlock-text'>#{todo.Text}</span>
            <span id='lblTaskImportant#{todo.Id}' class='TaskBlock-important #{if todo.Important then "is-checked" else ""}'>
                <i class='TaskBlock-importantIcon bi-star-fill'></i>
            </span>
        </div>
        ")
        markup.appendTo "##{container}"
        $("#chbTaskDone#{todo.Id}").click () -> window.State.TodoDoneChanged todo.Id
        $("#lblTaskText#{todo.Id}").click () -> window.State.TodoSelected todo.Id
        $("#lblTaskImportant#{todo.Id}").click () -> window.State.TodoImportantChanged todo.Id

    DrawTSteps: ->
        $('#TStepContainer').empty();
        for step in window.State.TSteps
            gui.CreateTStep step

    CreateTStep: (step) ->
        markup = $("
        <div class='RightSidebar-step'>
            <div class='RightSidebar-taskCheck'>
                <div class='CheckboxContainer'>
                    <div class='Round'>
                        <input id='chbStepDone#{step.Id}' #{if step.Done == true then "checked"} type='checkbox' />
                        <label for='chbStepDone#{step.Id}'></label>
                    </div>
                </div>
            </div>
            <span class='RightSidebar-taskText TextBox'>
                <input id='txtStepText#{step.Id}' class='TextBox-input' value='#{step.Text}' type='text' />
            </span>
            <button id='btnStepImportant#{step.Id}' class='Button RightSidebar-taskDelete' title='Smazat krok'>
                <i class='bi bi-trash'></i>
            </button>
        </div>
        ")
        markup.appendTo "#TStepContainer"
        $("#chbStepDone#{step.Id}").click () -> window.State.TStepCheckedChanged step.Id
        $("#txtStepText#{step.Id}").change () -> window.State.TStepTextChanged this, step.Id
        $("#btnStepImportant#{step.Id}").click () -> window.State.RemoveTStep step.Id

    SetHeader: ->
        $("#lblHeaderTListIcon").removeAttr 'class'
        $("#lblHeaderTListIcon").addClass window.State.CurrentTList.Icon
        if  gui.SearchView then gui.ShowSearchView() else gui.HideSearchView()
        $("#txtHeaderTListName").prop "readonly", window.State.CurrentTList.Id is window.UndividedTListId
        $("#txtHeaderTListName").val window.State.CurrentTList.Name
        if window.State.CurrentTList.Id isnt window.UndividedTListId 
            $("#TListControls").removeClass "u-d-none"
        else
            $("#TListControls").addClass "u-d-none"
        $("#txtSearchText").val ""

    SetColorMode: ->
        if window.Settings.GetDarkMode() is "true"
            if $("#Page").hasClass "LightMode"
                $("#Page").removeClass "LightMode"
            $("#Page").addClass "DarkMode"
        else
            if $("#Page").hasClass "DarkMode"
                $("#Page").removeClass "DarkMode"
            $("#Page").addClass "LightMode"
    
    GetContentCoverStyle: ->
        if gui.IsSmallScreen() and (gui.LeftSidebarStatus is window.SidebarState.Opened or gui.RightSidebarStatus is window.SidebarState.Opened)
            $("#MainCover").addClass "Main-coverContent"
        else
            $("#MainCover").removeClass "Main-coverContent"

    SetRightSidebarTodoImportant: (todo) ->
        if todo.Important
            $("#btnRightSidebarTodoImportant").addClass "is-checked"
        else
            $("#btnRightSidebarTodoImportant").removeClass "is-checked"

    OutsideClick: -> 
        if gui.IsSmallScreen()
            $("#LeftSidebar").addClass "is-hidden"
            gui.LeftSidebarStatus = window.SidebarState.Closed
            gui.GetContentCoverStyle()
    
    ToggleLeftSidebar: ->
        gui.LeftSidebarStatus = gui.ToggleSidebar gui.LeftSidebarStatus, "#LeftSidebar"
        gui.GetContentCoverStyle()

    ToggleRightSidebar: ->
        gui.RightSidebarStatus = gui.ToggleSidebar gui.RightSidebarStatus, "#RightSidebar"
        gui.GetContentCoverStyle()

    ToggleSidebar: (sidebarStatus, id) ->
        switch sidebarStatus
            when window.SidebarState.Closed
                 $(id).removeClass "is-hidden"
                 window.SidebarState.Opened
            else
                 $(id).addClass "is-hidden"
                 window.SidebarState.Closed

    IsSmallScreen: ->
        $("#Page").innerWidth() < 992

    DownloadFile: (fileBase64) ->
        fetch("data:application/json;base64,#{fileBase64}")
            .then (response) -> response.blob()
            .then (blob) -> 
                link = window.document.createElement("a")
                link.href = window.URL.createObjectURL(blob, { type: "application/json" })
                link.download = "TodoExport.json"
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

    ShowSearchView: ->
        $("#lblHeaderTListIcon").addClass "u-d-none"
        $("#txtHeaderTListName").addClass "u-d-none"
        $("#TListControls").addClass "u-d-none"
        $("#SearchViewEditor").removeClass "u-d-none"
        $("#AddTodoContainer").addClass "u-d-none"
        $("#txtSearchText").val ""
        gui.SearchView = true

    HideSearchView: ->
        $("#lblHeaderTListIcon").removeClass "u-d-none"
        $("#txtHeaderTListName").removeClass "u-d-none"
        $("#TListControls").removeClass "u-d-none"
        $("#SearchViewEditor").addClass "u-d-none"
        $("#AddTodoContainer").removeClass "u-d-none"
        gui.SearchView = false

    GetSearchText: ->
        $("#txtSearchText").val()

    ClearNewTListName: ->
        $("#txtNewTListText").val ""

    GetNewTListName: ->
        $("#txtNewTListText").val()

    ClearNewTodoText: ->
        $("#txtNewTodoText").val ""

    GetNewTodoText: ->
        $("#txtNewTodoText").val()

    ClearNewTStepText: ->
        $("#txtNewTStepText").val ""

    GetNewTStepText: ->
        $("#txtNewTStepText").val()

    ShowTextDialog: (title, text) ->
        gui.DialogContent = window.DialogContent.Text
        $("#lblDialogHead").text title
        $("#DialogTextContainer").text text
        gui.ShowDialog()

    ShowSettingsDialog: () ->
        gui.DialogContent = window.DialogContent.Settings
        $("#lblDialogHead").text "Nastavení"
        gui.ShowDialog()

    ShowTListSettingsDialog: () ->
        gui.DialogContent = window.DialogContent.TListSettings
        $("#lblDialogHead").text "Nastavení seznamu: " + window.State.CurrentTList.Name
        gui.ShowDialog()

    ShowDialog: ->
        switch gui.DialogContent
            when window.DialogContent.Settings
                 $("#DialogTextContainer").addClass "u-d-none"
                 $("#DialogSettingsContainer").removeClass "u-d-none"
                 $("#DialogTListSettingsContainer").addClass "u-d-none"
                 $("#chbDarkMode").prop "checked", window.Settings.GetDarkMode() is "true"
            when window.DialogContent.TListSettings
                 $("#DialogTextContainer").addClass "u-d-none"
                 $("#DialogSettingsContainer").addClass "u-d-none"
                 $("#DialogTListSettingsContainer").removeClass "u-d-none"
                 $("#slbOrderTodo").val window.State.CurrentTList.OrderTodo
                 $("#slbIcon").val window.State.CurrentTList.Icon
            else
                 $("#DialogTextContainer").removeClass "u-d-none"
                 $("#DialogSettingsContainer").addClass "u-d-none"
                 $("#DialogTListSettingsContainer").addClass "u-d-none"
        $("#Dialog").addClass "is-showed"

    HideDialog: () ->
        $("#Dialog").removeClass "is-showed"

window.GUI = GUI.Current()