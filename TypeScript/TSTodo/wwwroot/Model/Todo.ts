class Todo extends TStep {
    public Important: boolean;
    public CreateDate: string;
    public EndDate: string;
    public Note: string;

    public constructor(id: number = -1, text: string = "", parentId: number = UndividedTListId,
        done: boolean = false, important: boolean = false, createDate: string = new Date().toDateString(),
        endDate: string = DateMaxValue.toDateString(), note: string = "") {
        super(id, text, parentId, done);
        this.Important = important;
        this.CreateDate = createDate;
        this.EndDate = endDate;
        this.Note = note;
    }

    public Update(callback): void {
        Database.Current().UpdateTodo(this, callback);
    }

    public Remove(callback): void {
        Database.Current().RemoveTodo(this.Id, callback);
    }

    public GetTodoSteps(callback):void {
        Database.Current().GetTStepsByParentId(this.Id, callback);
    }

    public AddStep(text: string, callback): void {
        Database.Current().AddTStep(text, this.Id, callback);
    }
}