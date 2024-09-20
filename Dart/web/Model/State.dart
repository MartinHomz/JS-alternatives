import 'dart:html';

import 'Database.dart';
import 'GUI.dart';
import 'Settings.dart';
import 'TList.dart';
import 'TStep.dart';
import 'Todo.dart';

Function GetTodayTodos = (TList tlist, Function callback) {
  //Database.Current().GetTodosByParentId(tlist.Id, (todos) {
  //  callback(todos);
  //});
};

Function AddTodayTodos = (String text, TList tlist, Function callback) {
  //Database.Current().AddTodo(text, tlist.Id, callback);
};

Function GetImportantTodos = (TList tlist, Function callback) {
  //Database.Current().GetTodosByParentId(tlist.Id, (todos) {
  //  callback(todos);
  //});
};

Function AddImportantTodos = (String text, TList tlist, Function callback) {
  //Database.Current().AddTodo(text, tlist.Id, callback);
};

Function GetPlannedTodos = (TList tlist, Function callback) {
  //Database.Current().GetTodosByParentId(tlist.Id, (todos) {
  //  callback(todos);
  //});
};

class State {
  static final State Current = State._state();

  factory State() {
    return Current;
  }

  State._state();

  TList TodayTodos = TList(
      id: -1,
      name: 'Dnešní úkoly',
      icon: 'u-text-red bi bi-star',
      unfinishedOpened: true,
      finishedOpened: false,
      orderTodo: eOrderTodo.None);
  TList ImportantTodos = TList(
      id: -1,
      name: 'Důležité úkoly',
      icon: 'u-text-yellow bi bi-sun',
      unfinishedOpened: true,
      finishedOpened: false,
      orderTodo: eOrderTodo.None);
  TList PlannedTodos = TList(
      id: -1,
      name: 'Plánované úkoly',
      icon: 'u-text-blue bi bi-calendar',
      unfinishedOpened: true,
      finishedOpened: false,
      orderTodo: eOrderTodo.None);
  TList UndividedTodos = TList(
      id: -1,
      name: 'Nezařazené úkoly',
      icon: 'u-text-green bi bi-check-all',
      unfinishedOpened: true,
      finishedOpened: false,
      orderTodo: eOrderTodo.None);
  List<TList> TLists = [];
  List<Todo> Todos = [];
  List<TStep> TSteps = [];
  TList CurrentTList;
  Todo CurrentTodo;
  List<Todo> UnfinishedTodos = [];
  List<Todo> FinishedTodos = [];

  void AppInitialize() {
    TodayTodos.GetTodos = GetTodayTodos;
    TodayTodos.AddTodo = AddTodayTodos;
    ImportantTodos.GetTodos = GetImportantTodos;
    ImportantTodos.AddTodo = AddImportantTodos;
    PlannedTodos.GetTodos = GetPlannedTodos;

    Database.Current.InitializeDatabase(callback: () {
      GUI.Current.Initialize();
      LoadTLists(callback: () {
        SwitchTList(TodayTodos);
      });
    });
  }

  void ImportData(e) {
    try {
      //var reader = new FileReader();
      //reader.onload = (event) {
      //    Database.Current.ImportData(event.target.result, callback: () {
      //        LoadTLists(callback: () {
      //            SwitchTList(TodayTodos);
      //        });
      //    });
      //};
      //reader.readAsText(event.target.files[0]);
    } catch (err) {
      GUI.Current.ShowTextDialog('Chyba', 'Nastala chyba při čtení souboru');
    }
  }

  void ExportData() {
    Database.Current.ExportData(callback: (String json) {
      if (json.isNotEmpty) {
        //let base64:string = window.btoa(json);
        //GUI.Current.DownloadFile(base64);
      } else {
        GUI.Current.ShowTextDialog(
            'Chyba', 'Nelze uložit soubor, pokud je databáze prázdná');
      }
    });
  }

  void ShowSearchView() {
    GUI.Current.ShowSearchView();
    CurrentTList = null;
    Todos = [];
    HideRightSidebar();
    GUI.Current.DrawMain();
    LoadTodos();
  }

  void Search() {
    LoadTodos();
  }

