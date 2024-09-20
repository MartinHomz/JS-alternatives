(function() {
  window.Todo = class Todo extends window.TStep {
    constructor(Id = -1, Text = "", ParentId = window.UndividedTListId, Done = false, Important = false, CreateDate = new Date().toDateString(), EndDate = window.DateMaxValue.toDateString(), Note = "") {
      super();
      this.Id = Id;
      this.Text = Text;
      this.ParentId = ParentId;
      this.Done = Done;
      this.Important = Important;
      this.CreateDate = CreateDate;
      this.EndDate = EndDate;
    }

    Update(callback) {
      return window.Database.UpdateTodo(this, callback);
    }

    Remove(callback) {
      return window.Database.RemoveTodo(this.Id, callback);
    }

    GetTodoSteps(callback) {
      return window.Database.GetTStepsByParentId(this.Id, callback);
    }

    AddStep(text, callback) {
      return window.Database.AddTStep(text, this.Id, callback);
    }

  };

}).call(this);


//# sourceMappingURL=Todo.js.map
//# sourceURL=coffeescript