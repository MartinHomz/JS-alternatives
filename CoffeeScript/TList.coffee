window.OrderTodo = 
  None: 0
  Important: 1
  EndDate: 2
  Alphabet: 3
  CreateDate: 4

class window.TList
    constructor: (@Id = -1, @Name = "", @Icon = "", @UnfinishedOpened = true, 
        @FinishedOpened = false, 
        @OrderTodo = window.OrderTodo.None,
        @GetTodos = DefaultGetTodos
        @AddTodo = DefaultAddTodo) ->

    Update: (callback) ->
        window.Database.UpdateTList this, callback

    Remove: (callback) ->
        window.Database.RemoveTList this.Id, callback

    GetTodosByOrder: (callback) ->
        orderTodo = this.OrderTodo
        this.GetTodos((todos) ->
            this
            switch orderTodo
                when window.OrderTodo.Important
                     callback todos.sort (a,b) -> b.Important - a.Important
                when window.OrderTodo.EndDate
                     callback todos.sort (a,b) -> new Date(a.EndDate)- new Date(b.EndDate)
                when window.OrderTodo.Alphabet
                     callback(todos.sort((a,b) -> 
                            textA = a.Text.toUpperCase()
                            textB = b.Text.toUpperCase()
                            if (textA < textB) then -1 
                            else if(textA > textB) then 1
                            else 0
                        )
                     )
                when window.OrderTodo.CreateDate
                     callback todos.sort (a,b) -> new Date(a.CreateDate) - new Date(b.CreateDate)
                else
                     callback todos
        )

    GetUnfinishedTodosCount: (callback) ->
        this.GetTodos((todos) ->
            count = todos.filter((todo) -> not todo.Done).length
            count = if count > 0 then count else ""
            callback count
        )
    
DefaultGetTodos = (callback) ->
    window.Database.GetTodosByParentId(this.Id, (todos) ->
        callback todos
    )

DefaultAddTodo = (text, callback) ->
    window.Database.AddTodo text, this.Id, callback
