import { KalturaUploadFile } from '@kaltura-ng/kaltura-server-utils';

export class NewEntryCaptionFile extends KalturaUploadFile {
  constructor(file: File) {
    super(file);
  }
}
