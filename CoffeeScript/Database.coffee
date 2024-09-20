class Database
  database = null
  class PrivateClass
    Server: {}
    InitializeDatabase: (callback) ->
      db.open
          server: 'TodoDB'
          version: 1
          schema:
              TodoLists:
                  key:
                    keyPath: 'id'
                    autoIncrement: true
                  indexes:
                      name: {}
                      icon: {}
                      unfinishedOpened: {}
                      finishedOpened: {}
                      orderTodo: {}
              Todos:
                  key:
                    keyPath: 'id'
                    autoIncrement: true
                  indexes:
                      parentId: {}
                      done: {}
                      text: {}
                      important: {}
                      createDate: {}
                      endDate: {}
                      note: {}
              TodoSteps:
                  key:
                    keyPath: 'id'
                    autoIncrement: true
                  indexes:
                      parentId: {}
                      done: {}
                      text: {}
      .then (s) ->
          database.Server = s
          if callback isnt undefined then callback()
#region TLists
    GetAllTLists: (callback) ->
      database.Server.TodoLists.query()
        .all()
        .execute()
        .then (results) -> 
          tlists = []
          for item in results
            tlist = new window.TList(item.id, item.name, item.icon, 
              item.unfinishedOpened, item.finishedOpened, item.orderTodo)
            tlists.push(tlist)
          if callback isnt undefined then callback(tlists) else tlists

    AddTlist: (newName, callback) ->
      database.Server.TodoLists.add
        name: newName
        icon: ""
        unfinishedOpened: true
        finishedOpened: false
        orderTodo: window.OrderTodo.None
      .then () ->
        if callback isnt undefined then callback()

    AddTlistClass: (tlist, callback) ->
      database.Server.TodoLists.add
        name: tlist.Name
        icon: tlist.Icon
        unfinishedOpened: tlist.UnfinishedOpened
        finishedOpened: tlist.FinishedOpened
        orderTodo: tlist.OrderTodo
      .then () ->
        if callback isnt undefined then callback()

    UpdateTList: (todoList, callback) ->
      database.Server.TodoLists.update
        id: todoList.Id
        name: todoList.Name
        icon: todoList.Icon
        unfinishedOpened: todoList.UnfinishedOpened
        finishedOpened: todoList.FinishedOpened
        orderTodo: todoList.OrderTodo
      .then () ->
        if callback isnt undefined then callback()

    RemoveTList: (id, callback) ->
      database.Server.TodoLists.remove(id).then () ->
        database.GetTodosByParentId(id, (results) ->
          for todo in results
            database.RemoveTodo(todo.Id)
        if callback isnt undefined then callback()
        )
#endregion TLists
#region Todos
    GetAllTodos: (callback) ->
      database.Server.Todos.query()
        .all()
        .execute()
        .then (results) -> 
          todos = []
          for item in results
            todo = new window.Todo(item.id, item.text, item.parentId, item.done, 
              item.important, item.createDate, item.endDate, item.note)
            todos.push(todo)
          if callback isnt undefined then callback(todos) else todos

    GetTodosByParentId: (id, callback) ->
      database.Server.Todos.query()
        .filter("parentId", id)
        .execute()
        .then (results) -> 
          todos = []
          for item in results
            todo = new window.Todo(item.id, item.text, item.parentId, item.done, 
              item.important, item.createDate, item.endDate, item.note)
            todos.push(todo)
          if callback isnt undefined then callback(todos) else todos
    
    AddTodo: (newText, todoListId, callback) ->
      database.Server.Todos.add
        parentId: todoListId
        done: false
        text: newText
        important: false
        createDate: new Date().toDateString()
        endDate: window.DateMaxValue.toDateString()
        note: ""
      .then () ->
        if callback isnt undefined then callback()
    
    AddTodoClass: (todo, callback) ->
      database.Server.Todos.add
        parentId: todo.ParentId
        done: todo.Done
        text: todo.Text
        important: todo.Important
        createDate: todo.CreateDate
        endDate: todo.EndDate
        note: todo.Note
      .then () ->
        if callback isnt undefined then callback()

    UpdateTodo: (todo, callback) ->
      database.Server.Todos.update
        id: todo.Id
        parentId: todo.ParentId
        done: todo.Done
        text: todo.Text
        important: todo.Important
        createDate: todo.CreateDate
        endDate: todo.EndDate
        note: todo.Note
      .then () ->
        if callback isnt undefined then callback()

    RemoveTodo: (id, callback) ->
      database.Server.Todos.remove(id).then () ->
        database.GetTStepsByParentId(id, (results) ->
          for step in results
            database.RemoveTStep(step.Id)
          if callback isnt undefined then callback()
        )

    FindTodo: (text, callback) ->
      database.Server.Todos.query()
        .filter((todo) -> todo.text.includes text)
        .execute()
        .then (results) -> 
          todos = []
          for item in results
            todo = new window.Todo(item.id, item.text, item.parentId, item.done, 
              item.important, item.createDate, item.endDate, item.note)
            todos.push(todo)
          if callback isnt undefined then callback(todos) else todos