  void HideRightSidebar() {
    if (GUI.Current.RightSidebarStatus == eSidebarState.Opened) {
      GUI.Current.ToggleRightSidebar();
    }
    CurrentTodo = null;
  }

  void SetColorMode(e) {
    Settings.Current.SetDarkMode(e.checked);
    GUI.Current.SetColorMode();
  }

  void LoadTLists({callback}) {
    Database.Current.GetAllTLists(callback: (List<TList> tlist) {
      TLists = tlist;
      GUI.Current.DrawTLists();
      if (callback != null) callback();
    });
  }

  void SwitchTList(todoList, {callback}) {
    GUI.Current.HideSearchView();
    CurrentTList = todoList;
    HideRightSidebar();
    LoadTodos(callback: callback);
  }

  void AddNewTListTextKeyUp(KeyEvent e) {
    if (e.key == 'Enter') AddNewTList();
  }

  void AddNewTList() {
    var name = GUI.Current.GetNewTListName();
    if (name != null && name.isNotEmpty) {
      Database.Current.AddTlist(name, callback: () {
        GUI.Current.ClearNewTListName();
        LoadTLists();
      });
    } else {
      GUI.Current.ShowTextDialog('Chyba', 'Název seznamu nesmí být prázdný');
    }
  }

  void TListNameChange(e) {
    String text = e.value;
    if (text != null && text.isNotEmpty) {
      CurrentTList.Name = text;
      CurrentTList.Update(() {
        LoadTLists();
        GUI.Current.SetHeader();
      });
    } else {
      GUI.Current.ShowTextDialog('Chyba', 'Název seznamu nesmí být prázdný');
    }
  }

  void TListOrderTodoChange(e) {
    CurrentTList.OrderTodo = (e.value);
    CurrentTList.Update(() {
      LoadTLists(callback: () {
        LoadTodos();
      });
    });
  }

  void TListIconChange(e) {
    CurrentTList.Icon = e.value;
    CurrentTList.Update(() {
      LoadTLists();
      GUI.Current.SetHeader();
    });
  }

  void RemoveTList() {
    CurrentTList.Remove(() {
      LoadTLists(callback: () {
        SwitchTList(TodayTodos);
      });
    });
  }

  void TodoDividerClick(bool unfinishedButton) {
    if (!GUI.Current.SearchView) {
      if (unfinishedButton) {
        CurrentTList.UnfinishedOpened = !CurrentTList.UnfinishedOpened;
      } else {
        CurrentTList.FinishedOpened = !CurrentTList.FinishedOpened;
      }
      if (CurrentTList.Id != UndividedTListId) {
        CurrentTList.Update(() {
          LoadTLists(callback: () {
            GUI.Current.DrawMain();
          });
        });
      } else {
        GUI.Current.DrawMain();
      }
    }
  }

  void LoadTodos({callback}) {
    if (!GUI.Current.SearchView) {
      CurrentTList.GetTodosByOrder((List<Todo> todos) {
        Todos = todos;
        UnfinishedTodos = Todos.where((Todo todo) {
          return !todo.Done;
        });
        FinishedTodos = Todos.where((Todo todo) {
          return todo.Done;
        });
        GUI.Current.DrawTLists();
        GUI.Current.DrawMain();
        if (callback != null) callback();
      });
    } else {
      var text = GUI.Current.GetSearchText();
      if (text != null && text.isNotEmpty) {
        Database.Current.FindTodo(text, callback: (List<Todo> todos) {
          Todos = todos;
          UnfinishedTodos = Todos.where((Todo todo) {
            return !todo.Done;
          });
          FinishedTodos = Todos.where((Todo todo) {
            return todo.Done;
          });
          GUI.Current.DrawTLists();
          GUI.Current.DrawMain();
          if (callback != null) callback();
        });
      } else {
        Todos = [];
        UnfinishedTodos = [];
        FinishedTodos = [];
        GUI.Current.DrawTLists();
        GUI.Current.DrawMain();
      }
    }
  }

