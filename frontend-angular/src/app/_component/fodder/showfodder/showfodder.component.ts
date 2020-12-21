import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '../../../_services/data/data.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Fodder} from '../../../_models/Fodder';

// TODO RENDERE LA TABELLA CON SUBJECT CON AGGIORNAMENTO COME IN DASHBOARD
// TODO mettere a posto visualizzazione da mobile
// TODO fare anche delete
// TODO controllo form valida da modifica
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

  EditFodder(fodderform) {
    this.showEditProduct = true;
    this.modalTitle = 'Update fodder';
    this.currentFodderName = fodderform.name;
    this.updateFodderForm = this.fb.group({
      name: fodderform.name,
      companyName: fodderform.companyName,
      price: fodderform.price,
      weight: fodderform.weight,
      kcal: fodderform.nutritionFacts.kcal,
      proteins: fodderform.nutritionFacts.proteins,
      fats: fodderform.nutritionFacts.fats,
      vitamins: fodderform.nutritionFacts.vitamins,
      carbohydrates: fodderform.nutritionFacts.carbohydrates
    });
  }

  getFodder(): void {
    this.service.getFodder().then(fodders => this.fodders = fodders);
  }

  updateFodder(updateFodderForm) {
    const updateFodder = updateFodderForm.value;
    const fodderID: Fodder[] = this.fodders.filter(x => x.name === this.currentFodderName);
    // @ts-ignore
    this.service.patchFodder(buf2hex(fodderID[0]._id.id.data), updateFodder)
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
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
