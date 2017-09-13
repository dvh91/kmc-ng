import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ISubscription } from 'rxjs/Subscription';
import { AppLocalization } from '@kaltura-ng/kaltura-common';
import { AreaBlockerMessage } from '@kaltura-ng/kaltura-ui';
import { BrowserService } from 'app-shared/kmc-shell/providers/browser.service';

import { SortDirection } from 'app-shared/content-shared/entries-store/entries-store.service';
import { EntriesTableComponent } from 'app-shared/content-shared/entries-table/entries-table.component';
import { BulkLogStoreService } from '../bulk-log-store/bulk-log-store.service';
import { KalturaBulkUpload } from 'kaltura-typescript-client/types/KalturaBulkUpload';

@Component({
  selector: 'kBulkLogList',
  templateUrl: './bulk-log-list.component.html',
  styleUrls: ['./bulk-log-list.component.scss']
})
export class BulkLogListComponent implements OnInit, OnDestroy {
  @Input() selectedBulkLogItems: Array<any> = [];
  @ViewChild(EntriesTableComponent) private dataTable: EntriesTableComponent;

  public isBusy = false;
  public _blockerMessage: AreaBlockerMessage = null;

  private querySubscription: ISubscription;

  public _filter = {
    pageIndex: 0,
    freetextSearch: '',
    pageSize: null, // pageSize is set to null by design. It will be modified after the first time loading entries
    sortBy: 'createdAt',
    sortDirection: SortDirection.Desc
  };

  constructor(private _appLocalization: AppLocalization,
              private _router: Router,
              private _browserService: BrowserService,
              public _store: BulkLogStoreService) {
  }

  ngOnInit() {
    this._store.reload(true);
    this._store.bulkLog$.subscribe(res => {
      console.log(res);
    })
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
      this.querySubscription = null;
    }
  }

  private _deleteBulkLog(id: number): void {
    this.isBusy = true;
    this._blockerMessage = null;

    this._store.deleteBulkLog(id)
      .subscribe(
        () => {
          this.isBusy = false;
          this._store.reload(true)
        },
        () => {
          this._blockerMessage = new AreaBlockerMessage({
            message: this._appLocalization.get('applications.content.bulkUpload.deleteLog.error'),
            buttons: [{
              label: this._appLocalization.get('app.common.ok'),
              action: () => {
                this._blockerMessage = null;
                this.isBusy = false;
              }
            }]
          });
        }
      );
  }

  public _removeTag(tag: any) {
    this._clearSelection();
  }

  public _removeAllTags() {
    this._clearSelection();
  }

  public _onPaginationChanged(state: any): void {
    if (state.page !== this._filter.pageIndex || state.rows !== this._filter.pageSize) {
      this._filter.pageIndex = state.page;
      this._filter.pageSize = state.rows;

      this._clearSelection();
    }
  }

  public _reload() {
    this._clearSelection();
  }

  public _onActionSelected(event: { action: string, bulkLogItem: KalturaBulkUpload }): void {
    switch (event.action) {
      case 'delete':
        this._browserService.confirm(
          {
            header: this._appLocalization.get('applications.content.bulkUpload.deleteLog.header'),
            message: this._appLocalization.get('applications.content.bulkUpload.deleteLog.message'),
            accept: () => {
              this._deleteBulkLog(event.bulkLogItem.id);
            }
          }
        );
        break;
      default:
        break;
    }
  }

  public _clearSelection() {
    this.selectedBulkLogItems = [];
  }
}

