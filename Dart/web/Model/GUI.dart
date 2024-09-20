import 'dart:html';
import 'Database.dart';
import 'Settings.dart';
import 'State.dart';
import 'TList.dart';
import 'TStep.dart';
import 'Todo.dart';

enum eSidebarState { Opened, Closed }

enum eDialogContent { Text, Settings, TListSettings }

class GUI {
  static final GUI Current = GUI._gui();

  factory GUI() {
    return Current;
  }

  GUI._gui();

  bool SearchView = false;
  eSidebarState LeftSidebarStatus = eSidebarState.Closed;
  eSidebarState RightSidebarStatus = eSidebarState.Closed;
  eDialogContent DialogContent = eDialogContent.Text;

  void Initialize() {
    SetColorMode();
    baseInitialize();
  }

  void baseInitialize() {
    querySelector('#btnHideLeftSidebar').onClick.listen((e) {
      ToggleLeftSidebar();
    });
    querySelector('#btnLeftSidebarSettings').onClick.listen((e) {
      ShowSettingsDialog();
    });
    querySelector('#fileLeftSidebarImport').onChange.listen((e) {
      State.Current.ImportData(e.target);
    });
    querySelector('#btnLeftSidebarExport').onClick.listen((e) {
      State.Current.ExportData();
    });
    querySelector('#btnLeftSidebarSearch').onClick.listen((e) {
      State.Current.ShowSearchView();
    });
    querySelector('#txtNewTListText').onKeyUp.listen((e) {
      State.Current.AddNewTListTextKeyUp(e);
    });
    querySelector('#btnAddNewTList').onClick.listen((e) {
      State.Current.AddNewTList();
    });

    if (LeftSidebarStatus == eSidebarState.Closed) {
      querySelector('#LeftSidebar').classes.add('is-hidden');
    }
    if (RightSidebarStatus == eSidebarState.Closed) {
      querySelector('#RightSidebar').classes.add('is-hidden');
    }

    querySelector('#txtRightSidebarTodoText').onChange.listen((e) {
      State.Current.TodoTextChanged(e.target);
    });
    querySelector('#btnAddNewTStep').onClick.listen((e) {
      State.Current.AddTStep();
    });
    querySelector('#txtNewTStepText').onKeyUp.listen((e) {
      State.Current.AddNewTStepTextKeyUp(e);
    });
    querySelector('#dtpRightSidebarTodoEndDate').onChange.listen((e) {
      State.Current.TodoEndDateChanged(e.target);
    });
    querySelector('#txaRightSidebarTodoNote').onChange.listen((e) {
      State.Current.TodoNoteChanged(e.target);
    });
    querySelector('#btnHideRightSidebar').onClick.listen((e) {
      State.Current.HideRightSidebar();
    });
    querySelector('#btnDeleteTodo').onClick.listen((e) {
      State.Current.RemoveTodo();
    });
    querySelector('#btnToggleLeftSidebar').onClick.listen((e) {
      ToggleLeftSidebar();
    });
    querySelector('#txtHeaderTListName').onChange.listen((e) {
      State.Current.TListNameChange(e.target);
    });
    querySelector('#btnDeleteTList').onClick.listen((e) {
      State.Current.RemoveTList();
    });
    querySelector('#btnSettingsTList').onClick.listen((e) {
      ShowTListSettingsDialog();
    });
    querySelector('#txtSearchText').onInput.listen((e) {
      State.Current.Search();
    });
    querySelector('#Main').onClick.listen((e) {
      OutsideClick();
    });
    querySelector('#Main').onResize.listen((e) {
      GetContentCoverStyle();
    });
    querySelector('#btnAddNewTodo').onClick.listen((e) {
      State.Current.AddTodo();
    });
    querySelector('#txtNewTodoText').onKeyUp.listen((e) {
      State.Current.AddNewTodoTextKeyUp(e);
    });
    querySelector('#btnHideDialog').onClick.listen((e) {
      HideDialog();
    });
    querySelector('#slbIcon').onChange.listen((e) {
      State.Current.TListIconChange(e.target);
    });
    querySelector('#slbOrderTodo').onChange.listen((e) {
      State.Current.TListOrderTodoChange(e.target);
    });
    querySelector('#chbDarkMode').onChange.listen((e) {
      State.Current.SetColorMode(e.target);
    });
    HideSearchView();
    querySelector('#chbRightSidebarTodoDone').onClick.listen((e) {
      State.Current.TodoDoneChanged(State.Current.CurrentTodo.Id);
    });
    querySelector('#btnRightSidebarTodoImportant').onClick.listen((e) {
      State.Current.TodoImportantChanged(State.Current.CurrentTodo.Id);
    });
  }

