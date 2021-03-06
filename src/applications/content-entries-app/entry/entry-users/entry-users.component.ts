import { Component, ViewChild, AfterViewInit,OnInit, OnDestroy } from '@angular/core';
import { AppLocalization } from '@kaltura-ng/kaltura-common';
import { ISubscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { KalturaUser } from 'kaltura-typescript-client/types/KalturaUser';
import { SuggestionsProviderData } from '@kaltura-ng/kaltura-primeng-ui/auto-complete';
import { PopupWidgetComponent } from '@kaltura-ng/kaltura-ui/popup-widget/popup-widget.component';
import { EntryUsersHandler } from './entry-users-handler';
import { EntryFormManager } from '../entry-form-manager';

@Component({
  selector: 'kEntryUsers',
  templateUrl: './entry-users.component.html',
  styleUrls: ['./entry-users.component.scss']
})
export class EntryUsers implements AfterViewInit, OnInit, OnDestroy {

	@ViewChild('ownerPopup') ownerPopup: PopupWidgetComponent;

	private _searchUsersSubscription : ISubscription;
	public _usersProvider = new Subject<SuggestionsProviderData>();
	public _handler : EntryUsersHandler;

	constructor(private _entryFormManager : EntryFormManager, private _appLocalization: AppLocalization) {
    }


    ngOnInit() {
		this._handler = this._entryFormManager.attachWidget(EntryUsersHandler);
    }

    ngOnDestroy() {
		this._entryFormManager.detachWidget(this._handler);
	}


    ngAfterViewInit() {
    }

    public _openChangeOwner(): void{
	    this._handler.usersForm.patchValue({owners: null});
	    this.ownerPopup.open();
    }

    public _saveAndClose(): void{
	    this._handler.saveOwner();
	    this.ownerPopup.close();
    }

	public _convertUserInputToValidValue(value : string) : any {
		let result = null;
		let tt = this._appLocalization.get('applications.content.entryDetails.users.tooltip', {0: value});
		if (value) {
			result =
				{
					id : value,
					screenName: value,
					userAdded: true,
					tooltip: tt
				};

		}

		return result;
	}


	public _searchUsers(event, formControl?) : void {
		this._usersProvider.next({ suggestions : [], isLoading : true});

		if (this._searchUsersSubscription)
		{
			// abort previous request
			this._searchUsersSubscription.unsubscribe();
			this._searchUsersSubscription = null;
		}

		this._searchUsersSubscription = this._handler.searchUsers(event.query).subscribe(data => {
				const suggestions = [];
				(data || []).forEach((suggestedUser: KalturaUser) => {
					let isSelectable = true;
					if (formControl){
						const owners = this._handler.usersForm.value[formControl] || [];
						isSelectable = !owners.find(user => {
							return user.id === suggestedUser.id;
						});
					}
					suggestions.push({
						name: suggestedUser.screenName + "(" + suggestedUser.id + ")",
						item: suggestedUser,
						isSelectable: isSelectable
					});
				});
				this._usersProvider.next({suggestions: suggestions, isLoading: false});
			},
			(err) => {
				this._usersProvider.next({ suggestions : [], isLoading : false, errorMessage : <any>(err.message || err)});
			});
	}
}

