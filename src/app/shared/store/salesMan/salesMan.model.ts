// export interface SalesMan {
//   roleId: number;
//   mobileNumber: string;
//   gender: string;
//   city: string;
//   country: string;
//   residentialAddress: string;
//   id: number;
//   name: string;
//   createdOn: Date;
//   isDeleted: boolean;
// }

// export function createSalesManModel({
//   roleId = 0,
//   mobileNumber = '',
//   gender = '',
//   city = '',
//   country = '',
//   residentialAddress = '',
//   id = 0,
//   name = '',
//   createdOn = new Date(),
//   isDeleted = false,
// }: Partial<SalesMan>) {
//   return {
//     roleId,
//     mobileNumber,
//     gender,
//     city,
//     country,
//     residentialAddress,
//     id,
//     name,
//     createdOn,
//     isDeleted
//   } as SalesMan;
// }