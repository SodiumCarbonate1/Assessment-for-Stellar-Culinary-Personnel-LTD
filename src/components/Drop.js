import SortableItem from "./SortableItem";
import { rectSortingStrategy, SortableContext,verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

import "./Drop.css";

  const Droppable = ({ id, items }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
      <ul className="droppable" ref={setNodeRef}>
        <div className={items[0].toLowerCase().replace(' ','')}><p>{items[0].toUpperCase()}</p></div>
        {items.slice(1).map((item) => (
          <SortableItem key={item} id={item} />
        ))}
      </ul>
    </SortableContext>
  );
};

export default Droppable;
