var GetTodayTodos = function (tlist, callback) {
    Database.Current().GetAllTodos(function (results) {
        var today = results.filter(function (item) { return item.EndDate == new Date().toDateString(); });
        callback(today);
    });
};
var AddTodayTodos = function (text, tlist, callback) {
    var todo = new Todo(-1, text, -1, false, false, new Date().toDateString(), new Date().toDateString(), "");
    Database.Current().AddTodoClass(todo, callback);
};
var GetImportantTodos = function (tlist, callback) {
    Database.Current().GetAllTodos(function (results) {
        var today = results.filter(function (item) { return item.Important; });
        callback(today);
    });
};
var AddImportantTodos = function (text, tlist, callback) {
    var todo = new Todo(-1, text, -1, false, true, new Date().toDateString(), DateMaxValue.toDateString(), "");
    Database.Current().AddTodoClass(todo, callback);
};
var GetPlannedTodos = function (tlist, callback) {
    Database.Current().GetAllTodos(function (results) {
        var today = results.filter(function (item) { return item.EndDate != DateMaxValue.toDateString(); });
        callback(today);
    });
};
var State = /** @class */ (function () {
    function State() {
        this.TodayTodos = new TList(-1, "Dnešní úkoly", "u-text-red bi bi-star", true, false, OrderTodo.None, GetTodayTodos, AddTodayTodos);
        this.ImportantTodos = new TList(-1, "Důležité úkoly", "u-text-yellow bi bi-sun", true, false, OrderTodo.None, GetImportantTodos, AddImportantTodos);
        this.PlannedTodos = new TList(-1, "Plánované úkoly", "u-text-blue bi bi-calendar", true, false, OrderTodo.None, GetPlannedTodos, AddTodayTodos);
        this.UndividedTodos = new TList(-1, "Nezařazené úkoly", "u-text-green bi bi-check-all", true, false, OrderTodo.None);
        this.TLists = [];
        this.Todos = [];
        this.TSteps = [];
        this.UnfinishedTodos = [];
        this.FinishedTodos = [];
    }
    State.Current = function () {
        if (!this.state) {
            this.state = new State();
        }
        return this.state;
    };
    State.prototype.AppInitialize = function () {
        var _this = this;
        Database.Current().InitializeDatabase(function () {
            GUI.Current().Initialize();
            _this.LoadTLists(function () {
                _this.SwitchTList(_this.TodayTodos);
            });
        });
    };
    State.prototype.ImportData = function (e) {
        var _this = this;
        try {
            var reader = new FileReader();
            reader.onload = function (event) {
                Database.Current().ImportData(event.target.result, function () {
                    _this.LoadTLists(function () {
                        _this.SwitchTList(_this.TodayTodos);
                    });
                });
            };
            reader.readAsText(event.target.files[0]);
        }
        catch (err) {
            GUI.Current().ShowTextDialog("Chyba", "Nastala chyba při čtení souboru");
        }
    };
    State.prototype.ExportData = function () {
        Database.Current().ExportData(function (json) {
            if (json.length > 0) {
                var base64 = window.btoa(json);
                GUI.Current().DownloadFile(base64);
            }
            else
                GUI.Current().ShowTextDialog("Chyba", "Nelze uložit soubor, pokud je databáze prázdná");
        });
    };
    State.prototype.ShowSearchView = function () {
        GUI.Current().ShowSearchView();
        this.CurrentTList = null;
        this.Todos = [];
        this.HideRightSidebar();
        GUI.Current().DrawMain();
        this.LoadTodos();
    };
    State.prototype.Search = function () {
        this.LoadTodos();
    };
    State.prototype.HideRightSidebar = function () {
        if (GUI.Current().RightSidebarStatus == SidebarState.Opened)
            GUI.Current().ToggleRightSidebar();
        this.CurrentTodo = null;
    };
    State.prototype.SetColorMode = function (e) {
        Settings.Current().SetDarkMode(e.checked);
        GUI.Current().SetColorMode();
    };
    State.prototype.LoadTLists = function (callback) {
        var _this = this;
        Database.Current().GetAllTLists(function (tlist) {
            _this.TLists = tlist;
            GUI.Current().DrawTLists();
            if (callback != undefined)
                callback();
        });
    };
    State.prototype.SwitchTList = function (todoList, callback) {
        GUI.Current().HideSearchView();
        this.CurrentTList = todoList;
        this.HideRightSidebar();
        this.LoadTodos(callback);
    };
    State.prototype.AddNewTListTextKeyUp = function (e) {
        if (e.key == "Enter")
            this.AddNewTList();
    };
    State.prototype.AddNewTList = function () {
        var _this = this;
        var name = GUI.Current().GetNewTListName();
        if (name != undefined && name.length > 0) {
            Database.Current().AddTlist(name, function () {
                GUI.Current().ClearNewTListName();
                _this.LoadTLists();
            });
        }
        else
            GUI.Current().ShowTextDialog("Chyba", "Název seznamu nesmí být prázdný");
    };
    State.prototype.TListNameChange = function (e) {
        var _this = this;
        var text = e.value;
        if (text != undefined && text.length > 0) {
            this.CurrentTList.Name = text;
            this.CurrentTList.Update(function () {
                _this.LoadTLists();
                GUI.Current().SetHeader();
            });
        }
        else
            GUI.Current().ShowTextDialog("Chyba", "Název seznamu nesmí být prázdný");
    };
    State.prototype.TListOrderTodoChange = function (e) {
        var _this = this;
        this.CurrentTList.OrderTodo = parseInt(e.value);
        this.CurrentTList.Update(function () {
            _this.LoadTLists(function () {
                _this.LoadTodos();
            });
        });
    };
    State.prototype.TListIconChange = function (e) {
        var _this = this;
        this.CurrentTList.Icon = e.value;
        this.CurrentTList.Update(function () {
            _this.LoadTLists();
            GUI.Current().SetHeader();
        });
    };
    State.prototype.RemoveTList = function () {
        var _this = this;
        this.CurrentTList.Remove(function () {
            _this.LoadTLists(function () {
                _this.SwitchTList(_this.TodayTodos);
            });
        });
    };
    State.prototype.TodoDividerClick = function (unfinishedButton) {
        var _this = this;
        if (!GUI.Current().SearchView) {
            if (unfinishedButton)
                this.CurrentTList.UnfinishedOpened = !this.CurrentTList.UnfinishedOpened;
            else
                this.CurrentTList.FinishedOpened = !this.CurrentTList.FinishedOpened;
            if (this.CurrentTList.Id != UndividedTListId) {
                this.CurrentTList.Update(function () {
                    _this.LoadTLists(function () {
                        GUI.Current().DrawMain();
                    });
                });
            }
            else
                GUI.Current().DrawMain();
        }
    };
    State.prototype.LoadTodos = function (callback) {
        var _this = this;
        if (!GUI.Current().SearchView) {
            this.CurrentTList.GetTodosByOrder(function (todos) {
                _this.Todos = todos;
                _this.UnfinishedTodos = _this.Todos.filter(function (todo) { return !todo.Done; });
                _this.FinishedTodos = _this.Todos.filter(function (todo) { return todo.Done; });
                GUI.Current().DrawTLists();
                GUI.Current().DrawMain();
                if (callback != undefined)
                    callback();
            });
        }
        else {
            var text = GUI.Current().GetSearchText();
            if (text != undefined && text.length > 0) {
                Database.Current().FindTodo(text, function (todos) {
                    _this.Todos = todos;
                    _this.UnfinishedTodos = _this.Todos.filter(function (todo) { return !todo.Done; });
                    _this.FinishedTodos = _this.Todos.filter(function (todo) { return todo.Done; });
                    GUI.Current().DrawTLists();
                    GUI.Current().DrawMain();
                    if (callback != undefined)
                        callback();
                });
            }
            else {
                this.Todos = [];
                this.UnfinishedTodos = [];
                this.FinishedTodos = [];
                GUI.Current().DrawTLists();
                GUI.Current().DrawMain();
            }
        }
    };
    State.prototype.TodoSelected = function (id) {
        var todoArray = this.Todos.filter(function (item) { return item.Id == id; });
        var todo = todoArray[0];
        if (this.CurrentTodo != todo) {
            this.CurrentTodo = todo;
            this.LoadTSteps(function (steps) {
                GUI.Current().SetRightSidebar();
                if (GUI.Current().RightSidebarStatus == SidebarState.Closed)
                    GUI.Current().ToggleRightSidebar();
            });
        }
        else
            this.HideRightSidebar();
    };
    State.prototype.AddNewTodoTextKeyUp = function (e) {
        if (e.key == "Enter")
            this.AddTodo();
    };
    State.prototype.AddTodo = function () {
        var _this = this;
        var text = GUI.Current().GetNewTodoText();
        if (text != undefined && text.length > 0) {
            this.CurrentTList.AddTodo(text, this.CurrentTList, function () {
                GUI.Current().ClearNewTodoText();
                _this.LoadTodos();
            });
        }
        else
            GUI.Current().ShowTextDialog("Chyba", "Text úkolu nesmí být prázdný");
    };
    State.prototype.TodoDoneChanged = function (id) {
        var _this = this;
        var todoArray = this.Todos.filter(function (item) { return item.Id == id; });
        var todo = todoArray[0];
        todo.Done = !todo.Done;
        todo.Update(function () {
            _this.LoadTodos(function () {
                if (todo == _this.CurrentTodo)
                    GUI.Current().SetRightSidebar();
            });
        });
    };
    State.prototype.TodoImportantChanged = function (id) {
        var _this = this;
        var todoArray = this.Todos.filter(function (item) { return item.Id == id; });
        var todo = todoArray[0];
        todo.Important = !todo.Important;
        todo.Update(function () {
            _this.LoadTodos(function () {
                if (todo == _this.CurrentTodo)
                    GUI.Current().SetRightSidebar();
            });
        });
    };
    State.prototype.TodoTextChanged = function (e) {
        var _this = this;
        var text = e.value;
        if (text != undefined && text.length > 0) {
            this.CurrentTodo.Text = text;
            this.CurrentTodo.Update(function () {
                _this.LoadTodos();
            });
        }
        else
            GUI.Current().ShowTextDialog("Chyba", "Text úkolu nesmí být prázdný");
    };
    State.prototype.TodoEndDateChanged = function (e) {
        var _this = this;
        this.CurrentTodo.EndDate = new Date(e.value).toDateString();
        this.CurrentTodo.Update(function () {
            _this.LoadTodos();
        });
    };
    State.prototype.TodoNoteChanged = function (e) {
        var _this = this;
        this.CurrentTodo.Note = e.value;
        this.CurrentTodo.Update(function () {
            _this.LoadTodos();
        });
    };
    State.prototype.RemoveTodo = function () {
        var _this = this;
        this.CurrentTodo.Remove(function () {
            _this.HideRightSidebar();
            _this.LoadTodos();
        });
    };
    State.prototype.LoadTSteps = function (callback) {
        var _this = this;
        this.CurrentTodo.GetTodoSteps(function (steps) {
            _this.TSteps = steps;
            GUI.Current().DrawTSteps();
            if (callback != undefined)
                callback();
        });
    };
    State.prototype.AddNewTStepTextKeyUp = function (e) {
        if (e.key == "Enter")
            this.AddTStep();
        ;
    };
    State.prototype.AddTStep = function () {
        var _this = this;
        var text = GUI.Current().GetNewTStepText();
        if (text != undefined && text.length > 0) {
            this.CurrentTodo.AddStep(text, function () {
                GUI.Current().ClearNewTStepText();
                _this.LoadTSteps();
            });
        }
        else
            GUI.Current().ShowTextDialog("Chyba", "Text kroku nesmí být prázdný");
    };
    State.prototype.TStepCheckedChanged = function (id) {
        var _this = this;
        var stepsArray = this.TSteps.filter(function (item) { return item.Id == id; });
        var step = stepsArray[0];
        step.Done = !step.Done;
        step.Update(function () {
            _this.LoadTSteps();
        });
    };
    State.prototype.TStepTextChanged = function (e, id) {
        var _this = this;
        var text = e.value;
        if (text != undefined && text.length > 0) {
            var stepsArray = this.TSteps.filter(function (item) { return item.Id == id; });
            var step = stepsArray[0];
            step.Text = text;
            step.Update(function () {
                _this.LoadTSteps();
            });
        }
        else
            GUI.Current().ShowTextDialog("Chyba", "Text kroku nesmí být prázdný");
    };
    State.prototype.RemoveTStep = function (id) {
        var _this = this;
        var stepsArray = this.TSteps.filter(function (item) { return item.Id == id; });
        var step = stepsArray[0];
        step.Remove(function () {
            _this.LoadTSteps();
        });
    };
    return State;
}());
State.Current().AppInitialize();
//# sourceMappingURL=State.js.map