  void DrawTLists() {
    querySelector('#NavigationBaseTLists').children.clear();
    querySelector('#NavigationUserTLists').children.clear();
    CreateTList(
        State.Current.TodayTodos, 'lstTodayTodos', 'NavigationBaseTLists');
    CreateTList(State.Current.ImportantTodos, 'lstImportantTodos',
        'NavigationBaseTLists');
    CreateTList(
        State.Current.PlannedTodos, 'lstPlannedTodos', 'NavigationBaseTLists');
    CreateTList(State.Current.UndividedTodos, 'lstUndividedTodos',
        'NavigationBaseTLists');

    for (var item in State.Current.TLists) {
      CreateTList(item, 'lstItem${item.Id}', 'NavigationUserTLists');
    }
  }

  void CreateTList(TList tList, String lstId, String container, String result) {
    var li = LIElement()
      ..id = lstId
      ..onClick.listen((e) {
        State.Current.SwitchTList(tList);
      })
      ..classes.add('LeftSidebar-item');
    if (State.Current.CurrentTList == tList) {
      li.classes.add('is-selected');
    }
    var spanIcon = SpanElement()
      ..className = 'LeftSidebar-itemIcon ' + tList.Icon;
    li.children.add(spanIcon);
    var spanText = SpanElement()
      ..classes.add('LeftSidebar-itemText')
      ..text = tList.Name;
    li.children.add(spanText);
    var spanCount = SpanElement()
      ..classes.add('LeftSidebar-itemCount')
      ..text = result;
    li.children.add(spanCount);
    querySelector('#${container}').children.add(li);
  }

  void SetRightSidebar() {
    (querySelector('#chbRightSidebarTodoDone') as InputElement).checked =
        State.Current.CurrentTodo.Done;
    (querySelector('#txtRightSidebarTodoText') as InputElement).value =
        State.Current.CurrentTodo.Text;
    SetRightSidebarTodoImportant(State.Current.CurrentTodo.Important);
    (querySelector('#dtpRightSidebarTodoEndDate') as InputElement).value =
        State.Current.CurrentTodo.EndDate != DateMaxValue
            ? '${State.Current.CurrentTodo.EndDate}'
            : ' ';
    (querySelector('#txaRightSidebarTodoNote') as InputElement).value =
        State.Current.CurrentTodo.Note;

    querySelector('#lblRightSidebarTodoCreateDate').text =
        State.Current.CurrentTodo.CreateDate;
  }

  void DrawMain() {
    querySelector('#TodoDividerContainer').children.clear();
    if (SearchView) {
      CreateTodoDivider('dvcSearched', 'Vyhledáno', true,
          State.Current.UnfinishedTodos, true);
    } else {
      CreateTodoDivider(
          'dvcUnfinished',
          'Nedokončeno',
          State.Current.CurrentTList.UnfinishedOpened,
          State.Current.UnfinishedTodos,
          true);
      CreateTodoDivider(
          'dvcFinished',
          'Dokončeno',
          State.Current.CurrentTList.FinishedOpened,
          State.Current.FinishedTodos,
          false);
    }
  }

