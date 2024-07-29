// export interface Customer {
//   id: number;
//   roleId: number;
//   userRole: string;
//   mobileNumber: string;
//   password: string;
//   gender: string;
//   emailAddress: string;
//   city: string;
//   pinCode: string;
//   state: string;
//   country: string;
//   residentialAddress: string;
//   name: string;
//   createdOn: Date;
//   isDeleted: boolean;
// }

// export function createCustomerModel({
//   id = 0,
//   roleId = 0,
//   userRole = '',
//   mobileNumber = '',
//   password = '',
//   gender = '',
//   emailAddress = '',
//   city = '',
//   pinCode = '',
//   state = '',
//   country = '',
//   residentialAddress = '',
//   name = '',
//   createdOn = new Date(),
//   isDeleted = false,
// }: Partial<Customer>) {
//   return {
//     id,
//     roleId,
//     userRole,
//     mobileNumber,
//     password,
//     gender,
//     emailAddress,
//     city,
//     pinCode,
//     state,
//     country,
//     residentialAddress,
//     name,
//     createdOn,
//     isDeleted,
//   } as Customer;
// }
