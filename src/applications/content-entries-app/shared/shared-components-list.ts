import { CategoriesTreeComponent } from './categories-tree/categories-tree.component';
import { EntryTypePipe } from './pipes/entry-type.pipe';
import { EntryStatusPipe } from './pipes/entry-status.pipe';


export const SharedComponentsList = [
    EntryStatusPipe,
    EntryTypePipe,
    CategoriesTreeComponent
];