  void CreateTodoDivider(String id, String text, bool opened, List<Todo> todos,
      bool unfinishedButton) {
    var dividerContainerId = '${id}TodoContainer';
    var divDivider = DivElement();
    divDivider.id = id;
    divDivider.onClick.listen((event) {
      State.Current.TodoDividerClick(unfinishedButton);
    });
    divDivider.classes.add('TaskDivider');
    var spanBtn = SpanElement();
    if (opened) {
      spanBtn.classes.add('bi bi-chevron-down');
    } else {
      spanBtn.classes.add('bi bi-chevron-right');
    }
    divDivider.children.add(spanBtn);
    var spanText = SpanElement();
    spanText.text = text;
    divDivider.children.add(spanText);
    var spanCount = SpanElement();
    spanCount.text =
        (todos != null && todos.isNotEmpty) ? todos.length.toString() : ' ';
    divDivider.children.add(spanCount);
    var divContainer = DivElement();
    divContainer.id = dividerContainerId;
    querySelector('#TodoDividerContainer').children.add(divDivider);
    querySelector('#TodoDividerContainer').children.add(divContainer);

    if (todos != null && opened) {
      for (var todo in todos) {
        CreateTodo(todo, dividerContainerId);
      }
    }
  }

  void CreateTodo(Todo todo, String container) {
    var divBlock = DivElement();
    divBlock.classes.add('TaskBlock');
    if (State.Current.CurrentTodo == todo) {
      divBlock.classes.add('is-selected');
    }

    var divCheck = DivElement();
    divCheck.classes.add('TaskBlock-check');
    divBlock.children.add(divCheck);

    var divCheckContainer = DivElement();
    divCheckContainer.classes.add('CheckboxContainer');
    divCheck.children.add(divCheckContainer);

    var divRound = DivElement();
    divRound.classes.add('Round');
    divCheckContainer.children.add(divRound);

    var inputDone = InputElement();
    inputDone.id = '#chbTaskDone${todo.Id}';
    inputDone.onClick.listen((event) {
      State.Current.TodoDoneChanged(todo.Id);
    });
    if (todo.Done) {
      inputDone.classes.add('checked');
    }
    inputDone.type = 'checkbox';
    divRound.children.add(inputDone);

    var labelDone = LabelElement();
    labelDone.htmlFor = '#chbTaskDone${todo.Id}';
    divRound.children.add(labelDone);

    var spanText = SpanElement();
    spanText.id = 'lblTaskText${todo.Id}';
    spanText.classes.add('TaskBlock-text');
    spanText.onClick.listen((event) {
      State.Current.TodoSelected(todo.Id);
    });
    spanText.text = todo.Text;
    divBlock.children.add(spanText);

    var spanImportant = SpanElement();
    spanImportant.id = 'lblTaskImportant${todo.Id}';
    spanImportant.classes.add('TaskBlock-important');
    if (todo.Important) {
      spanImportant.classes.add('is-checked');
    }
    spanImportant.onClick.listen((event) {
      State.Current.TodoImportantChanged(todo.Id);
    });
    divBlock.children.add(spanImportant);

    var spanIcon = SpanElement();
    spanIcon.classes.add('TaskBlock-importantIcon');
    spanIcon.classes.add('bi-star-fill');
    spanImportant.children.add(spanIcon);

    querySelector('#${container}').children.add(divBlock);
  }

  void DrawTSteps() {
    querySelector('#TStepContainer').children.clear();
    for (var step in State.Current.TSteps) {
      CreateTStep(step);
    }
  }

