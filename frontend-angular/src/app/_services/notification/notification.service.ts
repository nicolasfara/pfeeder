import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  constructor(private toast: ToastrService) {
  }

  showNotification(message, notification) {
    if (notification === 'info') {
      this.showInfo(message, notification.message);
    }
    if (notification === 'err') {
      this.showError(message, notification.message);
    }
    if (notification === 'warn') {
      this.showWarning(message, notification.message);
    }
  }

  showError(message, title) {
    this.toast.error(message, title);
  }

  showInfo(message, title) {
    this.toast.info(message, title);
  }

  showWarning(message, title) {
    this.toast.warning(message, title);
  }
}
