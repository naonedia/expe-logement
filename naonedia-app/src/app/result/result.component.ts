import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ParticipateInput } from '../shared/model/participateInput.model';
import { PredictService, LoaderService } from '../service';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

const FormValidator: ValidatorFn = (fg: FormGroup) => {
    const price = fg.get('price').value;
    const month = fg.get('month').value;
    const year = fg.get('year').value;

    return price !== null &&
        month !== null &&
        year !== null &&
        price > 0 &&
        month >= 1 &&
        month <= 12 &&
        year >= 2005 &&
        year <= 2018 ? null : { range: true };
};

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['result.scss']
})
export class ResultComponent {
    userInput: ParticipateInput;
    price: number;
    isEstimation: boolean;
    gap: string;

    loading = false;

    form: FormGroup;

    constructor(
        private router: Router,
        private predictService: PredictService,
        private translateService: TranslateService,
        private loaderService: LoaderService,
        private formBuilder: FormBuilder
    ) {

        this.form = this.formBuilder.group({
            price: [this.userInput.price, [Validators.required]],
            month: [this.userInput.month, [Validators.required]],
            year: [this.userInput.year, [Validators.required]]
        }, { validator: FormValidator });


        const extras = this.router.getCurrentNavigation().extras;
        if (extras.state && extras.state.price) {
            this.price = extras.state.price;
        }
        if (extras.state && extras.state.userInput) {
            this.userInput = extras.state.userInput;
        }
        if (extras.state && extras.state.type) {
            this.isEstimation = extras.state.type === 'estimate';
        } else {
            this.router.navigate(['accessdenied']);
        }

        this.loaderService.isLoading.subscribe((v) => {
            this.loading = v;
        });

        this.gap = Math.abs(100 - this.price * 100 / this.userInput.price).toFixed(0);

    }

    onSubmit() {
        this.userInput.price = this.form.get('price').value;
        this.userInput.month = this.form.get('month').value;
        this.userInput.year = this.form.get('year').value;

        this.predictService.participate(this.userInput).subscribe(res => {
            this.router.navigate(['/result'], { state: { userInput: this.userInput } });
        });
    }
}