  void CreateTStep(TStep step) {
    var divStep = DivElement();
    divStep.classes.add('RightSidebar-step');

    var divCheck = DivElement();
    divCheck.classes.add('RightSidebar-taskCheck');
    divStep.children.add(divCheck);

    var divCheckContainer = DivElement();
    divCheckContainer.classes.add('CheckboxContainer');
    divCheck.children.add(divCheckContainer);

    var divRound = DivElement();
    divRound.classes.add('Round');
    divCheckContainer.children.add(divRound);

    var inputDone = InputElement();
    inputDone.id = '#chbStepDone${step.Id}';
    inputDone.onClick.listen((event) {
      State.Current.TStepCheckedChanged(step.Id);
    });
    if (step.Done) {
      inputDone.classes.add('checked');
    }
    inputDone.type = 'checkbox';
    divRound.children.add(inputDone);

    var labelDone = LabelElement();
    labelDone.htmlFor = '#chbStepDone${step.Id}';
    divRound.children.add(labelDone);

    var spanTextbox = SpanElement();
    spanTextbox.classes.add('RightSidebar-taskText');
    spanTextbox.classes.add('TextBox');
    divStep.children.add(spanTextbox);

    var inputText = InputElement();
    inputText.id = 'txtStepText${step.Id}';
    inputText.classes.add('TextBox-input');
    inputText.onChange.listen((e) {
      State.Current.TStepTextChanged(e.target, step.Id);
    });
    inputText.value = step.Text;
    inputText.type = 'text';
    spanTextbox.children.add(inputText);

    var btnImportant = ButtonElement()
      ..id = 'btnStepImportant${step.Id}'
      ..onClick.listen((event) {
        State.Current.RemoveTStep(step.Id);
      })
      ..classes.add('Button')
      ..classes.add('RightSidebar-taskDelete')
      ..title = 'Smazat krok';
    divStep.children.add(btnImportant);

    var spanIcon = SpanElement();
    spanIcon.classes.add('bi bi-trash');
    btnImportant.children.add(spanIcon);

    querySelector('#TStepContainer').children.add(divStep);
  }

  void SetHeader() {
    querySelector('#lblHeaderTListIcon').classes.clear();
    querySelector('#lblHeaderTListIcon')
        .classes
        .add(State.Current.CurrentTList.Icon);
    if (SearchView) {
      ShowSearchView();
    } else {
      HideSearchView();
    }
    (querySelector('#txtHeaderTListName') as InputElement).readOnly =
        State.Current.CurrentTList.Id == UndividedTListId;
    (querySelector('#txtHeaderTListName') as InputElement).value =
        State.Current.CurrentTList.Name;
    if (State.Current.CurrentTList.Id != UndividedTListId) {
      querySelector('#TListControls').classes.remove('u-d-none');
    } else {
      querySelector('#TListControls').classes.add('u-d-none');
    }
    (querySelector('#txtSearchText') as InputElement).value = '';
  }

  void SetColorMode() {
    if (Settings.Current.GetDarkMode() == 'true') {
      if (querySelector('#Page').classes.contains('LightMode')) {
        querySelector('#Page').classes.remove('LightMode');
      }
      querySelector('#Page').classes.add('DarkMode');
    } else {
      if (querySelector('#Page').classes.contains('DarkMode')) {
        querySelector('#Page').classes.remove('DarkMode');
      }
      querySelector('#Page').classes.add('LightMode');
    }
  }

  void GetContentCoverStyle() {
    if (IsSmallScreen() &&
        (LeftSidebarStatus == eSidebarState.Opened ||
            RightSidebarStatus == eSidebarState.Opened)) {
      querySelector('#MainCover').classes.add('Main-coverContent');
    } else {
      querySelector('#MainCover').classes.remove('Main-coverContent');
    }
  }

  void SetRightSidebarTodoImportant(todo) {
    if (todo.Important) {
      querySelector('#btnRightSidebarTodoImportant').classes.add('is-checked');
    } else {
      querySelector('#btnRightSidebarTodoImportant')
          .classes
          .remove('is-checked');
    }
  }

  void OutsideClick() {
    if (IsSmallScreen()) {
      querySelector('#LeftSidebar').classes.add('is-hidden');
      LeftSidebarStatus = eSidebarState.Closed;
      GetContentCoverStyle();
    }
  }

  void ToggleLeftSidebar() {
    LeftSidebarStatus = ToggleSidebar(LeftSidebarStatus, '#LeftSidebar');
    GetContentCoverStyle();
  }

  void ToggleRightSidebar() {
    RightSidebarStatus = ToggleSidebar(RightSidebarStatus, '#RightSidebar');
    GetContentCoverStyle();
  }

  eSidebarState ToggleSidebar(eSidebarState sidebarStatus, String id) {
    switch (sidebarStatus) {
      case eSidebarState.Closed:
        querySelector(id).classes.remove('is-hidden');
        return eSidebarState.Opened;
      default:
        querySelector(id).classes.add('is-hidden');
        return eSidebarState.Closed;
    }
  }

  bool IsSmallScreen() {
    return querySelector('#Page').clientWidth < 992;
  }

