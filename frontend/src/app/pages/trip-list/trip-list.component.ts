import { Component } from '@angular/core';
import { NgFor, DatePipe } from '@angular/common'; 
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-list',
  standalone: true, 
  imports: [NgFor, DatePipe], 
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.scss']
})
export class TripListComponent {
  trips: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.getTrips().subscribe((res: any) => {
      console.log(res); // 👈 DEBUG
      this.trips = res.data.trips;
    });
  }

  goToTrip(id: string) {
    console.log(id);
  }
}