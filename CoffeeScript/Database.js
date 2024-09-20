(function() {
  var Database;

  Database = (function() {
    var PrivateClass, database;

    class Database {
      static Current() {
        return database != null ? database : database = new PrivateClass();
      }

    };

    database = null;

    PrivateClass = (function() {
      class PrivateClass {
        InitializeDatabase(callback) {
          return db.open({
            server: 'TodoDB',
            version: 1,
            schema: {
              TodoLists: {
                key: {
                  keyPath: 'id',
                  autoIncrement: true
                },
                indexes: {
                  name: {},
                  icon: {},
                  unfinishedOpened: {},
                  finishedOpened: {},
                  orderTodo: {}
                }
              },
              Todos: {
                key: {
                  keyPath: 'id',
                  autoIncrement: true
                },
                indexes: {
                  parentId: {},
                  done: {},
                  text: {},
                  important: {},
                  createDate: {},
                  endDate: {},
                  note: {}
                }
              },
              TodoSteps: {
                key: {
                  keyPath: 'id',
                  autoIncrement: true
                },
                indexes: {
                  parentId: {},
                  done: {},
                  text: {}
                }
              }
            }
          }).then(function(s) {
            database.Server = s;
            if (callback !== void 0) {
              return callback();
            }
          });
        }

        //region TLists
        GetAllTLists(callback) {
          return database.Server.TodoLists.query().all().execute().then(function(results) {
            var i, item, len, tlist, tlists;
            tlists = [];
            for (i = 0, len = results.length; i < len; i++) {
              item = results[i];
              tlist = new window.TList(item.id, item.name, item.icon, item.unfinishedOpened, item.finishedOpened, item.orderTodo);
              tlists.push(tlist);
            }
            if (callback !== void 0) {
              return callback(tlists);
            } else {
              return tlists;
            }
          });
        }

        AddTlist(newName, callback) {
          return database.Server.TodoLists.add({
            name: newName,
            icon: "",
            unfinishedOpened: true,
            finishedOpened: false,
            orderTodo: window.OrderTodo.None
          }).then(function() {
            if (callback !== void 0) {
              return callback();
            }
          });
        }

        AddTlistClass(tlist, callback) {
          return database.Server.TodoLists.add({
            name: tlist.Name,
            icon: tlist.Icon,
            unfinishedOpened: tlist.UnfinishedOpened,
            finishedOpened: tlist.FinishedOpened,
            orderTodo: tlist.OrderTodo
          }).then(function() {
            if (callback !== void 0) {
              return callback();
            }
          });
        }

        UpdateTList(todoList, callback) {
          return database.Server.TodoLists.update({
            id: todoList.Id,
            name: todoList.Name,
            icon: todoList.Icon,
            unfinishedOpened: todoList.UnfinishedOpened,
            finishedOpened: todoList.FinishedOpened,
            orderTodo: todoList.OrderTodo
          }).then(function() {
            if (callback !== void 0) {
              return callback();
            }
          });
        }

        RemoveTList(id, callback) {
          return database.Server.TodoLists.remove(id).then(function() {
            return database.GetTodosByParentId(id, function(results) {
              var i, len, results1, todo;
              results1 = [];
              for (i = 0, len = results.length; i < len; i++) {
                todo = results[i];
                results1.push(database.RemoveTodo(todo.Id));
              }
              return results1;
            }, callback !== void 0 ? callback() : void 0);
          });
        }

        //endregion TLists
        //region Todos
        GetAllTodos(callback) {
          return database.Server.Todos.query().all().execute().then(function(results) {
            var i, item, len, todo, todos;
            todos = [];
            for (i = 0, len = results.length; i < len; i++) {
              item = results[i];
              todo = new window.Todo(item.id, item.text, item.parentId, item.done, item.important, item.createDate, item.endDate, item.note);
              todos.push(todo);
            }
            if (callback !== void 0) {
              return callback(todos);
            } else {
              return todos;
            }
          });
        }

        GetTodosByParentId(id, callback) {
          return database.Server.Todos.query().filter("parentId", id).execute().then(function(results) {
            var i, item, len, todo, todos;
            todos = [];
            for (i = 0, len = results.length; i < len; i++) {
              item = results[i];
              todo = new window.Todo(item.id, item.text, item.parentId, item.done, item.important, item.createDate, item.endDate, item.note);
              todos.push(todo);
            }
            if (callback !== void 0) {
              return callback(todos);
            } else {
              return todos;
            }
          });
        }

        AddTodo(newText, todoListId, callback) {
          return database.Server.Todos.add({
            parentId: todoListId,
            done: false,
            text: newText,
            important: false,
            createDate: new Date().toDateString(),
            endDate: window.DateMaxValue.toDateString(),
            note: ""
          }).then(function() {
            if (callback !== void 0) {
              return callback();
            }
          });
        }

        AddTodoClass(todo, callback) {
          return database.Server.Todos.add({
            parentId: todo.ParentId,
            done: todo.Done,
            text: todo.Text,
            important: todo.Important,
            createDate: todo.CreateDate,
            endDate: todo.EndDate,
            note: todo.Note
          }).then(function() {
            if (callback !== void 0) {
              return callback();
            }
          });
        }

        UpdateTodo(todo, callback) {
          return database.Server.Todos.update({
            id: todo.Id,
            parentId: todo.ParentId,
            done: todo.Done,
            text: todo.Text,
            important: todo.Important,
            createDate: todo.CreateDate,
            endDate: todo.EndDate,
            note: todo.Note
          }).then(function() {
            if (callback !== void 0) {
              return callback();
            }
          });
        }

        RemoveTodo(id, callback) {
          return database.Server.Todos.remove(id).then(function() {
            return database.GetTStepsByParentId(id, function(results) {
              var i, len, step;
              for (i = 0, len = results.length; i < len; i++) {
                step = results[i];
                database.RemoveTStep(step.Id);
              }
              if (callback !== void 0) {
                return callback();
              }
            });
          });
        }

        FindTodo(text, callback) {
          return database.Server.Todos.query().filter(function(todo) {
            return todo.text.includes(text);
          }).execute().then(function(results) {
            var i, item, len, todo, todos;
            todos = [];
            for (i = 0, len = results.length; i < len; i++) {
              item = results[i];
              todo = new window.Todo(item.id, item.text, item.parentId, item.done, item.important, item.createDate, item.endDate, item.note);
              todos.push(todo);
            }
            if (callback !== void 0) {
              return callback(todos);
            } else {
              return todos;
            }
          });
        }

        //endregion Todos
        //region TSteps
        GetAllTSteps(callback) {
          return database.Server.TodoSteps.query().all().execute().then(function(results) {
            var i, item, len, step, steps;
            steps = [];
            for (i = 0, len = results.length; i < len; i++) {
              item = results[i];
              step = new window.TStep(item.id, item.text, item.parentId, item.done);
              steps.push(step);
            }
            if (callback !== void 0) {
              return callback(steps);
            } else {
              return steps;
            }
          });
        }

        GetTStepsByParentId(id, callback) {
          return database.Server.TodoSteps.query().filter("parentId", id).execute().then(function(results) {
            var i, item, len, step, steps;
            steps = [];
            for (i = 0, len = results.length; i < len; i++) {
              item = results[i];
              step = new window.TStep(item.id, item.text, item.parentId, item.done);
              steps.push(step);
            }
            if (callback !== void 0) {
              return callback(steps);
            } else {
              return steps;
            }
          });
        }

        AddTStep(newText, todoId, callback) {
          return database.Server.TodoSteps.add({
            parentId: todoId,
            done: false,
            text: newText
          }).then(function() {
            if (callback !== void 0) {
              return callback();
            }
          });
        }

        AddTStepClass(step, callback) {
          return database.Server.TodoSteps.add({
            parentId: step.ParentId,
            done: step.Done,
            text: step.Text
          }).then(function() {
            if (callback !== void 0) {
              return callback();
            }
          });
        }

        UpdateTStep(todoStep, callback) {
          return database.Server.TodoSteps.update({
            id: todoStep.Id,
            parentId: todoStep.ParentId,
            done: todoStep.Done,
            text: todoStep.Text
          }).then(function() {
            if (callback !== void 0) {
              return callback();
            }
          });
        }

        RemoveTStep(id, callback) {
          return database.Server.TodoSteps.remove(id).then(function() {
            if (callback !== void 0) {
              return callback();
            }
          });
        }

        //endregion TSteps
        ImportData(json, callback) {
          return database.Server.TodoLists.clear().then(function() {
            return database.Server.Todos.clear().then(function() {
              return database.Server.TodoSteps.clear().then(function() {
                var content, i, item, j, k, len, len1, len2, ref, ref1, ref2;
                content = JSON.parse(json);
                if (content.TLists !== void 0) {
                  ref = content.TLists;
                  for (i = 0, len = ref.length; i < len; i++) {
                    item = ref[i];
                    database.AddTlistClass(item);
                  }
                }
                if (content.TodoList !== void 0) {
                  ref1 = content.TodoList;
                  for (j = 0, len1 = ref1.length; j < len1; j++) {
                    item = ref1[j];
                    database.AddTodoClass(item);
                  }
                }
                if (content.StepList !== void 0) {
                  ref2 = content.StepList;
                  for (k = 0, len2 = ref2.length; k < len2; k++) {
                    item = ref2[k];
                    database.AddTStepClass(item);
                  }
                }
                return callback();
              });
            });
          });
        }

        ExportData(callback) {
          return database.GetAllTLists(function(tlists) {
            return database.GetAllTodos(function(todoList) {
              return database.GetAllTSteps(function(stepList) {
                var undividedTodos;
                undividedTodos = todoList.filter(function(item) {
                  return item.ParentId === window.UndividedTListId;
                });
                if (tlists.length > 0 || undividedTodos.length > 0) {
                  return callback(JSON.stringify({
                    TLists: tlists,
                    TodoList: todoList,
                    StepList: stepList
                  }));
                } else {
                  return callback("");
                }
              });
            });
          });
        }

      };

      PrivateClass.prototype.Server = {};

      return PrivateClass;

    }).call(this);

    return Database;

  }).call(this);

  window.DateMaxValue = new Date(9999, 11, 31, 23, 59, 59, 999);

  window.UndividedTListId = -1;

  window.Database = Database.Current();

}).call(this);


//# sourceMappingURL=Database.js.map
//# sourceURL=coffeescript