import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../_services/data/data.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Fodder} from '../../../_models/Fodder';

@Component({
  selector: 'app-showfodder',
  templateUrl: './showfodder.component.html',
  styleUrls: ['./showfodder.component.scss'],

})
export class ShowfodderComponent implements OnInit {
  fodders: Fodder[] = [];
  showEditProduct = false;
  public updateFodderForm: FormGroup;
  private currentFodderName: string;
  errorMessage: string;
  modalTitle: string;
  submitted = false;


  constructor(private service: DataService, public fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.showEditProduct = false;
    this.modalTitle = 'Fodder Dashboard';
    this.getFodder();
    this.service.refreshNeeded.subscribe(() => {
      this.getFodder();
    });
  }

  EditFodder(fodderForm) {
    this.showEditProduct = true;
    this.modalTitle = 'Update fodder';
    this.currentFodderName = fodderForm.name;
    this.updateFodderForm = this.fb.group({
      name: fodderForm.name,
      companyName: fodderForm.companyName,
      price: fodderForm.price,
      weight: fodderForm.weight,
      kcal: fodderForm.nutritionFacts.kcal,
      proteins: fodderForm.nutritionFacts.proteins,
      fats: fodderForm.nutritionFacts.fats,
      vitamins: fodderForm.nutritionFacts.vitamins,
      carbohydrates: fodderForm.nutritionFacts.carbohydrates
    });
  }

  getFodder(): void {
    this.service.getFodder().then(fodders => this.fodders = fodders);
  }

  updateFodder(updateFodderForm) {
    const updateFodder = updateFodderForm.value;
    const fodderID: Fodder[] = this.fodders.filter(x => x.name === this.currentFodderName);
    // @ts-ignore
    this.service.patchFodder(fodderID[0]._id.id.data, updateFodder)
      .subscribe(() => {
          this.showEditProduct = false;
        },
        (error => {
          console.error('error caught in component');
          this.errorMessage = error;
          throw error;
        })
      );
  }

  back() {
    this.showEditProduct = false;
  }
}