  void TodoSelected(int id) {
    List<Todo> todoArray = Todos.where((Todo item) {
      return item.Id == id;
    });
    var todo = todoArray[0];
    if (CurrentTodo != todo) {
      CurrentTodo = todo;
      LoadTSteps(callback: (List<TStep> steps) {
        GUI.Current.SetRightSidebar();
        if (GUI.Current.RightSidebarStatus == eSidebarState.Closed) {
          GUI.Current.ToggleRightSidebar();
        }
      });
    } else {
      HideRightSidebar();
    }
  }

  void AddNewTodoTextKeyUp(KeyEvent e) {
    if (e.key == 'Enter') AddTodo();
  }

  void AddTodo() {
    var text = GUI.Current.GetNewTodoText();
    if (text != null && text.isNotEmpty) {
      CurrentTList.AddTodo(text, CurrentTList, callback: () {
        GUI.Current.ClearNewTodoText();
        LoadTodos();
      });
    } else {
      GUI.Current.ShowTextDialog('Chyba', 'Text úkolu nesmí být prázdný');
    }
  }

  void TodoDoneChanged(int id) {
    List<Todo> todoArray = Todos.where((Todo item) {
      return item.Id == id;
    });
    var todo = todoArray[0];
    todo.Done = !todo.Done;
    todo.Update(() {
      LoadTodos(callback: () {
        if (todo == CurrentTodo) GUI.Current.SetRightSidebar();
      });
    });
  }

  void TodoImportantChanged(int id) {
    List<Todo> todoArray = Todos.where((Todo item) {
      return item.Id == id;
    });
    var todo = todoArray[0];
    todo.Important = !todo.Important;
    todo.Update(() {
      LoadTodos(callback: () {
        if (todo == CurrentTodo) GUI.Current.SetRightSidebar();
      });
    });
  }

  void TodoTextChanged(e) {
    String text = e.value;
    if (text != null && text.isNotEmpty) {
      CurrentTodo.Text = text;
      CurrentTodo.Update(() {
        LoadTodos();
      });
    } else {
      GUI.Current.ShowTextDialog('Chyba', 'Text úkolu nesmí být prázdný');
    }
  }

  void TodoEndDateChanged(e) {
    CurrentTodo.EndDate = DateTime(e.value).toString();
    CurrentTodo.Update(() {
      LoadTodos();
    });
  }

  void TodoNoteChanged(e) {
    CurrentTodo.Note = e.value;
    CurrentTodo.Update(() {
      LoadTodos();
    });
  }

  void RemoveTodo() {
    CurrentTodo.Remove(() {
      HideRightSidebar();
      LoadTodos();
    });
  }

  void LoadTSteps({callback}) {
    CurrentTodo.GetTodoSteps((List<TStep> steps) {
      TSteps = steps;
      GUI.Current.DrawTSteps();
      if (callback != null) callback();
    });
  }

  void AddNewTStepTextKeyUp(KeyEvent e) {
    if (e.key == 'Enter') AddTStep();
  }

  void AddTStep() {
    var text = GUI.Current.GetNewTStepText();
    if (text != null && text.isNotEmpty) {
      CurrentTodo.AddStep(text, () {
        GUI.Current.ClearNewTStepText();
        LoadTSteps();
      });
    } else {
      GUI.Current.ShowTextDialog('Chyba', 'Text kroku nesmí být prázdný');
    }
  }

  void TStepCheckedChanged(int id) {
    List<TStep> stepsArray = TSteps.where((TStep item) {
      return item.Id == id;
    });
    var step = stepsArray[0];
    step.Done = !step.Done;
    step.Update(() {
      LoadTSteps();
    });
  }

  void TStepTextChanged(e, int id) {
    var text = e.value;
    if (text != null && text.length > 0) {
      List<TStep> stepsArray = TSteps.where((TStep item) {
        return item.Id == id;
      });
      var step = stepsArray[0];
      step.Text = text;
      step.Update(() {
        LoadTSteps();
      });
    } else {
      GUI.Current.ShowTextDialog('Chyba', 'Text kroku nesmí být prázdný');
    }
  }

  void RemoveTStep(int id) {
    List<TStep> stepsArray = TSteps.where((TStep item) {
      return item.Id == id;
    });
    var step = stepsArray[0];
    step.Remove(() {
      LoadTSteps();
    });
  }
}
