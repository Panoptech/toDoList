import "./App.css";
import ListBody from "./components/ListBody";
import HeaderContent from "./components/HeaderContent";
import NewListItemInput from "./components/NewListItemInput.js";
import { useState, useRef, useEffect } from "react";
import SortList from "./components/SortList.js";
import FilterList from "./components/FilterList.js";
import DeleteCompleted from "./components/DeleteCompleted";
import SelectAll from "./components/SelectAll";

function App() {
  const initialListItemsState = JSON.parse(localStorage.getItem("listItems")) || [];
  const [listItems, listItemsNew] = useState(initialListItemsState);
  const [itemInput, setItemInput] = useState("");
  const [listFilter, listFilterSet] = useState(listItems.filter((a) => a.item.includes(itemInput)));
  const [sortSelect, sortSelected] = useState("Newest");
  const filterRef = useRef();
  const sortRef = useRef();
  const selectAllBoxRef = useRef();
  useEffect(() => handleFilter(listItems), [itemInput]);
  useEffect(() => handleSort(), [sortSelect, listItems]);

  // ^^added  this list items to this recently if there is a bug
  //~~~~~~~~~~~~~~~Testing logs for debugging
  // useEffect(() => console.log('list Items changed'), [listItems])
  // useEffect(() => console.log(listItems), [listItems])
  // useEffect(() => console.log('itemInput changed'), [itemInput])
  // useEffect(() => console.log(itemInput), [itemInput])
  // useEffect(() => console.log('list Filter changed'), [listFilter])
  // useEffect(() => console.log(listFilter), [listFilter])
  // useEffect(() => console.log(sortSelect), [sortSelect])

  function selectAll(checked) {
    if (checked) {
      const myList = listItems.map((item) => (!item.checked ? { ...item, checked: true } : item));
      setAndSaveStates(myList);
    } else if (!checked) {
      const myList = listItems.map((item) => (item.checked == true ? { ...item, checked: false } : item));
      setAndSaveStates(myList);
    }
  }

  function deleteAll() {
    const myList = listItems.filter((a) => a.checked == false);
    const deleted = listItems.filter((a) => a.checked == true);
    localStorage.setItem("lastDeleteAll", JSON.stringify(deleted));
    localStorage.setItem("listItems", JSON.stringify(myList));
    handleFilter(myList);
    setAndSaveStates(myList);
  }
  function undoDeleteAll() {
    const undone = JSON.parse(localStorage.getItem("lastDeleteAll"));
    const newList = [...undone, ...listItems];
    setAndSaveStates(newList);
  }

  function handleSort() {
    if (sortRef.current.value == "Alphabetic") {
      const sortAlpha = listItems.sort((a, b) => {
        const aCased = a.item.toUpperCase();
        const bCased = b.item.toUpperCase();
        if (aCased < bCased) {
          return -1;
        }
        if (aCased > bCased) {
          return 1;
        }
        if (aCased == bCased) {
          return 0;
        }
      });
      setAndSaveStates(sortAlpha);
    }

    if (sortRef.current.value == "Newest") {
      const sortNewest = listItems.sort((a, b) => b.id - a.id);
      setAndSaveStates(sortNewest);
    }
    if (sortRef.current.value == "Oldest") {
      const sortNewest = listItems.sort((b, a) => b.id - a.id);
      setAndSaveStates(sortNewest);
    }
  }

  function handleFilter(listItems) {
    if (filterRef.current.value === "Incomplete") {
      listFilterSet(
        listItems.filter((a) => {
          if (a.item.toLowerCase().includes(itemInput) && a.checked === false) {
            return {};
          }
        })
      );
    } else if (filterRef.current.value === "Completed") {
      listFilterSet(
        listItems.filter((a) => {
          if (a.item.toLowerCase().includes(itemInput) && a.checked === true) {
            return {};
          }
        })
      );
    } else if (filterRef.current.value === "All Items") {
      listFilterSet(listItems.filter((a) => a.item.toLowerCase().includes(itemInput.toLowerCase())));
    }
  }

  function setAndSaveStates(myList, callBack) {
    listItemsNew(myList);
    localStorage.setItem("listItems", JSON.stringify(myList));
    handleFilter(myList);

    if (typeof callBack == "function") {
      callBack();
    }
  }

  function handleChecked(id) {
    const myList = listItems.map((li) => (id == li.id ? { ...li, checked: !li.checked } : li));
    setAndSaveStates(myList);
    selectAllBoxRef.current.checked = false;
  }
  function handleDelete(id) {
    const myList = listItems.filter((item) => item.id !== id);
    setAndSaveStates(myList);
  }

  //   // Initial function calls
  // handleSort()

  return (
    <div className="App">
      {useEffect(() => handleSort, [])}
      <HeaderContent />
      <NewListItemInput
        listItems={listItems}
        itemInput={itemInput}
        setItemInput={setItemInput}
        setAndSaveStates={setAndSaveStates}
        handleFilter={handleFilter}
        listItemsNew={listItemsNew}
        handleSort={handleSort}
        sortSelected={sortSelected}
      />
      <div className="settings">
        <FilterList listItems={listItems} filterRef={filterRef} handleFilter={handleFilter} />
        <SortList sortRef={sortRef} sortSelect={sortSelect} sortSelected={sortSelected} handleSort={handleSort} />
        <DeleteCompleted deleteAll={deleteAll} buttonText={"Delete All Checked"} buttonFunction={deleteAll} />
        <DeleteCompleted deleteAll={deleteAll} buttonText={"Undo"} buttonFunction={undoDeleteAll} />
      </div>
      <SelectAll selectAll={selectAll} selectAllBoxRef={selectAllBoxRef} />
      <ListBody
        listItems={listItems}
        listFilter={listFilter}
        handleChecked={handleChecked}
        handleDelete={handleDelete}
      />
      <br />
    </div>
  );
}

export default App;
