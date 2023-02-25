import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates,arrayMove } from "@dnd-kit/sortable";
import Droppable from "./components/Drop";
import Item from "./components/Item";

import "./App.css";

function App() {
  const [tableElement, setTableElement] = useState({
    planning: ['Planning','i need to do this','and also this','and then do this'],
    toDo: ['To Do','on going thing 1','on going thing 2','on going thing 3'],
    inProgress: ['InProgress','im doing this','and this','also this'],
    completed: ['Completed','project 1',' project 2','project 3'],
  });
  const [activeId, setActiveId] = useState(null);
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
  );

  // const handleDragStart = ({ active }) => setActiveId(active.id);
  function handleDragStart({active}){
    setActiveId(active.id);
  }

  function handleDragCancel(){
    setActiveId(null);
  }
  //when a draggable item is moved over a droppable container, along with the unique identifier of that droppable container.
  function handleDragOver ({active, over}){
    const overId = over?.id;

    if (!overId) {
      setActiveId(null);
    }
    //the table you drag
    const dragtable = active.data.current.sortable.containerId;

    //the table you try to drag to
    const newtable = over.data.current?.sortable.containerId || over.id;

    //if they are not the same table
    if (dragtable !== newtable) {
      setTableElement((tableElement) => {
        console.log(active);
        const activeIndex = active.data.current.sortable.index;


        const newtableIndex = over.id in tableElement ? tableElement[newtable].length + 1 : over.data.current.sortable.index;

        return dragtoAnotherTable(
          tableElement,
          dragtable,
          activeIndex,
          newtable,
          newtableIndex,
          active.id
        );
      });
    }
  }
  //after a draggable item is dropped. 
  function handleDragEnd({active,over}){
    if (!over) {
      setActiveId(null);
    }

    if (active.id !== over.id) {
      const dragtable = active.data.current.sortable.containerId;
      const newtable = over.data.current?.sortable.containerId || over.id;
      const activeIndex = active.data.current.sortable.index;
      const newtableIndex = over.id in tableElement ? tableElement[newtable].length + 1 : over.data.current.sortable.index;
      setTableElement((tableElement) => {
        let newItems;
        if (dragtable === newtable) {
          console.log(tableElement[newtable]);

          newItems = {
            ...tableElement,
            [newtable]: arrayMove(
              tableElement[newtable],
              activeIndex,
              newtableIndex
            ),
          };
        } else {
          newItems = dragtoAnotherTable(
            tableElement,
            dragtable,
            activeIndex,
            newtable,
            newtableIndex,
            active.id
          );
        }

        return newItems;
      });
    }

    setActiveId(null);
  }

  
  const dragtoAnotherTable = (items,activeContainer,activeIndex,overContainer,newtableIndex,item) => {
    //if the case is moving one element from one table to another we need to delete it from the old table and add it on new table
    return {...items, [activeContainer]: [...items[activeContainer].slice(0, activeIndex), ...items[activeContainer].slice(activeIndex + 1)], [overContainer]: [...items[overContainer].slice(0, newtableIndex), item, ...items[overContainer].slice(newtableIndex)]};
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragOver={handleDragOver} onDragEnd={handleDragEnd} className="whole">
      <h1 className="projectname">Stellar Culinary Personnel LTD Project</h1>
      <div className="container">
        {Object.keys(tableElement).map((item) => (
          
          <Droppable
            id={item}
            items={tableElement[item]}
            activeId={activeId}
            key={item}
          />
        ))}
      </div>

    </DndContext>
  );
}

export default App;



