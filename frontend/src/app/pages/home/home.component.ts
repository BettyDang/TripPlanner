import { Component, inject, PLATFORM_ID, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgFor, isPlatformBrowser, NgIf, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ NgFor , NgIf, DatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  private platformId = inject(PLATFORM_ID);
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  isLoading = true;
  isLoggedIn = false;

  trips: any[] = [];

  constructor(
    // private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
  
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  
    if (this.isLoggedIn) {
      this.loadTrips();  
    } else {
      this.loadSampleTrips();
    }
  }

  loadSampleTrips() {
    this.trips = [
      {
        _id: 'demo1',
        title: 'Paris Getaway',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-06-07')
      },
      {
        _id: 'demo2',
        title: 'Tokyo Adventure',
        image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c',
        startDate: new Date('2026-07-10'),
        endDate: new Date('2026-07-20')
      },
      {
        _id: 'demo3',
        title: 'Italy',
        image: 'https://res.klook.com/image/upload/fl_lossy.progressive,q_60/Mobile/City/afmqgg5h0jl9wnr1dfmf.jpg',
        startDate: new Date('2026-08-10'),
        endDate: new Date('2026-08-20')
      },
      {
        _id: 'demo4',
        title: 'Maldive',
        image: 'https://www.sunsiyam.com/media/qnfnzgmq/ssiv_general_04.jpg?width=782&height=521&mode=max',
        startDate: new Date('2026-12-02'),
        endDate: new Date('2026-12-14')
      },
      
      
    ];

    this.isLoading = false;
  }

  goToTrip(id: string) {
    this.router.navigate(['/trips', id]);
  }

  loadTrips() {
    this.api.getTrips().subscribe({
      next: (res: any) => {
        this.trips = res.data.trips;
        this.isLoading = false;
        console.log('Trips: ', this.trips);
        console.log('Loading status: ', this.isLoading);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  handleTripClick(id: string) {
    if (!this.isLoggedIn) {
      alert('Please login to access this feature');
      this.router.navigate(['/login']);
      return;
    }
  
    this.goToTrip(id);
  }

  handleAddClick(event: Event) {
    if (!this.isLoggedIn) {
      event.preventDefault(); 
      alert('Please login to add a trip');
      this.router.navigate(['/login']);
      return;
    }
  
    this.router.navigate(['/add-trip']);
  }

  deleteTrip(id: string, event: Event) {
    event.stopPropagation(); 
  
    const confirmDelete = confirm('Are you sure you want to delete this trip?');
  
    if (!confirmDelete) return;
  
    this.api.deleteTrip(id).subscribe({
      next: () => {
        // remove from UI instantly
        this.trips = this.trips.filter(t => t._id !== id);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete trip');
      }
    });
  }


  
}

