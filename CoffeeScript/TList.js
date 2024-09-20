(function() {
  var DefaultAddTodo, DefaultGetTodos;

  window.OrderTodo = {
    None: 0,
    Important: 1,
    EndDate: 2,
    Alphabet: 3,
    CreateDate: 4
  };

  window.TList = class TList {
    constructor(Id = -1, Name = "", Icon = "", UnfinishedOpened = true, FinishedOpened = false, OrderTodo = window.OrderTodo.None, GetTodos = DefaultGetTodos, AddTodo = DefaultAddTodo) {
      this.Id = Id;
      this.Name = Name;
      this.Icon = Icon;
      this.UnfinishedOpened = UnfinishedOpened;
      this.FinishedOpened = FinishedOpened;
      this.OrderTodo = OrderTodo;
      this.GetTodos = GetTodos;
      this.AddTodo = AddTodo;
    }

    Update(callback) {
      return window.Database.UpdateTList(this, callback);
    }

    Remove(callback) {
      return window.Database.RemoveTList(this.Id, callback);
    }

    GetTodosByOrder(callback) {
      var orderTodo;
      orderTodo = this.OrderTodo;
      return this.GetTodos(function(todos) {
        this;
        switch (orderTodo) {
          case window.OrderTodo.Important:
            return callback(todos.sort(function(a, b) {
              return b.Important - a.Important;
            }));
          case window.OrderTodo.EndDate:
            return callback(todos.sort(function(a, b) {
              return new Date(a.EndDate) - new Date(b.EndDate);
            }));
          case window.OrderTodo.Alphabet:
            return callback(todos.sort(function(a, b) {
              var textA, textB;
              textA = a.Text.toUpperCase();
              textB = b.Text.toUpperCase();
              if (textA < textB) {
                return -1;
              } else if (textA > textB) {
                return 1;
              } else {
                return 0;
              }
            }));
          case window.OrderTodo.CreateDate:
            return callback(todos.sort(function(a, b) {
              return new Date(a.CreateDate) - new Date(b.CreateDate);
            }));
          default:
            return callback(todos);
        }
      });
    }

    GetUnfinishedTodosCount(callback) {
      return this.GetTodos(function(todos) {
        var count;
        count = todos.filter(function(todo) {
          return !todo.Done;
        }).length;
        count = count > 0 ? count : "";
        return callback(count);
      });
    }

  };

  DefaultGetTodos = function(callback) {
    return window.Database.GetTodosByParentId(this.Id, function(todos) {
      return callback(todos);
    });
  };

  DefaultAddTodo = function(text, callback) {
    return window.Database.AddTodo(text, this.Id, callback);
  };

}).call(this);


//# sourceMappingURL=TList.js.map
//# sourceURL=coffeescript