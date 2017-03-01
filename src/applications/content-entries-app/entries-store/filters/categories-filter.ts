import * as R from 'ramda';

import { EntriesStore } from "../entries-store.service";
import { ValueFilter } from '../value-filter';

export enum CategoriesFilterModes
{
    Exact,
    Ancestor
}

export class CategoriesFilter extends ValueFilter<number>{

    private _mode : CategoriesFilterModes;

    public get mode() : CategoriesFilterModes{
        return this._mode;
    }

    constructor(value : number, mode : CategoriesFilterModes, label : string, tooltip : string, public fullIdPath : number[])
    {
        super(value, label, tooltip);
        this._mode = mode;
    }
}



EntriesStore.registerFilterType(CategoriesFilter, (items, request) =>
{

    const groupedItems = R.groupBy(item => item.mode +'', items);

    const exactModeItems = groupedItems[CategoriesFilterModes.Exact + ''];
    const hierarchyModeItems = groupedItems[CategoriesFilterModes.Ancestor + ''];

    if (exactModeItems)
    {
        request.filter.categoriesIdsMatchOr = R.reduce((acc : string, item : ValueFilter<number>) =>
        {
            return `${acc}${acc ? ',' : ''}${item.value}`;
        },'',items);
    }

    if (hierarchyModeItems) {
        request.filter.categoryAncestorIdIn = R.reduce((acc: string, item: ValueFilter<number>) => {
            return `${acc}${acc ? ',' : ''}${item.value}`;
        }, '', items);
    }
});
