import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-add-trip',
  imports: [ FormsModule ],
  templateUrl: './add-trip.component.html',
  styleUrl: './add-trip.component.scss',
})
export class AddTripComponent {

  title = '';
  destination = '';
  image = '';
  startDate = '';
  endDate = '';

  constructor(private http: HttpClient) {}

  createTrip() {
    const token = localStorage.getItem('token');

    this.http.post(`${environment.apiUrl}/trips`, {
      title: this.title,
      destination: this.destination,
      image: this.image,
      startDate: this.startDate,
      endDate: this.endDate
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: () => alert('Trip created!'),
      error: (err: any) => console.error(err)
    });
  }



}
