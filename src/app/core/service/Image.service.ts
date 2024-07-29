import { Injectable } from '@angular/core';

export interface S3BucketImageModel {
    bucketName: string;
    location: string;
    fileName: string;
}

export function createS3BucketImageModel({
    bucketName = 'carpets-inventory',
    location = 'ap-south-1',
    fileName = ''
}: Partial<S3BucketImageModel>) {
    return {
        bucketName,
        location,
        fileName,
    } as S3BucketImageModel;
}

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    getGeneratedURL(imageName: string): string {
        const { bucketName, location, fileName } = createS3BucketImageModel({ fileName: imageName })
        if (fileName) {
            return `https://${bucketName}.s3.${location}.amazonaws.com/${fileName}`;
        }
        return '';
    }
}
