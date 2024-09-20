GetTodayTodos = (callback) ->
  window.Database.GetAllTodos((results) -> 
      today = results.filter((item) -> item.EndDate is new Date().toDateString());
      callback today
    )

AddTodayTodos = (text, callback) ->
  todo = new window.Todo(-1, text, -1, false, false, new Date().toDateString(), new Date().toDateString(), "")
  window.Database.AddTodoClass todo, callback

GetImportantTodos = (callback) ->
  window.Database.GetAllTodos((results) -> 
      importants = results.filter((item) -> item.Important);
      callback importants
    )

AddImportantTodos = (text, callback) ->
  todo = new window.Todo(-1, text, -1, false, true, new Date().toDateString(), window.DateMaxValue.toDateString(), "")
  window.Database.AddTodoClass todo, callback

GetPlannedTodos = (callback) ->
  window.Database.GetAllTodos((results) -> 
      planned = results.filter((item) -> item.EndDate isnt window.DateMaxValue.toDateString());
      callback planned
    )

class State
  state = null
  @Current: ->
    state ?= new PrivateClass()
  class PrivateClass
    TodayTodos: new window.TList(-1 ,"Dnešní úkoly", "u-text-red bi bi-star", true, false, window.OrderTodo.None, GetTodayTodos, AddTodayTodos)
    ImportantTodos: new window.TList(-1 ,"Důležité úkoly", "u-text-yellow bi bi-sun", true, false, window.OrderTodo.None, GetImportantTodos, AddImportantTodos)
    PlannedTodos: new window.TList(-1 ,"Plánované úkoly", "u-text-blue bi bi-calendar", true, false, window.OrderTodo.None, GetPlannedTodos, AddTodayTodos)
    UndividedTodos: new window.TList(-1 ,"Nezařazené úkoly", "u-text-green bi bi-check-all", true, false, window.OrderTodo.None)
    TLists: []
    Todos: []
    TSteps: []
    CurrentTList: {}
    CurrentTodo: {}
    UnfinishedTodos: []
    FinishedTodos: []

    AppInitialize: ->
      window.Database.InitializeDatabase(() -> 
        window.GUI.Initialize()
        state.LoadTLists(() ->
            state.SwitchTList state.TodayTodos
        )
      )

    ImportData: (e) -> 
      try
        reader = new FileReader()
        reader.onload = (event) ->
          window.Database.ImportData(event.target.result, () ->
            state.LoadTLists(() ->
              state.SwitchTList state.TodayTodos
            )
          );
        reader.readAsText event.target.files[0]
      catch err
        window.GUI.ShowTextDialog "Chyba", "Nastala chyba při čtení souboru"

    ExportData: ->
      window.Database.ExportData((json) ->
        if json.length > 0
          base64 = window.btoa json
          window.GUI.DownloadFile base64
        else
          window.GUI.ShowTextDialog "Chyba", "Nelze uložit soubor, pokud je databáze prázdná"
      )

    ShowSearchView: ->
      window.GUI.ShowSearchView()
      state.CurrentTList = null
      state.Todos = []
      state.HideRightSidebar()
      window.GUI.DrawMain()
      state.LoadTodos()

    Search: ->
      state.LoadTodos()

    HideRightSidebar: ->
      if window.GUI.RightSidebarStatus is window.SidebarState.Opened
        window.GUI.ToggleRightSidebar()
      state.CurrentTodo = null

    SetColorMode: (e) ->
      window.Settings.SetDarkMode e.checked
      window.GUI.SetColorMode()

    LoadTLists: (callback) ->
      window.Database.GetAllTLists((tlist) -> 
        state.TLists = tlist
        window.GUI.DrawTLists()
        if callback isnt undefined then callback()
      )

    SwitchTList: (todoList, callback) ->
      window.GUI.HideSearchView()
      state.CurrentTList = todoList
      state.HideRightSidebar()
      state.LoadTodos callback

    AddNewTListTextKeyUp: (e) ->
      if e.key is "Enter"
        state.AddNewTList()

    AddNewTList: ->
      name = window.GUI.GetNewTListName()
      if name isnt undefined and name.length > 0
        window.Database.AddTlist(name, () ->
          window.GUI.ClearNewTListName()
          state.LoadTLists()
        )
      else
        window.GUI.ShowTextDialog "Chyba", "Název seznamu nesmí být prázdný"

    TListNameChange: (e) ->
      text = e.value
      if text isnt undefined and text.length > 0
        state.CurrentTList.Name = text
        state.CurrentTList.Update(() -> 
          state.LoadTLists()
          window.GUI.SetHeader()
        )
      else
        window.GUI.ShowTextDialog "Chyba", "Název seznamu nesmí být prázdný"

    TListOrderTodoChange: (e) ->
      state.CurrentTList.OrderTodo = parseInt e.value
      state.CurrentTList.Update(() -> 
          state.LoadTLists(() ->
            state.LoadTodos() 
          )
        )

    TListIconChange: (e) ->
      state.CurrentTList.Icon = e.value
      state.CurrentTList.Update(() -> 
        state.LoadTLists()
        window.GUI.SetHeader()
      )

    RemoveTList: ->
      state.CurrentTList.Remove(() ->
        state.LoadTLists(() ->
            state.SwitchTList state.TodayTodos
        )
      )

    TodoDividerClick: (unfinishedButton) ->
      if not window.GUI.SearchView
        if unfinishedButton
          state.CurrentTList.UnfinishedOpened = not state.CurrentTList.UnfinishedOpened
        else
          state.CurrentTList.FinishedOpened = not state.CurrentTList.FinishedOpened
        if (state.CurrentTList.Id isnt window.UndividedTListId)
          state.CurrentTList.Update(() -> 
            state.LoadTLists(() ->
              window.GUI.DrawMain()
            )
          )
        else
          window.GUI.DrawMain()

    LoadTodos: (callback) ->
      if not window.GUI.SearchView
        state.CurrentTList.GetTodosByOrder((todos) ->
          state.Todos = todos
          state.UnfinishedTodos = state.Todos.filter((todo) -> not todo.Done)
          state.FinishedTodos = state.Todos.filter((todo) -> todo.Done)
          window.GUI.DrawTLists()
          window.GUI.DrawMain()
          if callback isnt undefined then callback()
        )
      else
        text = window.GUI.GetSearchText()
        if text isnt undefined and text.length > 0
          window.Database.FindTodo(text, (todos) ->
            state.Todos = todos
            state.UnfinishedTodos = state.Todos.filter((todo) -> not todo.Done)
            state.FinishedTodos = state.Todos.filter((todo) -> todo.Done)
            window.GUI.DrawTLists()
            window.GUI.DrawMain()
            if callback isnt undefined then callback()
          )
        else
          state.Todos = []
          state.UnfinishedTodos = []
          state.FinishedTodos = []
          window.GUI.DrawTLists()
          window.GUI.DrawMain()
    
    TodoSelected: (id) ->
      todoArray = state.Todos.filter((item) -> item.Id is id)
      todo = todoArray[0]
      if state.CurrentTodo isnt todo
        state.CurrentTodo = todo
        state.LoadTSteps((steps) ->
          window.GUI.SetRightSidebar()
          if window.GUI.RightSidebarStatus is window.SidebarState.Closed
            window.GUI.ToggleRightSidebar()
        )
      else
        state.HideRightSidebar()

    AddNewTodoTextKeyUp: (e) ->
      if e.key is "Enter"
        state.AddTodo()

    AddTodo: ->
      text = window.GUI.GetNewTodoText()
      if text isnt undefined and text.length > 0
        state.CurrentTList.AddTodo(text, () ->
          window.GUI.ClearNewTodoText()
          state.LoadTodos()
        )
      else
        window.GUI.ShowTextDialog "Chyba", "Text úkolu nesmí být prázdný"

    TodoDoneChanged: (id) ->
      todoArray = state.Todos.filter((item) -> item.Id is id)
      todo = todoArray[0]
      todo.Done = not todo.Done
      todo.Update(() ->
        state.LoadTodos(() ->
          if todo is state.CurrentTodo
            window.GUI.SetRightSidebar()
        )
      )

    TodoImportantChanged: (id) ->
      todoArray = state.Todos.filter((item) -> item.Id is id)
      todo = todoArray[0]
      todo.Important = not todo.Important
      todo.Update(() ->
        state.LoadTodos(() ->
          if todo is state.CurrentTodo
            window.GUI.SetRightSidebar()
        )
      )

    TodoTextChanged: (e) ->
      text = e.value
      if text isnt undefined and text.length > 0
        state.CurrentTodo.Text = text;
        state.CurrentTodo.Update(() ->
          state.LoadTodos()
        )
      else
        window.GUI.ShowTextDialog "Chyba", "Text úkolu nesmí být prázdný"

    TodoEndDateChanged: (e) ->
      state.CurrentTodo.EndDate = new Date(e.value).toDateString()
      state.CurrentTodo.Update(() ->
        state.LoadTodos()
      )

    TodoNoteChanged: (e) ->
      state.CurrentTodo.Note = e.value;
      state.CurrentTodo.Update(() ->
        state.LoadTodos()
      )

    RemoveTodo: ->
      state.CurrentTodo.Remove(() ->
        state.HideRightSidebar()
        state.LoadTodos()
      )

    LoadTSteps: (callback) ->
      state.CurrentTodo.GetTodoSteps((steps) ->
        state.TSteps = steps
        window.GUI.DrawTSteps()
        if callback isnt undefined then callback()
      )

    AddNewTStepTextKeyUp: (e) ->
      if e.key is "Enter"
        state.AddTStep()

    AddTStep: ->
      text = window.GUI.GetNewTStepText()
      if text isnt undefined and text.length > 0
        state.CurrentTodo.AddStep(text, () ->
          window.GUI.ClearNewTStepText()
          state.LoadTSteps()
        )
      else
        window.GUI.ShowTextDialog "Chyba", "Text kroku nesmí být prázdný"

    TStepCheckedChanged: (id) ->
      stepsArray = state.TSteps.filter((item) -> item.Id is id)
      step = stepsArray[0]
      step.Done = not step.Done
      step.Update(() ->
        state.LoadTSteps()
      )

    TStepTextChanged: (e, id) ->
      text = e.value
      if text isnt undefined and text.length > 0
        stepsArray = state.TSteps.filter((item) -> item.Id is id)
        step = stepsArray[0]
        step.Text = text;
        step.Update(() ->
          state.LoadTSteps()
        )
      else
        window.GUI.ShowTextDialog "Chyba", "Text kroku nesmí být prázdný"

    RemoveTStep: (id) ->
      stepsArray = state.TSteps.filter((item) => item.Id is id)
      step = stepsArray[0]
      step.Remove(() ->
        state.LoadTSteps()
      )

window.State = State.Current()

window.State.AppInitialize()