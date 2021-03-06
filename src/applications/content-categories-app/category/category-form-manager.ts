import { KalturaCategory } from 'kaltura-typescript-client/types/KalturaCategory';
import { Injectable } from '@angular/core';
import '@kaltura-ng/kaltura-common/rxjs/add/operators';
import { FormManager } from '@kaltura-ng/kaltura-ui'
import { CategoryService } from './category.service';
import { KalturaMultiRequest } from 'kaltura-typescript-client';

@Injectable()
export class CategoryFormManager extends FormManager<KalturaCategory, KalturaMultiRequest>
{
    private _categoryStore: CategoryService;

    constructor() {
        super();
    }

    set categoryStore(value: CategoryService) {
        this._categoryStore = value;
    }

    public returnToCategories(): void {
        if (this._categoryStore) {
            this._categoryStore.returnToCategories();
        }
    }
}
