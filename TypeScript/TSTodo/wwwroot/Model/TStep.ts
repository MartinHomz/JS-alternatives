class TStep {
    public Id: number;
    public Text: string;
    public ParentId: number;
    public Done: boolean;

    public constructor(id: number = -1, text: string = "", parentId: number = UndividedTListId,
        done: boolean = false) {
        this.Id = id;
        this.Text = text;
        this.ParentId = parentId;
        this.Done = done;
    }

    public Update(callback): void {
        Database.Current().UpdateTStep(this, callback);
    }

    public Remove(callback): void {
        Database.Current().RemoveTStep(this.Id, callback);
    }
}