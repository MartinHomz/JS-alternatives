enum OrderTodo {
    None = 0,
    Important,
    EndDate,
    Alphabet,
    CreateDate
}

const DefaultGetTodos = (tlist: TList, callback) => {
    Database.Current().GetTodosByParentId(tlist.Id, (todos) => {
        callback(todos);
    })
};

const DefaultAddTodo = (text: string, tlist: TList, callback) => {
    Database.Current().AddTodo(text, tlist.Id, callback)
};

class TList {
    public Id: number;
    public Name: string;
    public Icon: string;
    public UnfinishedOpened: boolean;
    public FinishedOpened: boolean;
    public OrderTodo: OrderTodo;
    public GetTodos;
    public AddTodo;

    public constructor(id: number = -1, name: string = "", icon: string = "",
        unfinishedOpened: boolean = true, finishedOpened: boolean = false,
        orderTodo: OrderTodo = OrderTodo.None, getTodos = DefaultGetTodos, addTodo = DefaultAddTodo) {
        this.Id = id;
        this.Name = name;
        this.Icon = icon;
        this.UnfinishedOpened = unfinishedOpened;
        this.FinishedOpened = finishedOpened;
        this.OrderTodo = orderTodo;
        this.GetTodos = getTodos;
        this.AddTodo = addTodo;
    }

    public Update(callback): void {
        Database.Current().UpdateTList(this, callback);
    }

    public Remove(callback): void {
        Database.Current().RemoveTList(this.Id, callback);
    }

    public GetTodosByOrder(callback):void {
        let orderTodo: OrderTodo = this.OrderTodo;
        this.GetTodos(this, (todos) => {
            switch (orderTodo) {
                case OrderTodo.Important:
                    callback(todos.sort((a, b) => { return b.Important - a.Important }));
                    break;
                case OrderTodo.EndDate:
                    callback(todos.sort((a:Todo, b:Todo) => { return new Date(a.EndDate).getTime() - new Date(b.EndDate).getTime() }));
                    break;
                case OrderTodo.Alphabet:
                    callback(todos.sort((a:Todo, b:Todo) => {
                        let textA = a.Text.toUpperCase();
                        let textB = b.Text.toUpperCase();
                        if (textA < textB) return -1
                        else if (textA > textB) return 1
                        else return 0
                    }));
                    break;
                case OrderTodo.CreateDate:
                    callback(todos.sort((a:Todo, b:Todo) => { return new Date(a.CreateDate).getTime() - new Date(b.CreateDate).getTime() }));
                    break;
                default:
                    callback(todos)
                    break;
            }
        })
    }

    public GetUnfinishedTodosCount(callback):void {
        this.GetTodos(this, (todos) => {
            let count: number = todos.filter((todo) => { return !todo.Done }).length
            callback(count > 0 ? count : "")
        })
    }
}