#endregion Todos
#region TSteps
    GetAllTSteps: (callback) ->
      database.Server.TodoSteps.query()
        .all()
        .execute()
        .then (results) -> 
          steps = []
          for item in results
            step = new window.TStep(item.id, item.text, item.parentId, item.done)
            steps.push(step)
          if callback isnt undefined then callback(steps) else steps

    GetTStepsByParentId: (id, callback) ->
      database.Server.TodoSteps.query()
        .filter("parentId", id)
        .execute()
        .then (results) -> 
          steps = []
          for item in results
            step = new window.TStep(item.id, item.text, item.parentId, item.done)
            steps.push(step)
          if callback isnt undefined then callback(steps) else steps

    AddTStep: (newText, todoId, callback) ->
      database.Server.TodoSteps.add
        parentId: todoId
        done: false
        text: newText
      .then () ->
        if callback isnt undefined then callback()

    AddTStepClass: (step, callback) ->
      database.Server.TodoSteps.add
        parentId: step.ParentId
        done: step.Done
        text: step.Text
      .then () ->
        if callback isnt undefined then callback()

    UpdateTStep: (todoStep, callback) ->
      database.Server.TodoSteps.update
        id: todoStep.Id
        parentId: todoStep.ParentId
        done: todoStep.Done
        text: todoStep.Text
      .then () ->
        if callback isnt undefined then callback()

    RemoveTStep: (id, callback) ->
      database.Server.TodoSteps.remove(id).then () ->
        if callback isnt undefined then callback()
#endregion TSteps
    ImportData: (json, callback) ->
      database.Server.TodoLists.clear()
      .then () ->
        database.Server.Todos.clear()
        .then () ->
          database.Server.TodoSteps.clear()
          .then () ->
            content = JSON.parse json
            if content.TLists isnt undefined 
              for item in content.TLists
                database.AddTlistClass(item)
            if content.TodoList isnt undefined
              for item in content.TodoList
                database.AddTodoClass(item)
            if content.StepList isnt undefined
              for item in content.StepList
                database.AddTStepClass(item)
            callback()
      
    ExportData: (callback) ->
      database.GetAllTLists((tlists) ->
         database.GetAllTodos((todoList) -> 
          database.GetAllTSteps((stepList) ->
            undividedTodos = todoList.filter((item) -> item.ParentId is window.UndividedTListId)
            if tlists.length > 0 or undividedTodos.length > 0
              callback(JSON.stringify { TLists: tlists, TodoList: todoList, StepList: stepList})
            else
              callback("")
          )
        )
      )

  @Current: ->
    database ?= new PrivateClass()

window.DateMaxValue = new Date(9999, 11, 31, 23, 59, 59, 999)
window.UndividedTListId = -1
window.Database = Database.Current()