  /*void DownloadFile(String fileBase64) {
        fetch('data:application/json;base64,${fileBase64}')
            .then(response => response.blob())
            .then(blob => {
                let link = window.document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'TodoExport.json';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    }*/

  void ShowSearchView() {
    querySelector('#lblHeaderTListIcon').classes.add('u-d-none');
    querySelector('#lblHeaderTListIcon').classes.add('u-d-none');
    querySelector('#txtHeaderTListName').classes.add('u-d-none');
    querySelector('#TListControls').classes.add('u-d-none');
    querySelector('#SearchViewEditor').classes.remove('u-d-none');
    querySelector('#AddTodoContainer').classes.add('u-d-none');
    (querySelector('#txtSearchText') as InputElement).value = '';
    SearchView = true;
  }

  void HideSearchView() {
    querySelector('#lblHeaderTListIcon').classes.remove('u-d-none');
    querySelector('#lblHeaderTListIcon').classes.remove('u-d-none');
    querySelector('#txtHeaderTListName').classes.remove('u-d-none');
    querySelector('#TListControls').classes.remove('u-d-none');
    querySelector('#SearchViewEditor').classes.add('u-d-none');
    querySelector('#AddTodoContainer').classes.remove('u-d-none');
    SearchView = false;
  }

  String GetSearchText() {
    return (querySelector('#txtSearchText') as InputElement).value;
  }

  void ClearNewTListName() {
    (querySelector('#txtNewTListText') as InputElement).value = '';
  }

  String GetNewTListName() {
    return (querySelector('#txtNewTListText') as InputElement).value;
  }

  void ClearNewTodoText() {
    (querySelector('#txtNewTodoText') as InputElement).value = '';
  }

  String GetNewTodoText() {
    return (querySelector('#txtNewTodoText') as InputElement).value;
  }

  void ClearNewTStepText() {
    (querySelector('#txtNewTStepText') as InputElement).value = '';
  }

  String GetNewTStepText() {
    return (querySelector('#txtNewTStepText') as InputElement).value;
  }

  void ShowTextDialog(String title, String text) {
    DialogContent = eDialogContent.Text;
    querySelector('#lblDialogHead').text = title;
    querySelector('#DialogTextContainer').text = text;
    ShowDialog();
  }

  void ShowSettingsDialog() {
    DialogContent = eDialogContent.Settings;
    querySelector('#lblDialogHead').text = 'Nastavení';
    ShowDialog();
  }

  void ShowTListSettingsDialog() {
    DialogContent = eDialogContent.TListSettings;
    querySelector('#lblDialogHead').text =
        'Nastavení seznamu: ' + State.Current.CurrentTList.Name;
    ShowDialog();
  }

  void ShowDialog() {
    switch (DialogContent) {
      case eDialogContent.Settings:
        querySelector('#DialogTextContainer').classes.add('u-d-none');
        querySelector('#DialogSettingsContainer').classes.remove('u-d-none');
        querySelector('#DialogTListSettingsContainer').classes.add('u-d-none');
        (querySelector('#chbDarkMode') as InputElement).checked =
            Settings.Current.GetDarkMode() == 'true';
        break;
      case eDialogContent.TListSettings:
        querySelector('#DialogTextContainer').classes.add('u-d-none');
        querySelector('#DialogSettingsContainer').classes.add('u-d-none');
        querySelector('#DialogTListSettingsContainer')
            .classes
            .remove('u-d-none');
        (querySelector('#slbOrderTodo') as InputElement).value =
            State.Current.CurrentTList.OrderTodo.index.toString();
        (querySelector('#slbIcon') as InputElement).value =
            State.Current.CurrentTList.Icon;
        break;
      default:
        querySelector('#DialogTextContainer').classes.remove('u-d-none');
        querySelector('#DialogSettingsContainer').classes.add('u-d-none');
        querySelector('#DialogTListSettingsContainer').classes.add('u-d-none');
        break;
    }
    querySelector('#Dialog').classes.add('is-showed');
  }

  void HideDialog() {
    querySelector('#Dialog').classes.remove('is-showed');
  }
}
