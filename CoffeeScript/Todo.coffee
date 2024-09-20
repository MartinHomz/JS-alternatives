class window.Todo extends window.TStep
    constructor: (@Id = -1, @Text="", @ParentId = window.UndividedTListId, 
      @Done = false, @Important = false, @CreateDate = new Date().toDateString(), 
      @EndDate=window.DateMaxValue.toDateString(), Note="") ->
      super()

    Update: (callback) ->
      window.Database.UpdateTodo this, callback

    Remove: (callback) ->
      window.Database.RemoveTodo this.Id, callback

    GetTodoSteps: (callback) ->
      window.Database.GetTStepsByParentId this.Id, callback

    AddStep: (text, callback) ->
      window.Database.AddTStep text, this.Id, callback