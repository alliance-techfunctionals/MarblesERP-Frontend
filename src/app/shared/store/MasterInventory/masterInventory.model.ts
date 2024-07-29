export interface MasterInventoryModel {
    id: number,
    qualityId: number,
    designId: number,
    isDeleted: boolean,
    createdOn: Date,
  }

//   interface InventoryDetailModel {
//     masterId: number;
//     colorCode: string;
//     size: string;
//     quantity: number;
//     fileKey: string | null;
//     name: string | null;
//     id: number;
//     createdOn: Date;
//     modifiedOn: Date;
//     createdBy: string;
//     modifiedBy: string;
//     isDeleted: boolean;
//   }
  
  
//   export function createInventoryDetailModel({
//     masterId = 0,
//     colorCode = '',
//     size = '',
//     quantity = 0,
//     fileKey = '',
//     id = 0,
//     createdOn = new Date(),
//     modifiedOn = new Date(),
//     createdBy = '',
//     modifiedBy = '',
//     isDeleted = false,
//   }: Partial<InventoryDetailModel>) {
//     return {
//       masterId,
//       id,
//       colorCode,
//       size,
//       quantity,
//       fileKey,
//       createdOn,
//       modifiedOn,
//       createdBy,
//       modifiedBy,
//       isDeleted
//     } as InventoryDetailModel;
//   }