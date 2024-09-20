const GetTodayTodos = (tlist:TList, callback) => {
    Database.Current().GetAllTodos((results) => {
        let today: Todo[] = results.filter((item) => { return item.EndDate == new Date().toDateString(); });
        callback(today);
    });
}

const AddTodayTodos = (text:string, tlist: TList, callback) => {
    let todo: Todo = new Todo(-1, text, -1, false, false, new Date().toDateString(), new Date().toDateString(), "");
    Database.Current().AddTodoClass(todo, callback);
}

const GetImportantTodos = (tlist: TList, callback) => {
    Database.Current().GetAllTodos((results) => {
        let today: Todo[] = results.filter((item) => { return item.Important; });
        callback(today);
    });
}

const AddImportantTodos = (text: string, tlist: TList, callback) => {
    let todo: Todo = new Todo(-1, text, -1, false, true, new Date().toDateString(), DateMaxValue.toDateString(), "");
    Database.Current().AddTodoClass(todo, callback);
}

const GetPlannedTodos = (tlist: TList, callback) => {
    Database.Current().GetAllTodos((results) => {
        let today: Todo[] = results.filter((item) => { return item.EndDate != DateMaxValue.toDateString(); });
        callback(today);
    });
}

class State {
    private static state: State;
    private constructor() { }

    public static Current(): State {
        if (!this.state) {
            this.state = new State();
        }
        return this.state;
    }

    public TodayTodos: TList = new TList(-1, "Dnešní úkoly", "u-text-red bi bi-star", true, false, OrderTodo.None, GetTodayTodos, AddTodayTodos);
    public ImportantTodos: TList = new TList(-1, "Důležité úkoly", "u-text-yellow bi bi-sun", true, false, OrderTodo.None, GetImportantTodos, AddImportantTodos);
    public PlannedTodos: TList = new TList(-1, "Plánované úkoly", "u-text-blue bi bi-calendar", true, false, OrderTodo.None, GetPlannedTodos, AddTodayTodos);
    public UndividedTodos: TList = new TList(-1, "Nezařazené úkoly", "u-text-green bi bi-check-all", true, false, OrderTodo.None);
    public TLists: TList[] = [];
    public Todos: Todo[] = [];
    public TSteps: TStep[] = [];
    public CurrentTList: TList;
    public CurrentTodo: Todo;
    public UnfinishedTodos: Todo[] = [];
    public FinishedTodos: Todo[] = [];

    public AppInitialize(): void {
        Database.Current().InitializeDatabase(() => {
            GUI.Current().Initialize()
            this.LoadTLists(() => {
                this.SwitchTList(this.TodayTodos);
            });
        });
    }

    public ImportData(e): void {
        try {
            let reader = new FileReader();
            reader.onload = (event) => {
                Database.Current().ImportData(event.target.result, () => {
                    this.LoadTLists(() => {
                        this.SwitchTList(this.TodayTodos);
                    });
                });
            };
            reader.readAsText(event.target.files[0]);
        }
        catch (err) {
            GUI.Current().ShowTextDialog("Chyba", "Nastala chyba při čtení souboru");
        }
    }

    public ExportData(): void {
        Database.Current().ExportData((json: string) => {
            if (json.length > 0) {
                let base64:string = window.btoa(json);
                GUI.Current().DownloadFile(base64);
            }
            else
                GUI.Current().ShowTextDialog("Chyba", "Nelze uložit soubor, pokud je databáze prázdná");
        });
    }

    public ShowSearchView(): void {
        GUI.Current().ShowSearchView();
        this.CurrentTList = null;
        this.Todos = [];
        this.HideRightSidebar();
        GUI.Current().DrawMain();
        this.LoadTodos();
    }

    public Search(): void {
        this.LoadTodos();
    }

    public HideRightSidebar(): void {
        if (GUI.Current().RightSidebarStatus == SidebarState.Opened)
            GUI.Current().ToggleRightSidebar();
        this.CurrentTodo = null;
    }

    public SetColorMode(e): void {
        Settings.Current().SetDarkMode(e.checked);
        GUI.Current().SetColorMode();
    }

