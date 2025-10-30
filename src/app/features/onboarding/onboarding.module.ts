import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {ProfileOnboardingComponent} from '@feature/onboarding/component/profile-onboarding.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileOnboardingComponent
      }
    ]),
  ],
})
export class OnboardingModule {}
