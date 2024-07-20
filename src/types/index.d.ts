export interface NameDescription {
  name: string;
  description: string;
}

export interface DinoDocsComment {
  title: NameDescription | null;
  body: NameDescription[] | [];
}

export interface DinoDocsCommentTitle {
  method: string;
  path: string;
  description: string;
}

export interface DinoDocsCommentBody {
  key: string;
  type: string;
  optional: boolean;
  description?: string;
  constraints?: Constraints;
}

export interface Ranged {
  min?: number;
  max?: number;
}

export interface Constraints {
  enum?: string[];
  isInt?: { options: Ranged } | boolean;
  matches?: RegExp;
  isLength?: { options: Ranged };
  isFloat?: { options: Ranged } | boolean;
  isEmail?: boolean;
  isURL?: boolean;
  isBoolean?: boolean;
  contains?: any;
  equals?: any;
  isAfter?: string;
  isBefore?: string;
  isIn?: any;
  isCreditCard?: boolean;
  isDate?: boolean;
  isAlpha?: boolean;
  isAlphanumeric?: boolean;
  isAscii?: boolean;
  isBase64?: boolean;
  isDataURI?: boolean;
  isEmpty?: boolean;
  isHexColor?: boolean;
  isIP?: boolean;
  isISBN?: boolean;
  isMACAddress?: boolean;
  isUUID?: boolean;
  isLowercase?: boolean;
  isUppercase?: boolean;
}

export interface Fossils extends DinoDocsCommentTitle {
  body?: DinoDocsCommentBody[];
  query?: DinoDocsCommentBody[];
  params?: DinoDocsCommentBody[];
}
