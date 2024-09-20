class window.TStep
    constructor: (@Id = -1, @Text="", @ParentId = window.UndividedTListId, 
      @Done = false) ->

    Update: (callback) ->
      window.Database.UpdateTStep this, callback

    Remove: (callback) ->
      window.Database.RemoveTStep this.Id, callback