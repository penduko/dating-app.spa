import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../member/member-edit/member-edit.component';

@Injectable()
export class PreventUnsaveChanges
  implements CanDeactivate<MemberEditComponent> {
  canDeactivate(component: MemberEditComponent) {
    if (component.editForm.dirty) {
      return confirm(
        'Are you sure you want to continue? Any unsave changes will be lost'
      );
    }
    return true;
  }
}