    public LoadTLists(callback?): void {
        Database.Current().GetAllTLists((tlist:TList[]) => {
            this.TLists = tlist;
            GUI.Current().DrawTLists();
            if (callback != undefined)
                callback();
        });
    }

    public SwitchTList(todoList, callback?): void {
        GUI.Current().HideSearchView();
        this.CurrentTList = todoList;
        this.HideRightSidebar();
        this.LoadTodos(callback);
    }

    public AddNewTListTextKeyUp(e): void {
        if (e.key == "Enter")
            this.AddNewTList();
    }

    public AddNewTList(): void {
        let name:string = GUI.Current().GetNewTListName();
        if (name != undefined && name.length > 0) {
            Database.Current().AddTlist(name, () => {
                GUI.Current().ClearNewTListName();
                this.LoadTLists();
            });
        }
        else
            GUI.Current().ShowTextDialog("Chyba", "Název seznamu nesmí být prázdný");
    }

    public TListNameChange(e): void {
        let text:string = e.value;
        if (text != undefined && text.length > 0) {
            this.CurrentTList.Name = text;
            this.CurrentTList.Update(() => {
                this.LoadTLists();
                GUI.Current().SetHeader();
            });
        }
        else
            GUI.Current().ShowTextDialog("Chyba", "Název seznamu nesmí být prázdný");
    }

    public TListOrderTodoChange(e): void {
        this.CurrentTList.OrderTodo = parseInt(e.value);
        this.CurrentTList.Update(() => {
            this.LoadTLists(() => {
                this.LoadTodos();
            });
        });
    }

    public TListIconChange(e): void {
        this.CurrentTList.Icon = e.value;
        this.CurrentTList.Update(() => {
            this.LoadTLists();
            GUI.Current().SetHeader();
        });
    }

    public RemoveTList(): void {
        this.CurrentTList.Remove(() => {
            this.LoadTLists(() => {
                this.SwitchTList(this.TodayTodos);
            });
        });
    }

    public TodoDividerClick(unfinishedButton: boolean): void {
        if (!GUI.Current().SearchView) {
            if (unfinishedButton)
                this.CurrentTList.UnfinishedOpened = !this.CurrentTList.UnfinishedOpened;
            else
                this.CurrentTList.FinishedOpened = !this.CurrentTList.FinishedOpened;
            if (this.CurrentTList.Id != UndividedTListId) {
                this.CurrentTList.Update(() => {
                    this.LoadTLists(() => {
                        GUI.Current().DrawMain();
                    });
                });
            }
            else
                GUI.Current().DrawMain();
        }
    }

