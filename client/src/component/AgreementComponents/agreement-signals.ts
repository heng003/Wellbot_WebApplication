import { signal } from "@preact/signals";

export const formValues = signal({
  day: "",
  month: "",
  year: "",
  lessorName: "",
  lessorIc: "",
  lesseeName: "",
  lesseIc: "",
  address: "",
  effectiveDate: "",
  expireDate: "",
  rentRmWord: "",
  rentRmNum: "",
  advanceDay: "",
  depositRmWord: "",
  depositRmNum: "",
  lessorAdd: "",
  lessorTel: "",
  lessorFax: "",
  lesseeAdd: "",
  lesseeTel: "",
  lesseeFax: "",
});

export const signalDate = signal(new Date());
