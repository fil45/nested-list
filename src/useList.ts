import { useReducer } from "react";
import { Item, Action, State } from "./types";
import { v4 as uuidv4 } from "uuid";

function createNewStateWithRecursivelyAddedItem(
  array: Item[],
  newName: string,
  parentId: string | null
): Item[] {
  if (!parentId) {
    return [...array, { id: uuidv4(), name: newName }];
  }
  const recursivelyAddItem = (_array: Item[]) => {
    return _array.reduce((arr: Item[], item: Item) => {
      const { id, name, children } = item;
      let newChildren;
      if (children) {
        newChildren = recursivelyAddItem(children);
      }
      if (id === parentId) {
        arr.push({
          id,
          name,
          children: [...(newChildren || []), { id: uuidv4(), name: newName }]
        });
      } else {
        arr.push({
          id,
          name,
          children: newChildren
        });
      }
      return arr;
    }, []);
  };
  return recursivelyAddItem(array);
}

function createNewStateWithRecursivelyRemovedId(
  array: Item[],
  idToRemove: string
): Item[] {
  return array.reduce((arr: Item[], item: Item) => {
    const { id, name, children } = item;
    let newChildren;
    if (children) {
      newChildren = createNewStateWithRecursivelyRemovedId(
        children,
        idToRemove
      );
    }
    if (id !== idToRemove) {
      arr.push({
        id,
        name,
        children: newChildren
      });
    }
    return arr;
  }, []);
}

function createNewStateWithRecursivelyMovedUpId(
  array: Item[],
  idToMoveUp: string
): Item[] {
  return array.reduce((arr: Item[], item: Item, index: number) => {
    const { id, name, children } = item;
    let newChildren;
    if (children) {
      newChildren = createNewStateWithRecursivelyMovedUpId(
        children,
        idToMoveUp
      );
    }
    if (id === idToMoveUp) {
      arr.splice(index - 1, 0, {
        id,
        name,
        children: newChildren
      });
    } else {
      arr.push({
        id,
        name,
        children: newChildren
      });
    }
    return arr;
  }, []);
}

function createNewStateWithRecursivelyMovedDownId(
  array: Item[],
  idToMoveDown: string
): Item[] {
  let itemToMoveDown: Item | undefined;
  return array.reduce((arr: Item[], item: Item, index: number) => {
    const { id, name, children } = item;
    let newChildren;
    if (children) {
      newChildren = createNewStateWithRecursivelyMovedDownId(
        children,
        idToMoveDown
      );
    }

    if (itemToMoveDown) {
      arr.push({
        id,
        name,
        children: newChildren
      });
      arr.push({ ...itemToMoveDown });
      itemToMoveDown = undefined;
    } else if (id === idToMoveDown) {
      itemToMoveDown = {
        id,
        name,
        children: newChildren
      };
    } else {
      arr.push({
        id,
        name,
        children: newChildren
      });
    }
    return arr;
  }, []);
}

function createNewStateWithRecursivelyAddedSublistToId(
  array: Item[],
  idToAddSublistTo: string
): Item[] {
  return array.reduce((arr: Item[], item: Item) => {
    const { id, name, children } = item;
    let newChildren;
    if (children) {
      newChildren = createNewStateWithRecursivelyAddedSublistToId(
        children,
        idToAddSublistTo
      );
    }
    if (id === idToAddSublistTo) {
      arr.push({
        id,
        name,
        children: []
      });
    } else {
      arr.push({
        id,
        name,
        children: newChildren
      });
    }
    return arr;
  }, []);
}

function createNewStateWithRecursivelyRemovedSublistFromId(
  array: Item[],
  idToRemoveSublistFrom: string
): Item[] {
  return array.reduce((arr: Item[], item: Item) => {
    const { id, name, children } = item;
    let newChildren;
    if (children) {
      newChildren = createNewStateWithRecursivelyRemovedSublistFromId(
        children,
        idToRemoveSublistFrom
      );
    }
    if (id === idToRemoveSublistFrom) {
      arr.push({
        id,
        name
      });
    } else {
      arr.push({
        id,
        name,
        children: newChildren
      });
    }
    return arr;
  }, []);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "addItem":
      return createNewStateWithRecursivelyAddedItem(
        state,
        action.payload.name,
        action.payload.parentId
      );
    case "removeItem":
      return createNewStateWithRecursivelyRemovedId(state, action.payload.id);
    case "moveDown":
      return createNewStateWithRecursivelyMovedDownId(state, action.payload.id);
    case "moveUp":
      return createNewStateWithRecursivelyMovedUpId(state, action.payload.id);
    case "addSublist":
      return createNewStateWithRecursivelyAddedSublistToId(
        state,
        action.payload.id
      );
    case "removeSublist":
      return createNewStateWithRecursivelyRemovedSublistFromId(
        state,
        action.payload.id
      );
    default:
      throw new Error();
  }
}

type UseListReturn = { state: State; dispatch: React.Dispatch<Action> };

const initialState: State = [];

export default function useList(): UseListReturn {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}
