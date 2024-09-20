(function() {
  var AddImportantTodos, AddTodayTodos, GetImportantTodos, GetPlannedTodos, GetTodayTodos, State;

  GetTodayTodos = function(callback) {
    return window.Database.GetAllTodos(function(results) {
      var today;
      today = results.filter(function(item) {
        return item.EndDate === new Date().toDateString();
      });
      return callback(today);
    });
  };

  AddTodayTodos = function(text, callback) {
    var todo;
    todo = new window.Todo(-1, text, -1, false, false, new Date().toDateString(), new Date().toDateString(), "");
    return window.Database.AddTodoClass(todo, callback);
  };

  GetImportantTodos = function(callback) {
    return window.Database.GetAllTodos(function(results) {
      var importants;
      importants = results.filter(function(item) {
        return item.Important;
      });
      return callback(importants);
    });
  };

  AddImportantTodos = function(text, callback) {
    var todo;
    todo = new window.Todo(-1, text, -1, false, true, new Date().toDateString(), window.DateMaxValue.toDateString(), "");
    return window.Database.AddTodoClass(todo, callback);
  };

  GetPlannedTodos = function(callback) {
    return window.Database.GetAllTodos(function(results) {
      var planned;
      planned = results.filter(function(item) {
        return item.EndDate !== window.DateMaxValue.toDateString();
      });
      return callback(planned);
    });
  };

  State = (function() {
    var PrivateClass, state;

    class State {
      static Current() {
        return state != null ? state : state = new PrivateClass();
      }

    };

    state = null;

    PrivateClass = (function() {
      class PrivateClass {
        AppInitialize() {
          return window.Database.InitializeDatabase(function() {
            window.GUI.Initialize();
            return state.LoadTLists(function() {
              return state.SwitchTList(state.TodayTodos);
            });
          });
        }

        ImportData(e) {
          var err, reader;
          try {
            reader = new FileReader();
            reader.onload = function(event) {
              return window.Database.ImportData(event.target.result, function() {
                return state.LoadTLists(function() {
                  return state.SwitchTList(state.TodayTodos);
                });
              });
            };
            return reader.readAsText(event.target.files[0]);
          } catch (error) {
            err = error;
            return window.GUI.ShowTextDialog("Chyba", "Nastala chyba při čtení souboru");
          }
        }

        ExportData() {
          return window.Database.ExportData(function(json) {
            var base64;
            if (json.length > 0) {
              base64 = window.btoa(json);
              return window.GUI.DownloadFile(base64);
            } else {
              return window.GUI.ShowTextDialog("Chyba", "Nelze uložit soubor, pokud je databáze prázdná");
            }
          });
        }

        ShowSearchView() {
          window.GUI.ShowSearchView();
          state.CurrentTList = null;
          state.Todos = [];
          state.HideRightSidebar();
          window.GUI.DrawMain();
          return state.LoadTodos();
        }

        Search() {
          return state.LoadTodos();
        }

        HideRightSidebar() {
          if (window.GUI.RightSidebarStatus === window.SidebarState.Opened) {
            window.GUI.ToggleRightSidebar();
          }
          return state.CurrentTodo = null;
        }

        SetColorMode(e) {
          window.Settings.SetDarkMode(e.checked);
          return window.GUI.SetColorMode();
        }

        LoadTLists(callback) {
          return window.Database.GetAllTLists(function(tlist) {
            state.TLists = tlist;
            window.GUI.DrawTLists();
            if (callback !== void 0) {
              return callback();
            }
          });
        }

        SwitchTList(todoList, callback) {
          window.GUI.HideSearchView();
          state.CurrentTList = todoList;
          state.HideRightSidebar();
          return state.LoadTodos(callback);
        }

        AddNewTListTextKeyUp(e) {
          if (e.key === "Enter") {
            return state.AddNewTList();
          }
        }

        AddNewTList() {
          var name;
          name = window.GUI.GetNewTListName();
          if (name !== void 0 && name.length > 0) {
            return window.Database.AddTlist(name, function() {
              window.GUI.ClearNewTListName();
              return state.LoadTLists();
            });
          } else {
            return window.GUI.ShowTextDialog("Chyba", "Název seznamu nesmí být prázdný");
          }
        }

        TListNameChange(e) {
          var text;
          text = e.value;
          if (text !== void 0 && text.length > 0) {
            state.CurrentTList.Name = text;
            return state.CurrentTList.Update(function() {
              state.LoadTLists();
              return window.GUI.SetHeader();
            });
          } else {
            return window.GUI.ShowTextDialog("Chyba", "Název seznamu nesmí být prázdný");
          }
        }

        TListOrderTodoChange(e) {
          state.CurrentTList.OrderTodo = parseInt(e.value);
          return state.CurrentTList.Update(function() {
            return state.LoadTLists(function() {
              return state.LoadTodos();
            });
          });
        }

        TListIconChange(e) {
          state.CurrentTList.Icon = e.value;
          return state.CurrentTList.Update(function() {
            state.LoadTLists();
            return window.GUI.SetHeader();
          });
        }

        RemoveTList() {
          return state.CurrentTList.Remove(function() {
            return state.LoadTLists(function() {
              return state.SwitchTList(state.TodayTodos);
            });
          });
        }

        TodoDividerClick(unfinishedButton) {
          if (!window.GUI.SearchView) {
            if (unfinishedButton) {
              state.CurrentTList.UnfinishedOpened = !state.CurrentTList.UnfinishedOpened;
            } else {
              state.CurrentTList.FinishedOpened = !state.CurrentTList.FinishedOpened;
            }
            if (state.CurrentTList.Id !== window.UndividedTListId) {
              return state.CurrentTList.Update(function() {
                return state.LoadTLists(function() {
                  return window.GUI.DrawMain();
                });
              });
            } else {
              return window.GUI.DrawMain();
            }
          }
        }

        LoadTodos(callback) {
          var text;
          if (!window.GUI.SearchView) {
            return state.CurrentTList.GetTodosByOrder(function(todos) {
              state.Todos = todos;
              state.UnfinishedTodos = state.Todos.filter(function(todo) {
                return !todo.Done;
              });
              state.FinishedTodos = state.Todos.filter(function(todo) {
                return todo.Done;
              });
              window.GUI.DrawTLists();
              window.GUI.DrawMain();
              if (callback !== void 0) {
                return callback();
              }
            });
          } else {
            text = window.GUI.GetSearchText();
            if (text !== void 0 && text.length > 0) {
              return window.Database.FindTodo(text, function(todos) {
                state.Todos = todos;
                state.UnfinishedTodos = state.Todos.filter(function(todo) {
                  return !todo.Done;
                });
                state.FinishedTodos = state.Todos.filter(function(todo) {
                  return todo.Done;
                });
                window.GUI.DrawTLists();
                window.GUI.DrawMain();
                if (callback !== void 0) {
                  return callback();
                }
              });
            } else {
              state.Todos = [];
              state.UnfinishedTodos = [];
              state.FinishedTodos = [];
              window.GUI.DrawTLists();
              return window.GUI.DrawMain();
            }
          }
        }

        TodoSelected(id) {
          var todo, todoArray;
          todoArray = state.Todos.filter(function(item) {
            return item.Id === id;
          });
          todo = todoArray[0];
          if (state.CurrentTodo !== todo) {
            state.CurrentTodo = todo;
            return state.LoadTSteps(function(steps) {
              window.GUI.SetRightSidebar();
              if (window.GUI.RightSidebarStatus === window.SidebarState.Closed) {
                return window.GUI.ToggleRightSidebar();
              }
            });
          } else {
            return state.HideRightSidebar();
          }
        }

        AddNewTodoTextKeyUp(e) {
          if (e.key === "Enter") {
            return state.AddTodo();
          }
        }

        AddTodo() {
          var text;
          text = window.GUI.GetNewTodoText();
          if (text !== void 0 && text.length > 0) {
            return state.CurrentTList.AddTodo(text, function() {
              window.GUI.ClearNewTodoText();
              return state.LoadTodos();
            });
          } else {
            return window.GUI.ShowTextDialog("Chyba", "Text úkolu nesmí být prázdný");
          }
        }

        TodoDoneChanged(id) {
          var todo, todoArray;
          todoArray = state.Todos.filter(function(item) {
            return item.Id === id;
          });
          todo = todoArray[0];
          todo.Done = !todo.Done;
          return todo.Update(function() {
            return state.LoadTodos(function() {
              if (todo === state.CurrentTodo) {
                return window.GUI.SetRightSidebar();
              }
            });
          });
        }

        TodoImportantChanged(id) {
          var todo, todoArray;
          todoArray = state.Todos.filter(function(item) {
            return item.Id === id;
          });
          todo = todoArray[0];
          todo.Important = !todo.Important;
          return todo.Update(function() {
            return state.LoadTodos(function() {
              if (todo === state.CurrentTodo) {
                return window.GUI.SetRightSidebar();
              }
            });
          });
        }

        TodoTextChanged(e) {
          var text;
          text = e.value;
          if (text !== void 0 && text.length > 0) {
            state.CurrentTodo.Text = text;
            return state.CurrentTodo.Update(function() {
              return state.LoadTodos();
            });
          } else {
            return window.GUI.ShowTextDialog("Chyba", "Text úkolu nesmí být prázdný");
          }
        }

        TodoEndDateChanged(e) {
          state.CurrentTodo.EndDate = new Date(e.value).toDateString();
          return state.CurrentTodo.Update(function() {
            return state.LoadTodos();
          });
        }

        TodoNoteChanged(e) {
          state.CurrentTodo.Note = e.value;
          return state.CurrentTodo.Update(function() {
            return state.LoadTodos();
          });
        }

        RemoveTodo() {
          return state.CurrentTodo.Remove(function() {
            state.HideRightSidebar();
            return state.LoadTodos();
          });
        }

        LoadTSteps(callback) {
          return state.CurrentTodo.GetTodoSteps(function(steps) {
            state.TSteps = steps;
            window.GUI.DrawTSteps();
            if (callback !== void 0) {
              return callback();
            }
          });
        }

        AddNewTStepTextKeyUp(e) {
          if (e.key === "Enter") {
            return state.AddTStep();
          }
        }

        AddTStep() {
          var text;
          text = window.GUI.GetNewTStepText();
          if (text !== void 0 && text.length > 0) {
            return state.CurrentTodo.AddStep(text, function() {
              window.GUI.ClearNewTStepText();
              return state.LoadTSteps();
            });
          } else {
            return window.GUI.ShowTextDialog("Chyba", "Text kroku nesmí být prázdný");
          }
        }

        TStepCheckedChanged(id) {
          var step, stepsArray;
          stepsArray = state.TSteps.filter(function(item) {
            return item.Id === id;
          });
          step = stepsArray[0];
          step.Done = !step.Done;
          return step.Update(function() {
            return state.LoadTSteps();
          });
        }

        TStepTextChanged(e, id) {
          var step, stepsArray, text;
          text = e.value;
          if (text !== void 0 && text.length > 0) {
            stepsArray = state.TSteps.filter(function(item) {
              return item.Id === id;
            });
            step = stepsArray[0];
            step.Text = text;
            return step.Update(function() {
              return state.LoadTSteps();
            });
          } else {
            return window.GUI.ShowTextDialog("Chyba", "Text kroku nesmí být prázdný");
          }
        }

        RemoveTStep(id) {
          var step, stepsArray;
          stepsArray = state.TSteps.filter((item) => {
            return item.Id === id;
          });
          step = stepsArray[0];
          return step.Remove(function() {
            return state.LoadTSteps();
          });
        }

      };

      PrivateClass.prototype.TodayTodos = new window.TList(-1, "Dnešní úkoly", "u-text-red bi bi-star", true, false, window.OrderTodo.None, GetTodayTodos, AddTodayTodos);

      PrivateClass.prototype.ImportantTodos = new window.TList(-1, "Důležité úkoly", "u-text-yellow bi bi-sun", true, false, window.OrderTodo.None, GetImportantTodos, AddImportantTodos);

      PrivateClass.prototype.PlannedTodos = new window.TList(-1, "Plánované úkoly", "u-text-blue bi bi-calendar", true, false, window.OrderTodo.None, GetPlannedTodos, AddTodayTodos);

      PrivateClass.prototype.UndividedTodos = new window.TList(-1, "Nezařazené úkoly", "u-text-green bi bi-check-all", true, false, window.OrderTodo.None);

      PrivateClass.prototype.TLists = [];

      PrivateClass.prototype.Todos = [];

      PrivateClass.prototype.TSteps = [];

      PrivateClass.prototype.CurrentTList = {};

      PrivateClass.prototype.CurrentTodo = {};

      PrivateClass.prototype.UnfinishedTodos = [];

      PrivateClass.prototype.FinishedTodos = [];

      return PrivateClass;

    }).call(this);

    return State;

  }).call(this);

  window.State = State.Current();

  window.State.AppInitialize();

}).call(this);


//# sourceMappingURL=State.js.map
//# sourceURL=coffeescript