    public LoadTodos(callback?): void {
        if (!GUI.Current().SearchView) {
            this.CurrentTList.GetTodosByOrder((todos:Todo[]) => {
                this.Todos = todos;
                this.UnfinishedTodos = this.Todos.filter((todo: Todo) => { return !todo.Done; });
                this.FinishedTodos = this.Todos.filter((todo: Todo) => { return todo.Done; });
                GUI.Current().DrawTLists()
                GUI.Current().DrawMain()
                if (callback != undefined)
                    callback();
            });
        }
        else {
            let text: string = GUI.Current().GetSearchText();
            if (text != undefined && text.length > 0) {
                Database.Current().FindTodo(text, (todos:Todo[]) => {
                    this.Todos = todos;
                    this.UnfinishedTodos = this.Todos.filter((todo: Todo) => { return !todo.Done; });
                    this.FinishedTodos = this.Todos.filter((todo: Todo) => { return todo.Done;});
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
    }

    public TodoSelected(id:number): void {
        let todoArray: Todo[] = this.Todos.filter((item:Todo) => { return item.Id == id });
        let todo: Todo = todoArray[0];
        if (this.CurrentTodo != todo) {
            this.CurrentTodo = todo;
            this.LoadTSteps((steps:TStep[]) => {
                GUI.Current().SetRightSidebar();
                if (GUI.Current().RightSidebarStatus == SidebarState.Closed)
                    GUI.Current().ToggleRightSidebar();
            });
        }
        else
            this.HideRightSidebar();
    }

    public AddNewTodoTextKeyUp(e): void {
        if (e.key == "Enter")
            this.AddTodo();
    }

    public AddTodo(): void {
        let text:string = GUI.Current().GetNewTodoText();
        if (text != undefined && text.length > 0) {
            this.CurrentTList.AddTodo(text, this.CurrentTList, () => {
                GUI.Current().ClearNewTodoText();
                this.LoadTodos();
            });
        }
        else
            GUI.Current().ShowTextDialog("Chyba", "Text úkolu nesmí být prázdný");
    }

    public TodoDoneChanged(id:number): void {
        let todoArray:Todo[] = this.Todos.filter((item:Todo) => { return item.Id == id });
        let todo:Todo = todoArray[0];
        todo.Done = !todo.Done;
        todo.Update(() => {
            this.LoadTodos(() => {
                if (todo == this.CurrentTodo)
                    GUI.Current().SetRightSidebar();
            });
        });
    }

    public TodoImportantChanged(id: number): void {
        let todoArray: Todo[] = this.Todos.filter((item: Todo) => { return item.Id == id });
        let todo:Todo = todoArray[0];
        todo.Important = !todo.Important;
        todo.Update(() => {
            this.LoadTodos(() => {
                if (todo == this.CurrentTodo)
                    GUI.Current().SetRightSidebar();
            });
        });
    }

    public TodoTextChanged(e): void {
        let text: string = e.value;
        if (text != undefined && text.length > 0) {
            this.CurrentTodo.Text = text;
            this.CurrentTodo.Update(() => {
                this.LoadTodos();
            });
        }
        else
            GUI.Current().ShowTextDialog("Chyba", "Text úkolu nesmí být prázdný");
    }

    public TodoEndDateChanged(e): void {
        this.CurrentTodo.EndDate = new Date(e.value).toDateString();
        this.CurrentTodo.Update(() => {
            this.LoadTodos();
        });
    }

    public TodoNoteChanged(e): void {
        this.CurrentTodo.Note = e.value;
        this.CurrentTodo.Update(() => {
            this.LoadTodos();
        });
    }

    public RemoveTodo(): void {
        this.CurrentTodo.Remove(() => {
            this.HideRightSidebar();
            this.LoadTodos();
        });
    }

    public LoadTSteps(callback?): void {
        this.CurrentTodo.GetTodoSteps((steps: TStep[]) => {
            this.TSteps = steps;
            GUI.Current().DrawTSteps();
            if (callback != undefined)
                callback();
        });
    }

    public AddNewTStepTextKeyUp(e): void {
        if (e.key == "Enter")
            this.AddTStep();;
    }

    public AddTStep(): void {
        let text:string = GUI.Current().GetNewTStepText();
        if (text != undefined && text.length > 0) {
            this.CurrentTodo.AddStep(text, () => {
                GUI.Current().ClearNewTStepText();
                this.LoadTSteps();
            });
        }
        else
            GUI.Current().ShowTextDialog("Chyba", "Text kroku nesmí být prázdný");
    }

    public TStepCheckedChanged(id: number): void {
        let stepsArray: TStep[] = this.TSteps.filter((item: TStep) => { return item.Id == id });
        let step: TStep = stepsArray[0];
        step.Done = !step.Done;
        step.Update(() => {
            this.LoadTSteps();
        });
    }

    public TStepTextChanged(e, id:number): void {
        let text:string = e.value;
        if (text != undefined && text.length > 0) {
            let stepsArray: TStep[] = this.TSteps.filter((item: TStep) => { return item.Id == id });
            let step: TStep = stepsArray[0];
            step.Text = text;
            step.Update(() => {
                this.LoadTSteps();
            });
        }
        else
            GUI.Current().ShowTextDialog("Chyba", "Text kroku nesmí být prázdný");
    }

    public RemoveTStep(id:number): void {
        let stepsArray: TStep[] = this.TSteps.filter((item: TStep) => { return item.Id == id });
        let step:TStep = stepsArray[0];
        step.Remove(() => {
            this.LoadTSteps();
        });
    }
}

State.Current().AppInitialize();