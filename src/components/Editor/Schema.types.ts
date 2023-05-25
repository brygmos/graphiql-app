export type SchemaServerResponse = {
  data: {
    __schema: {
      types: Type[];
    };
  };
};
export type Props = {
  data: SchemaServerResponse;
};
export type Query = {
  name: string;
  description: string;
  args: ArgObj[];
};
export type ArgObj = {
  name: string;
  description: string;
  type: ArgTypeObj;
};
export type ArgTypeObj = {
  name: string | null;
  kind: string | [];
  ofType: ArgNameTypeObj;
};
export type ArgNameTypeObj = {
  name: string | null;
  kind: string | null | [];
  ofType: ArgNameTypeObj;
};
export type Type = {
  name: string;
  description: string;
  kind: string | [];
  fields: Field[];
  inputFields: inputField[];
  // inputFields: inputField;
  type: inputField;
};
export type Field = {
  name: string;
  description: string;
  args: ArgObj[];
};
export type inputField = {
  name: string;
  type: {
    kind: string;
    name: string;
    ofType: string;
  };
};

export type DataType =
  | string
  | ArgObj
  | Type
  | Type[]
  | ArgNameTypeObj
  | Field
  | Field[]
  | inputField
  | inputField[];

export type DataVariant =
  | 'string'
  | 'query'
  | 'queryArr'
  | 'argObj'
  | 'type'
  | 'typeByString'
  | 'typeArr'
  | 'ArgNameTypeObj'
  | 'field'
  | 'fieldArr'
  | 'inputField'
  | 'inputFieldArr';
