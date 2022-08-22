export type Item = {
  id: string;
  name: string;
  children?: Item[] | undefined;
};

export type Action =
  | {
      type: "addItem";
      payload: {
        parentId: string | null;
        name: string;
      };
    }
  | { type: "removeItem"; payload: IdPayload }
  | { type: "moveDown"; payload: IdPayload }
  | { type: "moveUp"; payload: IdPayload }
  | { type: "addSublist"; payload: IdPayload }
  | { type: "removeSublist"; payload: IdPayload };

export type IdPayload = {
  id: string;
};

export type State = Item[];
