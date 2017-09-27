import {Injectable} from '@angular/core';
import {KalturaClient} from '@kaltura-ng/kaltura-client';
import {AppLocalization} from '@kaltura-ng/kaltura-common';
import {Observable} from 'rxjs/Observable';
import {ConversionProfileListAction} from 'kaltura-typescript-client/types/ConversionProfileListAction';
import {KalturaConversionProfileFilter} from 'kaltura-typescript-client/types/KalturaConversionProfileFilter';
import {KalturaConversionProfileType} from 'kaltura-typescript-client/types/KalturaConversionProfileType';
import {KalturaFilterPager} from 'kaltura-typescript-client/types/KalturaFilterPager';
import {KalturaConversionProfile} from 'kaltura-typescript-client/types/KalturaConversionProfile';

@Injectable()
export class KalturaLiveStreamService {

  constructor(private _kalturaServerClient: KalturaClient,
              private _appLocalization: AppLocalization) {
  }

  public getKalturaConversionProfile(): Observable<KalturaConversionProfile[]> {

    // const entry: KalturaMediaEntry = new KalturaMediaEntry({
    //   name: this._appLocalization.get('app.upload.uploadMenu.createDraft.draftEntry'),
    //   mediaType,
    //   conversionProfileId: conversionProfileId || -1
    // });
    const kalturaConversionProfileFilter = new KalturaConversionProfileFilter({
      typeEqual: KalturaConversionProfileType.liveStream
    });

    const kalturaFilterPager = new KalturaFilterPager({pageSize: 500, pageIndex: 1})

    return this._kalturaServerClient
      .request(new ConversionProfileListAction({filter: kalturaConversionProfileFilter, pager: kalturaFilterPager}))
      .map(response => (<KalturaConversionProfile[]>response.objects));
  }
}
