import { Constraints } from "../types";

export const parseConstraints = (rawConstraints: string) => {
    const constraints: Constraints = {};
  
    if (!rawConstraints) return constraints;
  
    const constraintMap: { [key: string]: any } = {
      enum: (value: any) => {
        constraints.enum = value.split("|");
      },
      range: (value: any) => {
        const [min, max] = value.split("-").map(Number);
        constraints.isInt = { options: { min, max } };
      },
      regex: (value: any) => {
        constraints.matches = new RegExp(value);
      },
      minlen: (value: any) => {
        constraints.isLength = { options: { min: +value } };
      },
      maxlen: (value: any) => {
        constraints.isLength = { options: { max: +value } };
      },
      min: (value: any) => {
        constraints.isFloat = { options: { min: +value } };
      },
      max: (value: any) => {
        constraints.isFloat = { options: { max: +value } };
      },
      email: () => {
        constraints.isEmail = true;
      },
      url: () => {
        constraints.isURL = true;
      },
      int: () => {
        constraints.isInt = true;
      },
      float: () => {
        constraints.isFloat = true;
      },
      bool: () => {
        constraints.isBoolean = true;
      },
      contains: (value: any) => {
        constraints.contains = value;
      },
      equals: (value: any) => {
        constraints.equals = value;
      },
      afterdate: (value: any) => {
        constraints.isAfter = value;
      },
      beforedate: (value: any) => {
        constraints.isBefore = value;
      },
      isIn: (value: any) => {
        constraints.isIn = value.split("|");
      },
      creditcard: () => {
        constraints.isCreditCard = true;
      },
      date: () => {
        constraints.isDate = true;
      },
      alpha: () => {
        constraints.isAlpha = true;
      },
      alnum: () => {
        constraints.isAlphanumeric = true;
      },
      ascii: () => {
        constraints.isAscii = true;
      },
      base64: () => {
        constraints.isBase64 = true;
      },
      datauri: () => {
        constraints.isDataURI = true;
      },
      empty: () => {
        constraints.isEmpty = true;
      },
      hex: () => {
        constraints.isHexColor = true;
      },
      ip: () => {
        constraints.isIP = true;
      },
      isbn: () => {
        constraints.isISBN = true;
      },
      mac: () => {
        constraints.isMACAddress = true;
      },
      uuid: () => {
        constraints.isUUID = true;
      },
      ucase: () => {
        constraints.isLowercase = true;
      },
      lcase: () => {
        constraints.isUppercase = true;
      },
    };
  
    rawConstraints
      .replace(/[()]/g, "")
      .split(",")
      .forEach((constraint) => {
        const [key, value] = constraint.split("=");
        const trimmedKey = key.trim();
        const trimmedValue = value?.trim();
        if (constraintMap[trimmedKey]) {
          constraintMap[trimmedKey](trimmedValue);
        }
      });
  
    return constraints;
  };