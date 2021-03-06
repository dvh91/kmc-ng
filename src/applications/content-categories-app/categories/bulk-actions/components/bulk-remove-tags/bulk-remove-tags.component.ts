import { KalturaCategory } from 'kaltura-typescript-client/types/KalturaCategory';
import { Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { KalturaClient } from '@kaltura-ng/kaltura-client';
import { AppLocalization } from '@kaltura-ng/kaltura-common';
import { BrowserService } from 'app-shared/kmc-shell';
import { AreaBlockerMessage } from '@kaltura-ng/kaltura-ui';
import { PopupWidgetComponent, PopupWidgetStates } from '@kaltura-ng/kaltura-ui/popup-widget/popup-widget.component';

@Component({
  selector: 'kCategoriesBulkRemoveTags',
  templateUrl: './bulk-remove-tags.component.html',
  styleUrls: ['./bulk-remove-tags.component.scss']
})
export class CategoriesBulkRemoveTags implements OnInit, OnDestroy, AfterViewInit {

  @Input() selectedCategories: KalturaCategory[];
  @Input() parentPopupWidget: PopupWidgetComponent;
  @Output() removeTagsChanged = new EventEmitter<string[]>();

  public _loading = false;
  public _sectionBlockerMessage: AreaBlockerMessage;

  public tags: any[] = [];
  private tagsToRemove: string[] = [];

  private _parentPopupStateChangeSubscribe : ISubscription;
  private _confirmClose: boolean = true;

  constructor(private _kalturaServerClient: KalturaClient, private _appLocalization: AppLocalization, private _browserService: BrowserService) {
  }

  ngOnInit() {
    let tags = [];
    // create unique tags array from all selected categories tags
    this.selectedCategories.forEach(category => {
      if (category.tags && category.tags.length){
        const categoryTags = category.tags.split(",").map(tag => {
          return tag.trim()
        });
        categoryTags.forEach(tag => {
          if (tags.indexOf(tag) === -1){
            tags.push(tag);
          }
        });
      }
    });
    tags.sort().forEach(tag => {
      this.tags.push({label: tag, selected: false});
    });
  }

  ngAfterViewInit(){
    if (this.parentPopupWidget) {
      this._parentPopupStateChangeSubscribe = this.parentPopupWidget.state$
        .subscribe(event => {
          if (event.state === PopupWidgetStates.Open) {
            this._confirmClose = true;
          }
          if (event.state === PopupWidgetStates.BeforeClose) {
            if (event.context && event.context.allowClose){
              if (this.tagsToRemove.length && this._confirmClose){
                event.context.allowClose = false;
                this._browserService.confirm(
                  {
                    header: this._appLocalization.get('applications.content.entryDetails.captions.cancelEdit'),
                    message: this._appLocalization.get('applications.content.entryDetails.captions.discard'),
                    accept: () => {
                      this._confirmClose = false;
                      this.parentPopupWidget.close();
                    }
                  }
                );
              }
            }
          }
        });
    }
  }

  ngOnDestroy(){
    this._parentPopupStateChangeSubscribe.unsubscribe();
  }

  updateSelectedTags(){
    this.tagsToRemove = [];
    this.tags.forEach(tag=>{
      if (tag.selected){
        this.tagsToRemove.push(tag.label);
      }
    });
  }

  public _apply(){
    this.removeTagsChanged.emit(this.tagsToRemove);
    this._confirmClose = false;
    this.parentPopupWidget.close();
  }
}

